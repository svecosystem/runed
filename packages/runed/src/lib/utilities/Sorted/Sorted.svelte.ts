import type { MaybeGetter } from "$lib/internal/types.js";
import { get } from "$lib/internal/utils/get.js";

export type SortedCompareFn<T = unknown> = (a: T, b: T) => number;

export type SortFn<T = unknown> = (arr: T[], compareFn: SortedCompareFn<T>) => T[];

/**
 * Reactively sorts an array using the provided compare function.
 *
 * @see {@link https://runed.dev/docs/utilities/sorted}
 */
export class Sorted<T> {
	#current: T[] = $state([]);

	constructor(arr: MaybeGetter<T[]>, compareFn: SortedCompareFn<T>, dirty = false) {
		$effect(() => {
			if (dirty) {
				this.#current = get(arr).sort(compareFn);
			} else {
				this.#current = [...get(arr)].sort(compareFn);
			}
		});
	}

	get current(): T[] {
		return this.#current;
	}
}
