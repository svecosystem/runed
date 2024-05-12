import { useDebounce } from "../useDebounce/useDebounce.svelte.js";
import type { Getter, MaybeGetter } from "$lib/internal/types.js";

/**
 * Description placeholder
 *
 * @export
 * @class Debounced
 */
export class Debounced<T> {
	#current = $state() as T;

	constructor(getter: Getter<T>, wait: MaybeGetter<number> = 250) {
		this.#current = getter(); // immediately set the initial value

		const setCurrent = useDebounce((value: T) => {
			this.#current = value;
		}, wait);

		$effect(() => {
			setCurrent(getter());
		});
	}

	get current(): T {
		return this.#current;
	}
}
