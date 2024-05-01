import { untrack } from "svelte";
import { type ReadableBox, box } from "../box/box.svelte.js";

/**
 * Returns a box with the mounted state of the component
 * that invokes this function.
 *
 * @see {@link https://runed.dev/docs/functions/use-mounted}
 */
export function useMounted(): ReadableBox<boolean> {
	const isMounted = box(false);

	$effect(() => {
		untrack(() => (isMounted.value = true));

		return () => {
			isMounted.value = false;
		};
	});

	return box.readonly(isMounted);
}
