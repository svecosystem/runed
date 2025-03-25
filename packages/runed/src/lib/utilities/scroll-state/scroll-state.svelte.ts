import type { MaybeGetter } from "$lib/internal/types.js";
import { AnimationFrames, useDebounce, useEventListener } from "runed";
import { onMount } from "svelte";
import { extract } from "../extract/extract.svelte.js";
import { noop } from "$lib/internal/utils/function.js";

export interface ScrollStateOptions {
	/**
	 * The target element.
	 */
	element: MaybeGetter<HTMLElement | Window | Document | null | undefined>;

	// /**
	//  * Throttle time for scroll event, it’s disabled by default.
	//  *
	//  * @default 0
	//  */
	// throttle?: MaybeGetter<number | undefined>;

	/**
	 * The check time when scrolling ends.
	 * This configuration will be setting to (throttle + idle) when the `throttle` is configured.
	 *
	 * @default 200
	 */
	idle?: MaybeGetter<number | undefined>;

	/**
	 * Offset arrived states by x pixels
	 *
	 */
	offset?: MaybeGetter<
		| {
				left?: number;
				right?: number;
				top?: number;
				bottom?: number;
		  }
		| undefined
	>;

	/**
	 * Trigger it when scrolling.
	 *
	 */
	onScroll?: (e: Event) => void;

	/**
	 * Trigger it when scrolling ends.
	 *
	 */
	onStop?: (e: Event) => void;

	/**
	 * Listener options for scroll event.
	 *
	 * @default {capture: false, passive: true}
	 */
	eventListenerOptions?: AddEventListenerOptions;

	/**
	 * Optionally specify a scroll behavior of `auto` (default, not smooth scrolling) or
	 * `smooth` (for smooth scrolling) which takes effect when changing the `x` or `y` refs.
	 *
	 * @default 'auto'
	 */
	behavior?: MaybeGetter<ScrollBehavior | undefined>;

	/**
	 * On error callback
	 *
	 * Default log error to `console.error`
	 */
	onError?: (error: unknown) => void;
}

/**
 * We have to check if the scroll amount is close enough to some threshold in order to
 * more accurately calculate arrivedState. This is because scrollTop/scrollLeft are non-rounded
 * numbers, while scrollHeight/scrollWidth and clientHeight/clientWidth are rounded.
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#determine_if_an_element_has_been_totally_scrolled
 */
const ARRIVED_STATE_THRESHOLD_PIXELS = 1;

/**
 * Reactive scroll.
 *
 * @see https://vueuse.org/useScroll for the inspiration behind this utility.
 * @param element
 * @param options
 */
export class ScrollState {
	#options!: ScrollStateOptions;
	element = $derived(extract(this.#options.element));
	// throttle = $derived(extract(this.#options.throttle, 0));
	idle = $derived.by(() => extract(this.#options?.idle, 200));
	offset = $derived(
		extract(this.#options.offset, {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
		})
	);
	onScroll = $derived(this.#options.onScroll ?? noop);
	onStop = $derived(this.#options.onStop ?? noop);
	eventListenerOptions = $derived(
		this.#options.eventListenerOptions ?? {
			capture: false,
			passive: true,
		}
	);
	behavior = $derived(extract(this.#options.behavior, "auto"));
	onError = $derived(
		this.#options.onError ??
			((e: unknown) => {
				console.error(e);
			})
	);

	/** State */
	internalX = $state(0);
	internalY = $state(0);

	// Use a get/set pair for x and y because we want to write the value to the refs
	// during a `scrollTo()` without firing additional `scrollTo()`s in the process.
	#x = $derived(this.internalX);
	get x() {
		return this.#x;
	}
	set x(v) {
		this.scrollTo(v, undefined);
	}

	#y = $derived(this.internalY);
	get y() {
		return this.#y;
	}
	set y(v) {
		this.scrollTo(undefined, v);
	}

	isScrolling = $state(false);
	arrived = $state({
		left: true,
		right: false,
		top: true,
		bottom: false,
	});
	directions = $state({
		left: false,
		right: false,
		top: false,
		bottom: false,
	});

	constructor(options: ScrollStateOptions) {
		this.#options = options;

		useEventListener(
			() => this.element,
			"scroll",
			// throttle ? useThrottleFn(onScrollHandler, throttle, true, false) : onScrollHandler,
			this.onScrollHandler,
			this.eventListenerOptions
		);

		useEventListener(
			() => this.element,
			"scrollend",
			(e) => this.onScrollEnd(e),
			this.eventListenerOptions
		);

		onMount(() => {
			this.setArrivedState();
		});

		// useResizeObserver(
		// 	() => (isHtmlElement(this.element) ? this.element : null),
		// 	() => {
		// 		setTimeout(() => {
		// 			this.setArrivedState();
		// 		}, 100);
		// 	}
		// );

		// overkill?
		new AnimationFrames(() => this.setArrivedState());
	}

	setArrivedState = () => {
		if (!window || !this.element) return;

		const el: Element = ((this.element as Window)?.document?.documentElement ||
			(this.element as Document)?.documentElement ||
			(this.element as HTMLElement | SVGElement)) as Element;

		const { display, flexDirection, direction } = getComputedStyle(el);
		const directionMultipler = direction === "rtl" ? -1 : 1;

		const scrollLeft = el.scrollLeft;
		if (scrollLeft !== this.internalX) {
			this.directions.left = scrollLeft < this.internalX;
			this.directions.right = scrollLeft > this.internalX;
		}

		const left = scrollLeft * directionMultipler <= (this.offset.left || 0);
		const right =
			scrollLeft * directionMultipler + el.clientWidth >=
			el.scrollWidth - (this.offset.right || 0) - ARRIVED_STATE_THRESHOLD_PIXELS;

		if (display === "flex" && flexDirection === "row-reverse") {
			this.arrived.left = right;
			this.arrived.right = left;
		} else {
			this.arrived.left = left;
			this.arrived.right = right;
		}

		this.internalX = scrollLeft;

		let scrollTop = el.scrollTop;

		// patch for mobile compatible
		if (this.element === window.document && !scrollTop) scrollTop = window.document.body.scrollTop;

		if (scrollTop !== this.internalY) {
			this.directions.top = scrollTop < this.internalY;
			this.directions.bottom = scrollTop > this.internalY;
		}
		const top = scrollTop <= (this.offset.top || 0);
		const bottom =
			scrollTop + el.clientHeight >=
			el.scrollHeight - (this.offset.bottom || 0) - ARRIVED_STATE_THRESHOLD_PIXELS;

		/**
		 * reverse columns and rows behave exactly the other way around,
		 * bottom is treated as top and top is treated as the negative version of bottom
		 */
		if (display === "flex" && flexDirection === "column-reverse") {
			this.arrived.top = bottom;
			this.arrived.bottom = top;
		} else {
			this.arrived.top = top;
			this.arrived.bottom = bottom;
		}

		this.internalY = scrollTop;
	};

	onScrollHandler = (e: Event) => {
		if (!window) return;

		this.setArrivedState();

		this.isScrolling = true;
		this.onScrollEndDebounced(e);
		this.onScroll(e);
	};

	scrollTo(x: number | undefined, y: number | undefined) {
		if (!window) return;

		(this.element instanceof Document ? window.document.body : this.element)?.scrollTo({
			top: y ?? this.y,
			left: x ?? this.x,
			behavior: this.behavior,
		});
		const scrollContainer =
			(this.element as Window)?.document?.documentElement ||
			(this.element as Document)?.documentElement ||
			(this.element as Element);
		if (x != null) this.internalX = scrollContainer.scrollLeft;
		if (y != null) this.internalY = scrollContainer.scrollTop;
	}

	scrollToTop() {
		this.scrollTo(undefined, 0);
	}

	scrollToBottom() {
		if (!window) return;

		const scrollContainer =
			(this.element as Window)?.document?.documentElement ||
			(this.element as Document)?.documentElement ||
			(this.element as Element);
		this.scrollTo(undefined, scrollContainer.scrollHeight);
	}

	onScrollEnd = (e: Event) => {
		// dedupe if support native scrollend event
		if (!this.isScrolling) return;

		this.isScrolling = false;
		this.directions.left = false;
		this.directions.right = false;
		this.directions.top = false;
		this.directions.bottom = false;
		this.onStop(e);
	};
	onScrollEndDebounced = useDebounce(this.onScrollEnd, () => this.idle);
}
