import { type Readable, type Writable, get } from "svelte/store";

type ReadableValue<T> = T extends Readable<infer U> ? U : never;

function isWritable(t: Readable<unknown>): t is Writable<unknown> {
	return "set" in t;
}

export class Store<T extends Readable<unknown>> {
	#current: ReadableValue<T> = $state()!;
	#store: T;

	constructor(store: T) {
		this.#current = get(store) as ReadableValue<T>;

		$effect.pre(() => {
			return store.subscribe((v) => {
				this.#current = v as ReadableValue<T>;
			});
		});
		this.#store = store;
	}

	get current(): ReadableValue<T> {
		return this.#current;
	}

	/**
	 * In case the expected type to set is never, this means that the store is not `writable`.
	 */
	set current(v: T extends Writable<unknown> ? ReadableValue<T> : never) {
		if (isWritable(this.#store)) {
			this.#store.set(v);
		} else {
			throw new Error("Tried setting a readable store");
		}
	}
}
