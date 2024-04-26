import { type ReadableBox, box } from "../box/box.svelte.js";

/**
 * A hook that takes a callback and returns a boolean indicating whether the
 * callback is supported by the current environment.
 *
 * Useful for checking if a browser API is supported before attempting to use it.
 */
export function useSupported(callback: () => unknown): ReadableBox<boolean> {
	const isSupported = box(false);

	$effect(() => {
		isSupported.value = Boolean(callback());
	});

	return box.readonly(isSupported);
}
