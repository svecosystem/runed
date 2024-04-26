import { untrack } from "svelte";
import { box } from "../box/box.svelte.js";

/**
 * Returns the mounted state of the component containing
 * this function in a box.
 */
export function useMounted() {
	const isMounted = box(false);

	$effect(() => {
		untrack(() => (isMounted.value = true));
	});

	return box.readonly(isMounted);
}
