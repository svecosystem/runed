import { untrack } from "svelte";

export class Lazy<T> {
	#init: () => T;

	constructor(init: () => T) {
		this.#init = init;
	}

	#current: T = $state()!;
	#initialized = false;

	get current() {
		if (!this.#initialized) {
			untrack(() => {
				this.#current = this.#init();
				this.#initialized = true;
			});
		}
		return this.#current;
	}

	set current(value) {
		this.#current = value;
		this.#initialized = true;
	}
}
