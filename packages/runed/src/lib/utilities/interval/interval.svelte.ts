import { useInterval } from "../use-interval/index.js";
import type { MaybeGetter } from "$lib/internal/types.js";

export type IntervalOptions = {
	/**
	 * Start the timer immediately
	 *
	 * @default true
	 */
	immediate?: boolean;

	/**
	 * Callback on every interval
	 */
	callback?: (count: number) => void;
};

/**
 * Reactive counter increases on every interval
 *
 * @see https://runed.dev/docs/utilities/interval
 */
export class Interval {
	#counter = $state(0);
	#callback?: (count: number) => void;
	#intervalControl: ReturnType<typeof useInterval>;

	constructor(interval: MaybeGetter<number> = 1000, options: IntervalOptions = {}) {
		const { immediate = true, callback } = options;
		
		this.#callback = callback;

		this.#intervalControl = useInterval(() => {
			this.#counter++;
			this.#callback?.(this.#counter);
		}, interval, { immediate });
	}

	/**
	 * Get the current counter value
	 */
	get counter(): number {
		return this.#counter;
	}

	/**
	 * Whether the interval is currently active
	 */
	get isActive(): boolean {
		return this.#intervalControl.isActive;
	}

	/**
	 * Pause the interval
	 */
	pause(): void {
		this.#intervalControl.pause();
	}

	/**
	 * Resume the interval
	 */
	resume(): void {
		this.#intervalControl.resume();
	}

	/**
	 * Reset the counter to 0
	 */
	reset(): void {
		this.#counter = 0;
	}
}