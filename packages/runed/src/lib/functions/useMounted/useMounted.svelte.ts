import { untrack } from "svelte";
import { type ReadableBox, box } from "../box/box.svelte.js";

/**
 * Returns a box with the mounted state of the component
 * that invokes this function.
 */
export function useMounted(): ReadableBox<boolean> {
	const isMounted = box(false);

	$effect(() => {
		untrack(() => (isMounted.value = true));
	});

	return box.readonly(isMounted);
}
