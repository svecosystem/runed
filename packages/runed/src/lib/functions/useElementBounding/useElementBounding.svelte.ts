import type { MaybeBoxOrGetter } from "$lib/internal/types.js";

export type UseElementBoundingOptions = {
	/**
	 * Reset values to 0 when the element is destroyed.
	 *
	 * @defaultValue true
	 */
	resetOnDestroy?: boolean;

	/**
	 * Listen to window resize events.
	 *
	 * @defaultValue true
	 */
	windowResize?: boolean;

	/**
	 * Listen to window scroll events.
	 *
	 * @defaultValue true
	 */
	windowScroll?: boolean;
};

export function useElementBounding(
	target: MaybeBoxOrGetter<HTMLElement | undefined | null>,
	options: UseElementBoundingOptions = {}
) {
	const { reset = true, windowResize = true, windowScroll = true } = options;

	const size = $state({
		height: 0,
		width: 0,
		x: 0,
		y: 0,
		bottom: 0,
		left: 0,
		right: 0,
		top: 0,
	});
}
