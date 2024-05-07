import { watch } from "../index.js";
import type { Getter } from "$lib/internal/types.js";

/**
 * Holds the previous value of a getter.
 *
 * @see {@link https://runed.dev/docs/functions/use-previous}
 */
export class Previous<T> {
	#previous = $state<T | undefined>(undefined)

	constructor(getter: Getter<T>) {
		watch(getter, (_, prev) => {
			this.#previous = prev
		})
	}

	get current() {
		return this.#previous
	}
}