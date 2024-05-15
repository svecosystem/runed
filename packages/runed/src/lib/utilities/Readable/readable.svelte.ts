import { tick } from "svelte";
import { noop } from "$lib/internal/utils/function.js";

export type StartNotifier<TValue> = (
	set: (value: TValue) => void,
	insideEffect: boolean
) => VoidFunction | undefined;

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
export class Readable<TValue> {
	#current = $state() as TValue;
	#start: StartNotifier<TValue>;

	constructor(initialValue: TValue, start: StartNotifier<TValue>) {
		this.#current = initialValue;
		this.#start = start;
	}

	#subscribers = 0;
	#stop: VoidFunction | null = null;

	get current(): TValue {
		if ($effect.active()) {
			$effect(() => {
				this.#subscribers++;
				if (this.#subscribers === 1) {
					this.#subscribe();
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
			this.#start((value) => {
				this.#current = value;
			}, false)?.();
		}

		return this.#current;
	}

	#subscribe() {
		this.#stop =
			this.#start((value) => {
				this.#current = value;
			}, true) ?? noop;
	}

	#unsubscribe() {
		if (this.#stop === null) {
			return;
		}

		this.#stop();
		this.#stop = null;
	}
}
