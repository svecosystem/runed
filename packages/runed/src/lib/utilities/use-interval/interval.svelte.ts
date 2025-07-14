import { extract } from "../extract/index.js";
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
	#intervalId: ReturnType<typeof setInterval> | null = null;
	#interval: MaybeGetter<number>;
	#callback?: (count: number) => void;

	constructor(interval: MaybeGetter<number> = 1000, options: IntervalOptions = {}) {
		const { immediate = true, callback } = options;
		
		this.#interval = interval;
		this.#callback = callback;

		if (immediate) {
			this.resume();
		}

		// Cleanup on disposal
		$effect(() => {
			return () => {
				this.pause();
			};
		});
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
		return this.#intervalId !== null;
	}

	/**
	 * Pause the interval
	 */
	pause(): void {
		if (this.#intervalId === null) return;
		clearInterval(this.#intervalId);
		this.#intervalId = null;
	}

	/**
	 * Resume the interval
	 */
	resume(): void {
		if (this.#intervalId !== null) return;

		const currentInterval = extract(this.#interval);
		this.#intervalId = setInterval(() => {
			this.#counter++;
			this.#callback?.(this.#counter);
		}, currentInterval);
	}

	/**
	 * Reset the counter to 0
	 */
	reset(): void {
		this.#counter = 0;
	}
}