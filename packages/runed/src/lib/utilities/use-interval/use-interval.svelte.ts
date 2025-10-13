import { extract } from "../extract/index.js";
import type { MaybeGetter } from "$lib/internal/types.js";
import { watch } from "../watch/watch.svelte.js";

export type UseIntervalOptions = {
	/**
	 * Start the timer immediately
	 *
	 * @default true
	 */
	immediate?: boolean;

	/**
	 * Execute the callback immediately after calling `resume`
	 *
	 * @default false
	 */
	immediateCallback?: boolean;

	/**
	 * Callback to execute on every interval tick, receives the current counter value
	 */
	callback?: (count: number) => void;
};

export type UseIntervalReturn = {
	/**
	 * Pause the interval
	 */
	pause: () => void;

	/**
	 * Resume the interval
	 */
	resume: () => void;

	/**
	 * Reset the counter to 0
	 */
	reset: () => void;

	/**
	 * Whether the interval is currently active
	 */
	readonly isActive: boolean;

	/**
	 * The current counter value
	 */
	readonly counter: number;
};

/**
 * Wrapper for `setInterval` with controls for pausing and resuming.
 *
 * @see https://runed.dev/docs/utilities/use-interval
 *
 * @param delay - The interval in milliseconds between executions
 * @param options - Configuration options
 * @returns Object with pause, resume, reset methods, counter and isActive state
 */
export function useInterval(
	delay: MaybeGetter<number>,
	options: UseIntervalOptions = {}
): UseIntervalReturn {
	const { immediate = true, immediateCallback = false, callback } = options;

	let intervalId = $state<ReturnType<typeof setInterval> | null>(null);
	let counter = $state(0);
	const delay$ = $derived(extract(delay));
	const isActive = $derived(intervalId !== null);

	function runCallback(): void {
		counter++;
		callback?.(counter);
	}

	function createInterval(): void {
		intervalId = setInterval(runCallback, delay$);
	}

	const pause = (): void => {
		if (intervalId === null) return;
		clearInterval(intervalId);
		intervalId = null;
	};

	const resume = (): void => {
		if (intervalId !== null) return;
		if (immediateCallback) runCallback();
		createInterval();
	};

	if (immediate) {
		resume();
	}

	// Sync interval's delay with the prop
	watch(
		() => delay$,
		() => {
			if (!isActive) return;
			pause();
			createInterval();
		}
	);

	// Cleanup on disposal
	$effect(() => pause);

	return {
		pause,
		resume,
		reset: () => (counter = 0),
		get isActive() {
			return isActive;
		},
		get counter() {
			return counter;
		},
	};
}
