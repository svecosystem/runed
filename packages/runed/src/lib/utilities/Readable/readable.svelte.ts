import { tick } from "svelte";

export type StartNotifier<T> = (
	set: (value: T) => void,
	insideEffect: boolean
) => void | VoidFunction;

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
	#current: T = $state()!;
	#start: StartNotifier<T>;

	constructor(initialValue: T, start: StartNotifier<T>) {
		this.#current = initialValue;
		this.#start = start;
	}

	#subscribers = 0;
	#stop: VoidFunction | null = null;

	get current(): T {
		if ($effect.active()) {
			$effect(() => {
				this.#subscribers++;
				if (this.#subscribers === 1) {
					this.#subscribe(true);
				}

				return () => {
					tick().then(() => {
						this.#subscribers--;
						if (this.#subscribers === 0) {
							this.#unsubscribe();
						}
					});
				};
			});
		} else if (this.#subscribers === 0) {
			this.#subscribe(false);
			this.#unsubscribe();
		}

		return this.#current;
	}

	#subscribe(inEffect: boolean): void {
		this.#stop =
			this.#start((value) => {
				this.#current = value;
			}, inEffect) ?? null;
	}

	#unsubscribe(): void {
		if (this.#stop === null) return;

		this.#stop();
		this.#stop = null;
	}
}
