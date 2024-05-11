import { untrack } from "svelte";
import { watch } from "../index.js";
import type { Getter } from "$lib/internal/types.js";

/**
 * Holds the previous value of a getter.
 *
 * @see {@link https://runed.dev/docs/utilities/use-previous}
 */
export class Previous<T> {
	#previous = $state<T | undefined>(undefined);
	#curr = $state<T | undefined>(undefined);

	constructor(getter: Getter<T>) {
		$effect(() => {
			this.#previous = untrack(() => this.#curr);
			this.#curr = getter();
		});
	}

	get current() {
		return this.#previous;
	}
}
