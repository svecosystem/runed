import { untrack } from "svelte";
import type { Getter } from "$lib/internal/types.js";

/**
 * The reactive value produced by `memo`. Read it via `.current`.
 */
export interface Memo<T> {
	readonly current: T;
}

class MemoImpl<T> implements Memo<T> {
	#value: T;

	constructor(compute: () => T) {
		this.#value = $derived.by(compute);
	}

	get current(): T {
		return this.#value;
	}
}

export function memo<R>(
	sources: Getter<unknown> | Array<Getter<unknown>>,
	compute: () => R
): Memo<R> {
	return new MemoImpl(() => {
		// Touch the sources so they register as dependencies.
		if (Array.isArray(sources)) {
			for (const source of sources) source();
		} else {
			sources();
		}
		return untrack(compute);
	});
}
