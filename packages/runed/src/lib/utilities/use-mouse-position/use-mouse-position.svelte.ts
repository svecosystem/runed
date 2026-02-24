import { extract } from "../extract/extract.svelte.js";
import { useEventListener } from "../use-event-listener/use-event-listener.svelte.js";
import type { MaybeElementGetter } from "$lib/internal/types.js";
import { defaultWindow, type ConfigurableWindow } from "$lib/internal/configurable-globals.js";

export type UseMousePositionOptions = ConfigurableWindow & {
	/**
	 * Whether to start tracking immediately.
	 * If `false`, the listener is not active until `start()` is called.
	 *
	 * @default true
	 */
	immediate?: boolean;
};

export type UseMousePositionReturn = {
	/** Cursor x coordinate relative to the viewport (`clientX`). */
	readonly x: number;
	/** Cursor y coordinate relative to the viewport (`clientY`). */
	readonly y: number;
	/**
	 * X coordinate relative to the target element's top-left corner.
	 * Negative when cursor is to the left of the element, greater than
	 * element width when to the right. `0` when no target is provided.
	 */
	readonly elementX: number;
	/**
	 * Y coordinate relative to the target element's top-left corner.
	 * Negative when cursor is above the element, greater than
	 * element height when below. `0` when no target is provided.
	 */
	readonly elementY: number;
	/** Whether the cursor is currently inside the target element's bounding rect. */
	readonly isInside: boolean;
	/** Whether the listener is currently active. */
	readonly enabled: boolean;
	/** Stop listening for pointer events. */
	stop: () => void;
	/** Start listening for pointer events. */
	start: () => void;
};

/**
 * Reactively tracks the cursor's position, both globally (viewport coordinates)
 * and relative to an optional target element.
 *
 * @param target - Optional element to compute relative coordinates against.
 * @param options - Configuration options.
 *
 * @see {@link https://runed.dev/docs/utilities/use-mouse-position}
 */
export function useMousePosition(
	target?: MaybeElementGetter,
	options?: UseMousePositionOptions
): UseMousePositionReturn {
	const { immediate = true, window = defaultWindow } = options ?? {};

	let x = $state(0);
	let y = $state(0);
	let enabled = $state(immediate);

	const el = $derived(extract(target));

	// Single rect query shared by elementX, elementY, and isInside.
	const rect = $derived.by(() => {
		if (!el) return null;
		// Subscribe to x/y so the rect is recomputed each time the cursor moves.
		void x;
		void y;
		return el.getBoundingClientRect();
	});

	const elementX = $derived(rect ? x - rect.left : 0);
	const elementY = $derived(rect ? y - rect.top : 0);
	const isInside = $derived(
		rect ? x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom : false
	);

	const handler = (event: PointerEvent) => {
		if (!enabled) return;
		x = event.clientX;
		y = event.clientY;
	};

	useEventListener(() => window, "pointermove", handler, { passive: true });

	return {
		get x() {
			return x;
		},
		get y() {
			return y;
		},
		get elementX() {
			return elementX;
		},
		get elementY() {
			return elementY;
		},
		get isInside() {
			return isInside;
		},
		get enabled() {
			return enabled;
		},
		stop: () => {
			enabled = false;
		},
		start: () => {
			enabled = true;
		},
	};
}
