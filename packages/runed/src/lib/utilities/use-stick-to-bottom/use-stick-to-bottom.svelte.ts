import type { Getter, MaybeGetter } from "$lib/internal/types.js";
import { defaultWindow, type ConfigurableWindow } from "$lib/internal/configurable-globals.js";
import { watch } from "../watch/watch.svelte.js";
import { extract } from "../extract/extract.svelte.js";

/**
 * Simple implementation of isEqual for comparing objects
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns Whether the values are equal
 */
function isEqual<T>(a: T, b: T): boolean {
	// Simple implementation for object comparison
	if (a === b) return true;
	if (a == null || b == null) return a === b;
	if (typeof a !== "object" || typeof b !== "object") return a === b;

	// Convert to JSON strings to compare (works for simple objects)
	return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Checks if an element is scrollable
 * @param el - The element to check
 * @returns boolean indicating if the element is scrollable
 */
const isScrollable = function (el: ParentNode) {
	if (!(el instanceof Element)) {
		return false;
	}

	const overflowYStyle = window.getComputedStyle(el).overflowY;
	const isOverflowHidden = overflowYStyle.indexOf("hidden") !== -1;
	const isOverflowScrollOrAuto = overflowYStyle === "scroll" || overflowYStyle === "auto";

	// Check if element has scrollable content OR is styled to be scrollable
	return (!isOverflowHidden && isOverflowScrollOrAuto) || el.scrollHeight > el.clientHeight;
};

/**
 * Finds the first scrollable parent of an element
 * @param el - The element to start searching from
 * @returns The first scrollable parent element or document.body
 */
const getScrollableParent = function (el: HTMLElement | null): HTMLElement | null {
	if (!el || el === document.body) {
		return document.body;
	}

	if (isScrollable(el)) {
		return el;
	}

	return getScrollableParent(el.parentElement);
};

/** Default spring animation properties */
const DEFAULT_SPRING_ANIMATION = {
	/**
	 * A value from 0 to 1, on how much to damp the animation.
	 * 0 means no damping, 1 means full damping.
	 *
	 * @default 0.7
	 */
	damping: 0.7,

	/**
	 * The stiffness of how fast/slow the animation gets up to speed.
	 *
	 * @default 0.05
	 */
	stiffness: 0.05,

	/**
	 * The inertial mass associated with the animation.
	 * Higher numbers make the animation slower.
	 *
	 * @default 1.25
	 */
	mass: 1.25,
};

/** Default offset in pixels to consider the scroll position "near bottom" */
const STICK_TO_BOTTOM_OFFSET_PX = 70;

/** Animation frame interval for 60fps */
const SIXTY_FPS_INTERVAL_MS = 1000 / 60;

/** Duration to retain animation after resize events */
const RETAIN_ANIMATION_DURATION_MS = 350;

/**
 * Spring animation properties
 */
export interface SpringAnimation extends Partial<typeof DEFAULT_SPRING_ANIMATION> {}

/**
 * Animation type can be either a smooth/instant behavior or spring animation properties
 */
export type Animation = ScrollBehavior | SpringAnimation;

/**
 * Internal state for stick-to-bottom tracking
 */
interface StickToBottomState {
	animation?: {
		behavior: "instant" | Required<SpringAnimation>;
		ignoreEscapes: boolean;
		promise: Promise<boolean>;
		interrupted?: boolean;
	};
	resizeDifference: number;
	accumulated: number;
	velocity: number;
	lastTick?: number;
	ignoreScrollToTop?: number;
	lastScrollTop?: number;
}

/**
 * Options for scrolling to bottom
 */
export interface ScrollToBottomOptionsObject {
	animation?: Animation;

	/**
	 * Whether to wait for any existing scrolls to finish before
	 * performing this one. Or if a millisecond is passed,
	 * it will wait for that duration before performing the scroll.
	 *
	 * @default false
	 */
	wait?: boolean | number;

	/**
	 * Whether to prevent the user from escaping the scroll,
	 * by scrolling up with their mouse.
	 */
	ignoreEscapes?: boolean;

	/**
	 * Only scroll to the bottom if we're already at the bottom.
	 *
	 * @default false
	 */
	preserveScrollPosition?: boolean;

	/**
	 * The extra duration in ms that this scroll event should persist for.
	 * (in addition to the time that it takes to get to the bottom)
	 *
	 * Not to be confused with the duration of the animation -
	 * for that you should adjust the animation option.
	 *
	 * @default 0
	 */
	duration?: number | Promise<void>;
}

export type ScrollToBottomOptions = ScrollBehavior | ScrollToBottomOptionsObject;

/**
 * Options for useStickToBottom
 */
export interface UseStickToBottomOptions extends ConfigurableWindow, SpringAnimation {
	/** Whether to initially scroll to bottom (default: true) */
	initial?: Animation | boolean;
	/** Offset in pixels to consider "near bottom" (default: 70) */
	offset?: number;
	/** Animation to use during resize events */
	resize?: Animation;
}

/**
 * Function to scroll to the bottom
 */
export type ScrollToBottom = (
	scrollOptions?: Animation | ScrollToBottomOptions
) => Promise<boolean>;

/**
 * Function to stop a scroll animation
 */
export type StopScroll = () => void;

/**
 * Cache for animation configurations to prevent duplicate objects
 */
const animationCache = new Map<string, Readonly<Required<SpringAnimation>>>();

/**
 * Merges multiple animation configurations
 * @param animations - Animation configurations to merge
 * @returns The merged animation configuration
 */
function mergeAnimations(...animations: (Animation | boolean | undefined)[]) {
	const result = { ...DEFAULT_SPRING_ANIMATION };
	let instant = false;

	for (const animation of animations) {
		if (animation === "instant") {
			instant = true;
			continue;
		}

		if (typeof animation !== "object") {
			continue;
		}

		instant = false;

		result.damping = animation.damping ?? result.damping;
		result.stiffness = animation.stiffness ?? result.stiffness;
		result.mass = animation.mass ?? result.mass;
	}

	const key = JSON.stringify(result);

	if (!animationCache.has(key)) {
		animationCache.set(key, Object.freeze(result));
	}

	return instant ? "instant" : animationCache.get(key)!;
}

/**
 * An utility that tracks if a scrollable container is at the bottom and provides
 * functionality to stick to the bottom as content changes.
 *
 * @param contentToTrack - Getter function that returns the element whose content changes should be tracked
 * @param options - Configuration options
 * @param scroller - Optional getter function that returns a custom scrollable container
 *
 * @returns Object containing:
 * - isNearBottom: Whether the scroller is near the bottom
 * - scrollToBottom: Function to scroll to bottom with animation options
 * - interruptAnimation: Function to interrupt ongoing scroll animations
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useStickToBottom } from 'runed';
 *
 *   let messageContainer: HTMLElement | null = $state(null);
 *
 *   const stickToBottom = useStickToBottom(
 *     () => messageContainer,
 *     { offset: 100 }
 *   );
 * </script>
 *
 * <div class="messages" bind:this={messageContainer}>
 *   {#each messages as message}
 *     <div class="message">{message}</div>
 *   {/each}
 * </div>
 *
 * {#if !stickToBottom.isNearBottom}
 *   <button
 *     onclick={() => stickToBottom.scrollToBottom()}
 *   >
 *     Scroll to bottom
 *   </button>
 * {/if}
 * ```
 */
export function useStickToBottom(
	contentToTrack: Getter<HTMLElement | null | undefined>,
	_options: MaybeGetter<UseStickToBottomOptions> = {},
	scroller: Getter<HTMLElement | null | undefined> = () => null
) {
	const options = $derived(extract(_options));
	const { window = defaultWindow } = options;

	let scrollRef: HTMLElement | null = $state(null);
	let contentRef: HTMLElement | null = $state(null);

	let scrollLock = $state(true);
	let scrollTop = $state(0);

	const updateScrollTop = (v: number) => {
		if (scrollRef) {
			scrollTop = v;
			scrollRef.scrollTop = v;
			state.ignoreScrollToTop = scrollRef.scrollTop;
		}
	};

	let targetScrollTop = $state(0);

	const scrollDifference = $derived(targetScrollTop - scrollTop);

	const isNearBottom = $derived(scrollDifference <= (options.offset ?? STICK_TO_BOTTOM_OFFSET_PX));

	const state: StickToBottomState = $state({
		resizeDifference: 0,
		accumulated: 0,
		velocity: 0,
		animation: undefined,
	});

	/**
	 * Scrolls to the bottom of the container with animation options
	 * @param scrollOptions - Options for the scroll animation
	 * @returns Promise that resolves when scrolling is complete
	 */
	const scrollToBottom: ScrollToBottom = (scrollOptions = {}) => {
		// Convert string to object with animation property
		let normalizedOptions: ScrollToBottomOptionsObject;

		if (typeof scrollOptions === "string") {
			normalizedOptions = { animation: scrollOptions };
		} else if (
			!("animation" in scrollOptions) &&
			!("wait" in scrollOptions) &&
			!("ignoreEscapes" in scrollOptions) &&
			!("preserveScrollPosition" in scrollOptions) &&
			!("duration" in scrollOptions)
		) {
			// If it's just an Animation object (SpringAnimation or ScrollBehavior)
			normalizedOptions = { animation: scrollOptions as Animation };
		} else {
			// It's already a ScrollToBottomOptionsObject
			normalizedOptions = scrollOptions as ScrollToBottomOptionsObject;
		}

		const waitElapsed = Date.now() + (Number(normalizedOptions.wait) || 0);
		const behavior = mergeAnimations(options, normalizedOptions.animation);
		const { ignoreEscapes = false } = normalizedOptions;

		let durationElapsed: number;
		let startTarget = targetScrollTop;

		if (normalizedOptions.duration instanceof Promise) {
			normalizedOptions.duration.finally(() => {
				durationElapsed = Date.now();
			});
		} else {
			durationElapsed = waitElapsed + (normalizedOptions.duration ?? 0);
		}

		const next = async (): Promise<boolean> => {
			// Check if animation was interrupted before scheduling next frame
			if (state.animation?.interrupted) {
				state.animation = undefined;
				state.lastTick = undefined;
				state.velocity = 0;
				state.accumulated = 0;
				return false;
			}

			const promise = new Promise(requestAnimationFrame).then(() => {
				const scrollTopSnapshot = scrollTop;
				const tick = performance.now();
				const tickDelta = (tick - (state.lastTick ?? tick)) / SIXTY_FPS_INTERVAL_MS;
				state.animation ||= { behavior, promise, ignoreEscapes };

				if (isEqual($state.snapshot(state.animation?.behavior), behavior)) {
					state.lastTick = tick;
				}

				if (waitElapsed > Date.now()) {
					return next();
				}

				if (scrollTopSnapshot < Math.min(startTarget, targetScrollTop)) {
					if (isEqual($state.snapshot(state.animation?.behavior), behavior)) {
						if (behavior === "instant") {
							updateScrollTop(targetScrollTop);
							return next();
						}

						state.velocity =
							(behavior.damping * state.velocity + behavior.stiffness * scrollDifference) /
							behavior.mass;
						state.accumulated += state.velocity * tickDelta;
						updateScrollTop(scrollTop + state.accumulated);

						if (scrollTopSnapshot !== scrollTop) {
							state.accumulated = 0;
						}
					}

					return next();
				}

				if (durationElapsed > Date.now()) {
					startTarget = targetScrollTop;

					return next();
				}

				state.animation = undefined;

				/**
				 * If we're still below the target, then queue
				 * up another scroll to the bottom with the last
				 * requested animation.
				 */
				if (scrollTop < targetScrollTop) {
					return scrollToBottom({
						animation: mergeAnimations(options, options.resize),
						ignoreEscapes,
						duration: Math.max(0, durationElapsed - Date.now()) || undefined,
					});
				}

				return true;
			});

			return promise.then((completed) => {
				requestAnimationFrame(() => {
					if (!state.animation) {
						state.lastTick = undefined;
						state.velocity = 0;
					}
				});

				return completed;
			});
		};

		if (normalizedOptions.wait !== true) {
			state.animation = undefined;
		}

		if (
			state.animation?.behavior &&
			isEqual($state.snapshot(state.animation?.behavior), behavior)
		) {
			return state.animation.promise;
		}

		return next();
	};

	/**
	 * Interrupts any ongoing scroll animation
	 */
	const interruptAnimation = () => {
		if (state.animation) {
			state.animation.interrupted = true;
		}
	};

	/**
	 * Handles scroll events on the scrollable container
	 */
	const handleScroll = () => {
		let { lastScrollTop = scrollTop } = state;
		scrollTop = scrollRef?.scrollTop ?? 0;

		state.lastScrollTop = scrollTop;
		state.ignoreScrollToTop = undefined;

		if (state.ignoreScrollToTop && state.ignoreScrollToTop > scrollTop) {
			/**
			 * When the user scrolls up while the animation plays, the `scrollTop` may
			 * not come in separate events; if this happens, to make sure `isScrollingUp`
			 * is correct, set the lastScrollTop to the ignored event.
			 */
			lastScrollTop = state.ignoreScrollToTop;
		}

		/**
		 * Scroll events may come before a ResizeObserver event,
		 * so in order to ignore resize events correctly we use a
		 * timeout.
		 *
		 * @see https://github.com/WICG/resize-observer/issues/25#issuecomment-248757228
		 */
		setTimeout(() => {
			/**
			 * When theres a resize difference ignore the resize event.
			 */
			if (state.resizeDifference || scrollTop === state.ignoreScrollToTop) {
				return;
			}

			const isScrollingDown = scrollTop > lastScrollTop;
			const isScrollingUp = scrollTop < lastScrollTop;

			if (state.animation?.ignoreEscapes) {
				updateScrollTop(lastScrollTop);
				return;
			}
			if (isScrollingUp) {
				scrollLock = false;

				// Interrupt any ongoing animation when user escapes
				if (state.animation) {
					state.animation.interrupted = true;
				}
			}

			if (isScrollingDown) {
				scrollLock = true;
			}
		}, 1);
	};

	/**
	 * Handles wheel events for scroll locking and animation interruption
	 */
	const handleWheel = ({ target, deltaY }: WheelEvent) => {
		let element = getScrollableParent(target as HTMLElement) ?? target;

		/**
		 * The browser may cancel the scrolling from the mouse wheel
		 * if we update it from the animation in meantime.
		 * To prevent this, always escape when the wheel is scrolled up.
		 */
		if (
			element === scrollRef &&
			deltaY < 0 &&
			scrollRef &&
			scrollRef.scrollHeight > scrollRef.clientHeight &&
			!state.animation?.ignoreEscapes
		) {
			scrollLock = false;

			// Interrupt any ongoing animation on wheel events that escape the lock
			if (state.animation) {
				state.animation.interrupted = true;
			}
		}
	};

	/**
	 * Setup resize observer and event listeners
	 */
	const cleanupEffect = $effect.root(() => {
		watch.pre([scroller, contentToTrack], () => {
			contentRef = contentToTrack() ?? null;

			if (!contentRef) return;

			const targetScroller = scroller() ?? getScrollableParent(contentRef);

			scrollRef =
				targetScroller === document.body
					? (document.scrollingElement as HTMLElement)
					: targetScroller;

			if (!scrollRef || !window) return;

			let previousHeight: number | undefined;

			const resizeObserver = new ResizeObserver((entries) => {
				if (!entries || entries.length === 0) return;

				const entry = entries[0];
				if (!entry) return;

				const { height } = entry.contentRect;
				const difference = height - (previousHeight ?? height);

				state.resizeDifference = difference;

				targetScrollTop =
					scrollRef && scrollRef.scrollHeight
						? scrollRef.scrollHeight - 1 - scrollRef.clientHeight
						: 0;

				/**
				 * Sometimes the browser can overscroll past the target,
				 * so check for this and adjust appropriately.
				 */
				if (scrollTop > targetScrollTop) {
					updateScrollTop(targetScrollTop);
				}

				if (difference >= 0 && scrollLock) {
					/**
					 * If it's a positive resize, scroll to the bottom when
					 * we're already at the bottom.
					 */
					const animation = mergeAnimations(
						options,
						previousHeight ? options.resize : options.initial
					);

					scrollToBottom({
						animation,
						wait: true,
						preserveScrollPosition: true,
						duration: animation === "instant" ? undefined : RETAIN_ANIMATION_DURATION_MS,
					});
				}

				previousHeight = height;

				/**
				 * Reset the resize difference after the scroll event
				 * has fired. Requires a rAF to wait for the scroll event,
				 * and a setTimeout to wait for the other timeout we have in
				 * resizeObserver in case the scroll event happens after the
				 * resize event.
				 */
				requestAnimationFrame(() => {
					setTimeout(() => {
						if (state.resizeDifference === difference) {
							state.resizeDifference = 0;
						}
					}, 1);
				});
			});

			resizeObserver.observe(contentRef);

			// Attach scroll and wheel event listeners
			const scrollTarget = targetScroller === document.body ? window : scrollRef;

			scrollTarget.addEventListener("scroll", handleScroll, { passive: true });
			scrollTarget.addEventListener("wheel", handleWheel as EventListener, { passive: true });

			// Initial scroll to bottom if needed
			if (options.initial !== false) {
				scrollToBottom(options.initial === true ? "instant" : options.initial || "instant");
			}

			// Return cleanup function
			return () => {
				scrollTarget.removeEventListener("scroll", handleScroll);
				scrollTarget.removeEventListener("wheel", handleWheel as EventListener);
				resizeObserver?.disconnect();
			};
		});
	});

	// Clean up when scroller changes
	watch(scroller, () => {
		return cleanupEffect;
	});

	// Return the public API
	return {
		scrollToBottom,
		get isNearBottom() {
			return isNearBottom;
		},
		interruptAnimation,
	};
}

export type UseStickToBottomReturn = ReturnType<typeof useStickToBottom>;
