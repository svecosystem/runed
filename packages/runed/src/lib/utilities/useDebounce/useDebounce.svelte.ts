import type { MaybeGetter } from "$lib/internal/types.js";

type UseDebounceReturn<Args extends unknown[], Return> = ((
	this: unknown,
	...args: Args
) => Promise<Return>) & {
	cancel: () => void;
	pending: boolean;
};

type DebounceContext<Return> = {
	timeout: ReturnType<typeof setTimeout> | null;
	resolve: (value: Return) => void;
	reject: (reason: unknown) => void;
	promise: Promise<Return>;
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
	let context = $state<DebounceContext<Return> | null>(null);

	function debounced(this: unknown, ...args: Args) {
		if (context) {
			// Old context will be reused so callers awaiting the promise will get the
			// new value
			if (context.timeout) {
				clearTimeout(context.timeout);
			}
		} else {
			// No old context, create a new one
			let resolve: (value: Return) => void;
			let reject: (reason: unknown) => void;
			const promise = new Promise<Return>((res, rej) => {
				resolve = res;
				reject = rej;
			});

			context = {
				timeout: null,
				promise,
				resolve: resolve!,
				reject: reject!,
			};
		}

		context.timeout = setTimeout(
			async () => {
				// Grab the context and reset it
				// -> new debounced calls will create a new context
				if (!context) return;
				const ctx = context;
				context = null;

				try {
					ctx.resolve(await callback.apply(this, args));
				} catch (error) {
					ctx.reject(error);
				}
			},
			typeof wait === "function" ? wait() : wait
		);

		return context.promise;
	}

	debounced.cancel = async () => {
		if (!context || context.timeout === null) {
			// Wait one event loop to see if something triggered the debounced function
			await new Promise((resolve) => setTimeout(resolve, 0));
			if (!context || context.timeout === null) return;
		}

		clearTimeout(context.timeout);
		context.reject("Cancelled");
		context = null;
	};

	Object.defineProperty(debounced, "pending", {
		enumerable: true,
		get() {
			return !!context?.timeout;
		},
	});

	return debounced as unknown as UseDebounceReturn<Args, Return>;
}
