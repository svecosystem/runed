import type { MaybeGetter } from "$lib/internal/types.js";

/**
 * Function that takes a callback, and returns a debounced version of it.
 * When calling the debounced function, it will wait for the specified time
 * before calling the original callback. If the debounced function is called
 * again before the time has passed, the timer will be reset.
 *
 * You can await the debounced function to get the value when it is eventually
 * called.
 *
 * The second parameter is the time to wait before calling the original callback.
 * Alternatively, it can also be a getter function that returns the time to wait.
 *
 *
 * @see {@link https://runed.dev/docs/utilities/use-debounce}
 */
export function useDebounce<Args extends unknown[], Return>(
	callback: (...args: Args) => Return,
	wait: MaybeGetter<number> = 250
): (this: unknown, ...args: Args) => Promise<Return> {
	let timeout: ReturnType<typeof setTimeout> | undefined;
	let resolve: (value: Return) => void;
	let reject: (reason: unknown) => void;
	let promise: Promise<Return> | undefined;

	return function debounced(...args) {
		if (timeout) {
			clearTimeout(timeout);
		}

		if (!promise) {
			promise = new Promise((res, rej) => {
				resolve = res;
				reject = rej;
			});
		}

		timeout = setTimeout(
			async () => {
				try {
					resolve(await callback.apply(this, args));
				} catch (error) {
					reject(error);
				} finally {
					timeout = undefined;
					promise = undefined;
				}
			},
			typeof wait === "function" ? wait() : wait
		);

		return promise;
	};
}
