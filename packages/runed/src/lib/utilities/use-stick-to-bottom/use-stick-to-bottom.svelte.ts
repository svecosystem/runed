import type { Getter } from "$lib/internal/types.js";
import { defaultWindow, type ConfigurableWindow } from "$lib/internal/configurable-globals.js";
import { watch } from "../watch/watch.svelte.js";

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

/**
 * Options for useStickToBottom
 */
export interface UseStickToBottomOptions extends ConfigurableWindow {
	/** Whether to initially scroll to bottom (default: true) */
	initial?: boolean;
	/** Offset in pixels to consider "near bottom" (default: 70) */
	offset?: number;
}

/** Default offset in pixels to consider the scroll position "near bottom" */
const STICK_TO_BOTTOM_OFFSET_PX = 70;

/**
 * An utility that tracks if a scrollable container is at the bottom and provides
 * functionality to stick to the bottom as content changes.
 *
 * @param contentToTrack - Getter function that returns the element whose content changes should be tracked
 * @param options - Configuration options
 * @param scroller - Optional getter function that returns a custom scrollable container
 *
 * @returns Object containing:
 * - state: Current scroll state (isAtBottom, isNearBottom)
 * - scrollToBottom: Function to scroll to bottom
 * - stop: Function to cleanup listeners
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useStickToBottom } from 'runed';
 *
 *   let messageContainer: HTMLElement | null = $state(null);
 *
 *   const { state, scrollToBottom } = useStickToBottom(
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
 * {#if !state.isAtBottom}
 *   <button
 *     onclick={() => scrollToBottom()}
 *   >
 *     Scroll to bottom
 *   </button>
 * {/if}
 * ```
 */
export function useStickToBottom(
	contentToTrack: Getter<HTMLElement | null | undefined>,
	options: UseStickToBottomOptions = {},
	scroller: Getter<HTMLElement | null | undefined> = () => null
) {
	const { window = defaultWindow } = options;

	const status = $state<{
		isAtBottom: boolean;
		isNearBottom: boolean;
	}>({
		isAtBottom: options.initial ?? true,
		isNearBottom: false,
	});

	let scrollerElement: HTMLElement | null = $state(null);
	let contentElement: HTMLElement | null | undefined = $state(null);

	function getTargetScrollTop() {
		if (!scrollerElement) return 0;
		return scrollerElement.scrollHeight - scrollerElement.clientHeight;
	}

	function checkIsNearBottom() {
		if (!scrollerElement) return;
		const scrollDifference = getTargetScrollTop() - scrollerElement.scrollTop;
		const newIsNearBottom = scrollDifference <= (options.offset ?? STICK_TO_BOTTOM_OFFSET_PX);

		if (newIsNearBottom !== status.isNearBottom) {
			status.isNearBottom = newIsNearBottom;
		}
	}

	function scrollToBottom(behavior: ScrollBehavior = "smooth") {
		if (!scrollerElement) return;
		const targetScrollTop = getTargetScrollTop();
		scrollerElement.scrollTo({
			top: targetScrollTop,
			behavior,
		});
	}

	function handleScroll() {
		checkIsNearBottom();
		const newIsAtBottom = status.isNearBottom;

		if (newIsAtBottom !== status.isAtBottom) {
			status.isAtBottom = newIsAtBottom;
		}
	}

	const stop = $effect.root(() => {
		watch.pre([scroller, contentToTrack], () => {
			contentElement = contentToTrack();
			console.log({ contentElement });

			if (!contentElement) return;

			const targetScroller = scroller() ?? getScrollableParent(contentElement);

			scrollerElement =
				targetScroller === document.body
					? (document.scrollingElement as HTMLElement)
					: targetScroller;

			if (!scrollerElement || !window) return;

			console.log({ contentElement, scrollerElement });

			const resizeObserver = new ResizeObserver(() => {
				checkIsNearBottom();
				if (status.isAtBottom) {
					scrollToBottom("instant");
				}
			});

			resizeObserver.observe(contentElement);

			const scrollTarget = targetScroller === document.body ? window : scrollerElement;
			scrollTarget.addEventListener("scroll", handleScroll, { passive: true });

			if (options.initial !== false) {
				scrollToBottom("instant");
			}

			return () => {
				scrollTarget.removeEventListener("scroll", handleScroll);
				resizeObserver?.disconnect();
			};
		});
	});

	watch(scroller, () => {
		return stop;
	});

	return { stop, status, scrollToBottom };
}

export type UseStickToBottomReturn = ReturnType<typeof useStickToBottom>;
