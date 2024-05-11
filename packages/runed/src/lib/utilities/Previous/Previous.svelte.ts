import { type PreviousValue, watch } from "../index.js";
import type { Getter } from "$lib/internal/types.js";

/**
 * Holds the previous value of a getter.
 *
 * @see {@link https://runed.dev/docs/utilities/use-previous}
 */
export class Previous<T> {
	#previous = $state<PreviousValue<T> | undefined>();

	constructor(getter: Getter<T>) {
		// eslint-disable-next-line ts/no-explicit-any
		this.#previous = (Array.isArray(getter()) ? [] : undefined) as any;
		watch(getter, (_, prev) => {
			this.#previous = prev;
		});
	}

	get current() {
		return this.#previous;
	}
}
