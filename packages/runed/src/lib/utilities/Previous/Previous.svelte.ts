import type { Getter } from "$lib/internal/types.js";

/**
 * Holds the previous value of a getter.
 *
 * @see {@link https://runed.dev/docs/utilities/previous}
 */
export class Previous<T> {
	#previous = $state<T | undefined>(undefined);
	#curr?: T;

	constructor(getter: Getter<T>) {
		$effect(() => {
			this.#previous = this.#curr;
			this.#curr = getter();
		});
	}

	get current(): T | undefined {
		return this.#previous;
	}
}
