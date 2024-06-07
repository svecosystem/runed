import { useDebounce } from "../useDebounce/useDebounce.svelte.js";
import { watch } from "../watch/watch.svelte.js";
import type { Getter, MaybeGetter } from "$lib/internal/types.js";

/**
 * Description placeholder
 *
 * @export
 * @class Debounced
 */
export class Debounced<T> {
	#current: T = $state()!;

	constructor(getter: Getter<T>, wait: MaybeGetter<number> = 250) {
		this.#current = getter(); // immediately set the initial value

		const callback = useDebounce(() => {
			this.#current = getter();
		}, wait);

		watch(getter, () => {
			callback();
		});
	}

	get current(): T {
		return this.#current;
	}
}
