import { untrack } from "svelte";

export class Lazy<T> {
	#init: () => T;

	constructor(init: () => T) {
		this.#init = init;
	}

	#current: T | undefined = $state();
	#initialized = false;

	get current(): T {
		if (!this.#initialized) {
			untrack(() => {
				this.#current = this.#init();
				this.#initialized = true;
			});
		}
		return this.#current as T;
	}

	set current(value: T) {
		this.#current = value;
		this.#initialized = true;
	}
}
