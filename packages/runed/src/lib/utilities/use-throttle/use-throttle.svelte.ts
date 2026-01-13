import { untrack } from "svelte";
import type { MaybeGetter } from "$lib/internal/types.js";

/**
 * Represents the throttled wrapper returned by {@link useThrottle}.
 *
 * The wrapper is an async function that returns a {@link Promise} resolving to
 * the original callback's return value. In addition to being callable, it
 * provides two helper properties `cancel()` and `pending`.
 */
type UseThrottleReturn<Args extends unknown[], Return> = ((
	this: unknown,
	...args: Args
) => Promise<Return>) & {
	/**
	 * Aborts any pending throttled execution and rejects the awaiting promise
	 * with the string `"Cancelled"`.
	 */
	cancel: () => void;

	/**
	 * Whether a throttled call is currently waiting to be executed.
	 */
	pending: boolean;
};

/**
 * Creates a throttled wrapper around a callback function.
 *
 * The returned function ensures that the original callback is invoked at most
 * once per specified interval. Calls made during the wait period are queued
 * and resolved with the result of the most recent invocation.
 *
 * @see https://runed.dev/docs/utilities/use-throttle
 *
 * @param callback - The function to be throttled.
 * @param interval - The time interval in milliseconds, or a {@link MaybeGetter}
 *   returning the interval. If omitted, the default is `250`.
 *
 * @returns A throttled version of the callback: {@link UseThrottleReturn}.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useThrottle } from 'runed';
 *
 *   let search = $state('');
 *   let throttledSearch = $state('');
 *
 *   // Create a throttled fn – it runs at most once per 250ms
 *   const throttledUpdate = useThrottle(() => {
 *     throttledSearch = search;
 *   });
 * </script>
 *
 * <input
 *   bind:value={{
 *     () => search,
 *     (v) => {
 *       search = v;
 *       throttledUpdate();
 *     }
 *   }}
 * />
 *
 * <p>You searched for: <b>{throttledSearch}</b></p>
 * ```
 */
export function useThrottle<Args extends unknown[], Return>(
	callback: (...args: Args) => Return,
	interval: MaybeGetter<number> = 250
): UseThrottleReturn<Args, Return> {
	let lastCall = 0;
	let timeout = $state<ReturnType<typeof setTimeout> | undefined>();
	let resolve: ((value: Return) => void) | null = null;
	let reject: ((reason: unknown) => void) | null = null;
	let promise: Promise<Return> | null = null;

	function reset() {
		timeout = undefined;
		promise = null;
		resolve = null;
		reject = null;
	}

	function throttled(this: unknown, ...args: Args): Promise<Return> {
		return untrack(() => {
			const now = Date.now();
			const intervalValue = typeof interval === "function" ? interval() : interval;
			const nextAllowedTime = lastCall + intervalValue;

			if (!promise) {
				promise = new Promise<Return>((res, rej) => {
					resolve = res;
					reject = rej;
				});
			}

			if (now < nextAllowedTime) {
				if (!timeout) {
					timeout = setTimeout(async () => {
						try {
							const result = await callback.apply(this, args);
							resolve?.(result);
						} catch (error) {
							reject?.(error);
						} finally {
							clearTimeout(timeout);
							reset();
							lastCall = Date.now();
						}
					}, nextAllowedTime - now);
				}

				return promise;
			}

			if (timeout) {
				clearTimeout(timeout);
				timeout = undefined;
			}
			lastCall = now;
			try {
				const result = callback.apply(this, args);
				resolve?.(result);
			} catch (error) {
				reject?.(error);
			} finally {
				reset();
			}

			return promise;
		});
	}

	throttled.cancel = async () => {
		if (timeout) {
			if (timeout === undefined) {
				// Wait one event loop to see if something triggered the throttled function
				await new Promise((resolve) => setTimeout(resolve, 0));
				if (timeout === undefined) return;
			}

			clearTimeout(timeout);
			reject?.("Cancelled");
			reset();
		}
	};

	Object.defineProperty(throttled, "pending", {
		enumerable: true,
		get() {
			return !!timeout;
		},
	});

	return throttled as unknown as UseThrottleReturn<Args, Return>;
}
