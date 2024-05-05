import { box, watch } from "../index.js";
import type { BoxOrGetter, Getter } from "$lib/internal/types.js";

/**
 * Holds the previous value of a box or getter.
 *
 * @see {@link https://runed.dev/docs/functions/use-previous}
 */
export function usePrevious<T>(value: BoxOrGetter<T>) {
	const boxed = box.from(value);
	const previous = box<T | undefined>(undefined);

	watch(boxed, (_, prev) => {
		previous.value = prev;
	});

	return previous;
}

export class Previous<T> {
	#previous = $state<T | undefined>(undefined)

	constructor(getter: Getter<T>) {
		watch(getter, (_, prev) => {
			this.#previous = prev
		})
	}

	get value() {
		return this.#previous
	}
}