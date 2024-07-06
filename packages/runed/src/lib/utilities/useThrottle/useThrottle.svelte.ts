import type { MaybeGetter } from "$lib/internal/types.js";

type UseThrottleReturn<Args extends unknown[], Return> = ((
	this: unknown,
	...args: Args
) => Promise<Return>) & {
	cancel: () => void;
	pending: boolean;
};

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
		console.log("Throttled called", { lastCall, timeout });
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
						timeout = undefined;
						lastCall = Date.now();
						reset();
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
	}

	throttled.cancel = () => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
			reject?.(new Error("Cancelled"));
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
