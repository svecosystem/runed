import type { MaybeGetter } from "$lib/internal/types.js";
import { type Deferred, defer } from "$lib/internal/utils/defer.js";
import { extract } from "$lib/internal/utils/extract.js";

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
export function useDebounce<Args extends unknown[], Return = void>(
	callback: (...args: Args) => Return,
	wait: MaybeGetter<number> = 250
): (this: unknown, ...args: Args) => Promise<Return> {
	let timeout: ReturnType<typeof setTimeout> | undefined;
	let deferred: Deferred<Return> | undefined;

	return function debounced(...args) {
		if (timeout !== undefined) {
			clearTimeout(timeout);
		}

		if (deferred === undefined) {
			deferred = defer();
		}

		const { promise, resolve, reject } = deferred;

		timeout = setTimeout(async () => {
			try {
				resolve(await callback.apply(this, args));
			} catch (error) {
				reject(error);
			} finally {
				timeout = undefined;
				deferred = undefined;
			}
		}, extract(wait));

		return promise;
	};
}
