import { untrack } from "svelte";
import { box } from "../box/box.svelte.js";
import type { MaybeBoxOrGetter } from "$lib/internal/types.js";

export type UseElementBoundingOptions = {
	/**
	 * Reset values to 0 when the element is destroyed.
	 *
	 * @defaultValue true
	 */
	reset?: boolean;

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

const defaultSize = {
	height: 0,
	width: 0,
	x: 0,
	y: 0,
	bottom: 0,
	left: 0,
	right: 0,
	top: 0,
};

export function useElementBounding(
	_node: MaybeBoxOrGetter<HTMLElement | undefined | null>,
	options: UseElementBoundingOptions = {}
) {
	const node = box.from(_node);
	const { reset = true, windowResize = true, windowScroll = true } = options;

	const size = $state(defaultSize);

	function update() {
		if (!node.value) {
			if (reset) {
				untrack(() => {
					Object.assign(size, defaultSize);
				});
			}
			return;
		}
		const rect = node.value.getBoundingClientRect();

		untrack(() => {
			size.width = rect.width;
			size.height = rect.height;
			size.x = rect.x;
			size.y = rect.y;
			size.bottom = rect.bottom;
			size.left = rect.left;
			size.right = rect.right;
			size.top = rect.top;
		});
	}

	$effect(() => {
		update();
	});
}
