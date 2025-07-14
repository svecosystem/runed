import { extract } from "../extract/index.js";
import type { MaybeGetter } from "$lib/internal/types.js";

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
	 * Whether the interval is currently active
	 */
	readonly isActive: boolean;
};

/**
 * Wrapper for `setInterval` with controls for pausing and resuming.
 *
 * @see https://runed.dev/docs/utilities/use-interval
 *
 * @param callback - The function to execute repeatedly
 * @param interval - The interval in milliseconds between executions
 * @param options - Configuration options
 * @returns Object with pause, resume methods and isActive state
 */
export function useInterval(
	callback: () => void,
	interval: MaybeGetter<number>,
	options: UseIntervalOptions = {}
): UseIntervalReturn {
	const { immediate = true, immediateCallback = false } = options;

	let intervalId = $state<ReturnType<typeof setInterval> | null>(null);

	function pause(): void {
		if (intervalId === null) return;
		clearInterval(intervalId);
		intervalId = null;
	}

	function resume(): void {
		if (intervalId !== null) return;

		if (immediateCallback) {
			callback();
		}

		const currentInterval = extract(interval);
		intervalId = setInterval(callback, currentInterval);
	}

	// Start immediately if requested
	if (immediate) {
		resume();
	}

	// Cleanup on disposal
	$effect(() => {
		return () => {
			if (intervalId !== null) {
				clearInterval(intervalId);
			}
		};
	});

	const isActive = $derived(intervalId !== null);

	return {
		pause,
		resume,
		get isActive() {
			return isActive;
		},
	};
}
