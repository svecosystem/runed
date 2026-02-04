import type { MaybeGetter } from "$lib/internal/types.js";
import { extract } from "../extract/extract.svelte.js";

type UseDebounceReturn<Args extends unknown[], Return, IncludePending extends boolean = false> = ((
	this: unknown,
	...args: Args
) => Promise<Return>) & {
	cancel: () => void;
	runScheduledNow: () => Promise<void>;
} & (IncludePending extends true ? { readonly pending: boolean } : {});

type DebounceContext<Return> = {
	timeout: ReturnType<typeof setTimeout> | null;
	runner: (() => Promise<void>) | null;
	resolve: (value: Return) => void;
	reject: (reason: unknown) => void;
	promise: Promise<Return>;
};

function useDebounceInternal<
	Args extends unknown[],
	Return,
	IncludePending extends boolean = false,
>(
	callback: (...args: Args) => Return,
	options: {
		/** Must be getter/setter pair to ensure reactivity */
		context: DebounceContext<Return> | null;
		/** Whether to include the reactive `pending` property */
		includePending: IncludePending;
		wait?: MaybeGetter<number | undefined>;
	}
): UseDebounceReturn<Args, Return, IncludePending> {
	const wait$ = $derived(extract(options.wait, 250));

	function debounced(this: unknown, ...args: Args) {
		if (options.context) {
			// Old context will be reused so callers awaiting the promise will get the
			// new value
			if (options.context.timeout) {
				clearTimeout(options.context.timeout);
			}
		} else {
			// No old context, create a new one
			let resolve: (value: Return) => void;
			let reject: (reason: unknown) => void;
			const promise = new Promise<Return>((res, rej) => {
				resolve = res;
				reject = rej;
			});

			options.context = {
				timeout: null,
				runner: null,
				promise,
				resolve: resolve!,
				reject: reject!,
			};
		}

		options.context.runner = async () => {
			// Grab the context and reset it
			// -> new debounced calls will create a new context
			if (!options.context) return;
			const ctx = options.context;
			options.context = null;

			try {
				ctx.resolve(await callback.apply(this, args));
			} catch (error) {
				ctx.reject(error);
			}
		};

		options.context.timeout = setTimeout(options.context.runner, wait$);

		return options.context.promise;
	}

	debounced.cancel = async () => {
		if (!options.context || options.context.timeout === null) {
			// Wait one event loop to see if something triggered the debounced function
			await new Promise((resolve) => setTimeout(resolve, 0));
			if (!options.context || options.context.timeout === null) return;
		}

		clearTimeout(options.context.timeout);
		options.context.reject("Cancelled");
		options.context = null;
	};

	debounced.runScheduledNow = async () => {
		if (!options.context || !options.context.timeout) {
			// Wait one event loop to see if something triggered the debounced function
			await new Promise((resolve) => setTimeout(resolve, 0));
			if (!options.context || !options.context.timeout) return;
		}

		clearTimeout(options.context.timeout);
		options.context.timeout = null;

		await options.context.runner?.();
	};

	if (options.includePending) {
		Object.defineProperty(debounced, "pending", {
			enumerable: true,
			get() {
				return !!options.context?.timeout;
			},
		});
	}

	return debounced as unknown as UseDebounceReturn<Args, Return, IncludePending>;
}

/**
 * Non-reactive version of {@link useDebounce}.
 *
 * This is safe to be used inside `$derived`, but lacks the reactive `pending` property.
 *
 * @example
 * ```ts
 * const debounced = useDebounce.raw(() => {}, 100);
 * const value = $derived(debounced());
 * ```
 *
 * @see {@link https://runed.dev/docs/utilities/use-debounce}
 *
 * @param callback The callback to call when the time has passed.
 * @param wait The length of time to wait in ms, defaults to 250.
 */
function useDebounceRaw<Args extends unknown[], Return>(
	callback: (...args: Args) => Return,
	wait?: MaybeGetter<number | undefined>
): UseDebounceReturn<Args, Return, false> {
	let context: DebounceContext<Return> | null = null;

	return useDebounceInternal(callback, {
		get context() {
			return context;
		},
		set context(value) {
			context = value;
		},
		wait,
		includePending: false,
	});
}

function useDebounce_<Args extends unknown[], Return>(
	callback: (...args: Args) => Return,
	wait?: MaybeGetter<number | undefined>
): UseDebounceReturn<Args, Return, true> {
	let context = $state<DebounceContext<Return> | null>(null);

	return useDebounceInternal(callback, {
		get context() {
			return context;
		},
		set context(value) {
			context = value;
		},
		wait,
		includePending: true,
	});
}

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
export const useDebounce = Object.assign(useDebounce_, {
	raw: useDebounceRaw,
});
