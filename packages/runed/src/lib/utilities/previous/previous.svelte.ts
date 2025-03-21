import type { Getter } from "$lib/internal/types.js";
import { watch } from "../watch/watch.svelte.js";

/**
 * Holds the previous value of a getter.
 *
 * @see {@link https://runed.dev/docs/utilities/previous}
 */
export class Previous<T> {
	#previous: T | undefined = $state(undefined);

	constructor(getter: Getter<T>, initialValue?: T) {
		if (initialValue !== undefined) this.#previous = initialValue;

		watch(
			() => getter(),
			(_, v) => {
				this.#previous = v;
			}
		);
	}

	get current(): T | undefined {
		return this.#previous;
	}
}
