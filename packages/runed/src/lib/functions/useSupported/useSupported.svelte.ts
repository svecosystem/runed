import { type ReadableBox, box } from "../box/box.svelte.js";

/**
 * A hook that takes a predicate determine if a browser API is supported.
 *
 * Useful for checking if a browser API is supported before attempting to use it.
 *
 * @example
 * ```ts
 * const isSupported = useSupported(() => navigator);
 *
 * if (isSupported) {
 * 	// do something with navigator
 * }
 * ```
 */
export function useSupported(predicate: () => boolean): ReadableBox<boolean> {
	const isSupported = box(false);

	$effect(() => {
		isSupported.value = predicate();
	});

	return box.readonly(isSupported);
}
