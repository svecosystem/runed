import { untrack } from "svelte";
import type { Getter } from "$lib/internal/types.js";

export function watch<T>(getDeps: Getter<T>, callback: (args: T) => void) {
	$effect(() => {
		const deps = getDeps();
		untrack(() => callback(deps));
	});
}
