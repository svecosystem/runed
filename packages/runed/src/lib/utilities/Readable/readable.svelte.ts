import { tick } from "svelte";
import type { Setter } from "$lib/internal/types.js";

export type StartNotifier<T> = (set: Setter<T>) => VoidFunction;

/**
 * A class that contains a reactive `current` property
 *
 * Accepts an initial value, and an optional `start` function, which has a `set` function as its first argument,
 * which is used to update the value of the `current` property.
 *
 * @example
 * ```html
 * <script>
 * const now = new Readable(new Date(), (set) => {
 * 	const interval = setInterval(() => set(new Date()), 1000);
 * 	return () => clearInterval(interval);
 * });
 * </script>
 *
 * <p>{now.current.toLocaleTimeString()}</p>
 * ```
 *
 * @see {@link https://runed.dev/docs/utilities/readable}
 *
 */
export class Readable<T> {
	#current = $state() as T;
	#start: StartNotifier<T>;

	constructor(initialValue: T, start: StartNotifier<T>) {
		this.#current = initialValue;
		this.#start = start;
	}

	#subscribers: number = 0;
	#stop: VoidFunction | null = null;

	get current(): T {
		if ($effect.active()) {
			$effect(() => {
				this.#subscribers++;
				if (this.#subscribers === 1) {
					this.#stop = this.#start((value) => {
						this.#current = value;
					});
				}

				return () => {
					tick().then(() => {
						this.#subscribers--;
						if (this.#subscribers === 0 && this.#stop !== null) {
							this.#stop();
							this.#stop = null;
						}
					});
				};
			});
		}

		return this.#current;
	}
}
