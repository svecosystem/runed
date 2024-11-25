import type { MaybeGetter } from "$lib/internal/types.js";

type UseDebounceReturn<Args extends unknown[], Return> = ((
	this: unknown,
	...args: Args
) => Promise<Return>) & {
	cancel: () => void;
	pending: boolean;
};

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
 * @see {@link https://runed.dev/docs/utilities/use-debounce}
 *
 * @param callback The callback to call when the time has passed.
 * @param wait The length of time to wait in ms, defaults to 250.
 */
export function useDebounce<Args extends unknown[], Return>(
	callback: (...args: Args) => Return,
	wait: MaybeGetter<number> = 250
): UseDebounceReturn<Args, Return> {
	let timeout = $state<ReturnType<typeof setTimeout>>();
	let resolve: null | ((value: Return) => void) = null;
	let reject: null | ((reason: unknown) => void) = null;
	let promise: Promise<Return> | null = null;

	function reset() {
		timeout = undefined;
		promise = null;
		resolve = null;
		reject = null;
	}

	function debounced(this: unknown, ...args: Args) {
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
					resolve?.(await callback.apply(this, args));
				} catch (error) {
					reject?.(error);
				} finally {
					reset();
				}
			},
			typeof wait === "function" ? wait() : wait
		);

		return promise;
	}

	debounced.cancel = async () => {
		if (timeout === undefined) {
			// Wait one event loop to see if something triggered the debounced function
			await new Promise((resolve) => setTimeout(resolve, 0));
			if (timeout === undefined) return;
		}

		clearTimeout(timeout);
		reject?.("Cancelled");
		reset();
	};

	Object.defineProperty(debounced, "pending", {
		enumerable: true,
		get() {
			return !!timeout;
		},
	});

	return debounced as unknown as UseDebounceReturn<Args, Return>;
}
