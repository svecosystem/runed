import type { Getter } from "$lib/internal/types.js";

/**
 * Holds the previous value of a getter.
 *
 * @see {@link https://runed.dev/docs/utilities/previous}
 */
export class Previous<T> {
	#previousCallback: () => T | undefined = () => undefined;
	#previous: T | undefined = $derived.by(() => this.#previousCallback());

	constructor(getter: Getter<T>, initialValue?: T) {
		let actualPrevious: T | undefined = undefined;
		if (initialValue !== undefined) actualPrevious = initialValue;

		this.#previousCallback = () => {
			try {
				return actualPrevious;
			} finally {
				actualPrevious = getter();
			}
		};
	}

	get current(): T | undefined {
		return this.#previous;
	}
}
