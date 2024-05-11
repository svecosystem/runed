import type { FunctionArgs, MaybeGetter } from "$lib/internal/types.js";

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
export function useDebounce<Callback extends FunctionArgs>(
	callback: Callback,
	wait: MaybeGetter<number> = 250
) {
	let timeout: ReturnType<typeof setTimeout> | undefined;
	let resolve: (value: ReturnType<Callback>) => void;
	let reject: (reason: unknown) => void;
	let promise: Promise<ReturnType<Callback>> | undefined;

	return function debounced(this: unknown, ...args: Parameters<Callback>) {
		if (timeout) {
			clearTimeout(timeout);
		}

		if (!promise) {
			promise = new Promise<ReturnType<Callback>>((res, rej) => {
				resolve = res;
				reject = rej;
			});
		}

		timeout = setTimeout(
			async () => {
				try {
					resolve((await callback.apply(this, args)) as ReturnType<Callback>);
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
