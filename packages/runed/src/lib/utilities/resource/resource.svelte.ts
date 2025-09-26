import { watch } from "$lib/utilities/watch/index.js";
import type { Getter } from "$lib/internal/types.js";

/**
 * Configuration options for the resource function
 */
export type ResourceOptions<Data> = {
	/** Skip initial fetch when true */
	lazy?: boolean;
	/** Only fetch once when true */
	once?: boolean;
	/** Initial value for the resource */
	initialValue?: Data;
	/** Debounce time in milliseconds */
	debounce?: number;
	/** Throttle time in milliseconds */
	throttle?: number;
};

/**
 * Core state of a resource
 */
export type ResourceState<Data, HasInitialValue extends boolean = false> = {
	/** Current value of the resource */
	current: HasInitialValue extends true ? Data : Data | undefined;
	/** Whether the resource is currently loading */
	loading: boolean;
	/** Error if the fetch failed */
	error: Error | undefined;
};

/**
 * Return type of the resource function, extends ResourceState with additional methods
 */
export type ResourceReturn<
	Data,
	RefetchInfo = unknown,
	HasInitialValue extends boolean = false,
> = ResourceState<Data, HasInitialValue> & {
	/** Update the resource value directly */
	mutate: (value: Data) => void;
	/** Re-run the fetcher with current values */
	refetch: (info?: RefetchInfo) => Promise<Data | undefined>;
};

export type ResourceFetcherRefetchInfo<Data, RefetchInfo = unknown> = {
	/** Previous data return from fetcher */
	data: Data | undefined;
	/** Whether the fetcher is currently refetching or it can be the value you passed to refetch. */
	refetching: RefetchInfo | boolean;
	/** A cleanup function that will be called when the source is invalidated and the fetcher is about to re-run */
	onCleanup: (fn: () => void) => void;
	/** AbortSignal for cancelling fetch requests */
	signal: AbortSignal;
};

export type ResourceFetcher<Source, Data, RefetchInfo = unknown> = (
	/** Current value of the source */
	value: Source extends Array<unknown>
		? {
				[K in keyof Source]: Source[K];
			}
		: Source,
	/** Previous value of the source */
	previousValue: Source extends Array<unknown>
		? {
				[K in keyof Source]: Source[K];
			}
		: Source | undefined,
	info: ResourceFetcherRefetchInfo<Data, RefetchInfo>
) => Promise<Data>;

// Helper functions for debounce and throttle
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => Promise<any>>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
	let timeoutId: ReturnType<typeof setTimeout>;
	let lastResolve: ((value: Awaited<ReturnType<T>>) => void) | null = null;

	return (...args: Parameters<T>) => {
		return new Promise<Awaited<ReturnType<T>>>((resolve) => {
			if (lastResolve) {
				lastResolve(undefined as Awaited<ReturnType<T>>);
			}
			lastResolve = resolve;

			clearTimeout(timeoutId);
			timeoutId = setTimeout(async () => {
				const result = await fn(...args);
				if (lastResolve) {
					lastResolve(result);
					lastResolve = null;
				}
			}, delay);
		});
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function throttle<T extends (...args: any[]) => Promise<any>>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
	let lastRun = 0;
	let lastPromise: Promise<Awaited<ReturnType<T>>> | null = null;

	return (...args: Parameters<T>) => {
		const now = Date.now();

		if (lastRun && now - lastRun < delay) {
			return lastPromise ?? Promise.resolve(undefined as Awaited<ReturnType<T>>);
		}

		lastRun = now;
		lastPromise = fn(...args);
		return lastPromise;
	};
}

function runResource<
	Source,
	RefetchInfo = unknown,
	Fetcher extends ResourceFetcher<
		Source,
		Awaited<ReturnType<Fetcher>>,
		RefetchInfo
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	> = ResourceFetcher<Source, any, RefetchInfo>,
>(
	source: Getter<Source> | Array<Getter<Source>>,
	fetcher: Fetcher,
	options: ResourceOptions<Awaited<ReturnType<Fetcher>>> = {},
	effectFn: (
		fn: (
			values: Array<Source>,
			previousValues: undefined | Array<Source | undefined>
		) => void | VoidFunction,
		options?: { lazy?: boolean }
	) => void
): ResourceReturn<Awaited<ReturnType<Fetcher>>, RefetchInfo, boolean> {
	const {
		lazy = false,
		once = false,
		initialValue,
		debounce: debounceTime,
		throttle: throttleTime,
	} = options;

	// Create state
	let current = $state<Awaited<ReturnType<Fetcher>> | undefined>(initialValue);
	let loading = $state(initialValue === undefined && !lazy);
	let error = $state<Error | undefined>(undefined);
	let cleanupFns = $state<Array<() => void>>([]);

	// Helper function to run cleanup functions
	const runCleanup = () => {
		cleanupFns.forEach((fn) => fn());
		cleanupFns = [];
	};

	// Helper function to register cleanup
	const onCleanup = (fn: () => void) => {
		cleanupFns = [...cleanupFns, fn];
	};

	// Create the base fetcher function
	const baseFetcher = async (
		value: Source | Array<Source>,
		previousValue: Source | undefined | Array<Source | undefined>,
		refetching: RefetchInfo | boolean = false
	): Promise<Awaited<ReturnType<Fetcher>> | undefined> => {
		try {
			loading = true;
			error = undefined;
			runCleanup();

			// Create new AbortController for this fetch
			const controller = new AbortController();
			onCleanup(() => controller.abort());

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const result = await fetcher(value as any, previousValue as any, {
				data: current,
				refetching,
				onCleanup,
				signal: controller.signal,
			});

			current = result;
			return result;
		} catch (e) {
			if (!(e instanceof DOMException && e.name === "AbortError")) {
				error = e as Error;
			}
			return undefined;
		} finally {
			loading = false;
		}
	};

	// Apply debounce or throttle if specified
	const runFetcher = debounceTime
		? debounce(baseFetcher, debounceTime)
		: throttleTime
			? throttle(baseFetcher, throttleTime)
			: baseFetcher;

	// Setup effect
	const sources = Array.isArray(source) ? source : [source];
	let prevValues: unknown[] | undefined;

	effectFn(
		(values, previousValues) => {
			// Skip if once and already ran
			if (once && prevValues) {
				return;
			}

			prevValues = values;
			runFetcher(
				Array.isArray(source) ? values : values[0]!,
				Array.isArray(source) ? previousValues : previousValues?.[0]
			);
		},
		{ lazy }
	);

	return {
		get current() {
			return current;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		mutate: (value: Awaited<ReturnType<Fetcher>>) => {
			current = value;
		},
		refetch: (info?: RefetchInfo) => {
			const values = sources.map((s) => s());
			return runFetcher(
				Array.isArray(source) ? values : values[0]!,
				Array.isArray(source) ? values : values[0],
				info ?? true
			);
		},
	} as ResourceReturn<Awaited<ReturnType<Fetcher>>, RefetchInfo, boolean>;
}

/**
 * Creates a reactive resource that combines reactive dependency tracking with async data fetching.
 * This version uses watch under the hood and runs after render.
 * For pre-render execution, use resource.pre().
 *
 * Features:
 * - Automatic request cancellation when dependencies change
 * - Built-in loading and error states
 * - Support for initial values and lazy loading
 * - Type-safe reactive dependencies
 *
 * @example
 * ```typescript
 * // Basic usage with automatic request cancellation
 * const userResource = resource(
 *   () => userId,
 *   async (newId, prevId, { signal }) => {
 *     const res = await fetch(`/api/users/${newId}`, { signal });
 *     return res.json();
 *   }
 * );
 *
 * // Multiple dependencies
 * const searchResource = resource(
 *   [() => query, () => page],
 *   async ([query, page], [prevQuery, prevPage], { signal }) => {
 *     const res = await fetch(
 *       `/api/search?q=${query}&page=${page}`,
 *       { signal }
 *     );
 *     return res.json();
 *   },
 *   { lazy: true }
 * );
 *
 * // Custom cleanup with built-in request cancellation
 * const streamResource = resource(
 *   () => streamId,
 *   async (id, prevId, { signal, onCleanup }) => {
 *     const eventSource = new EventSource(`/api/stream/${id}`);
 *     onCleanup(() => eventSource.close());
 *
 *     const res = await fetch(`/api/stream/${id}/init`, { signal });
 *     return res.json();
 *   }
 * );
 * ```
 */
// For single source with initialValue
export function resource<
	Source,
	RefetchInfo = unknown,
	Fetcher extends ResourceFetcher<
		Source,
		Awaited<ReturnType<Fetcher>>,
		RefetchInfo
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	> = ResourceFetcher<Source, any, RefetchInfo>,
>(
	source: Getter<Source>,
	fetcher: Fetcher,
	options: ResourceOptions<Awaited<ReturnType<Fetcher>>> & {
		initialValue: Awaited<ReturnType<Fetcher>>;
	}
): ResourceReturn<Awaited<ReturnType<Fetcher>>, RefetchInfo, true>;

// For single source without initialValue
export function resource<
	Source,
	RefetchInfo = unknown,
	Fetcher extends ResourceFetcher<
		Source,
		Awaited<ReturnType<Fetcher>>,
		RefetchInfo
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	> = ResourceFetcher<Source, any, RefetchInfo>,
>(
	source: Getter<Source>,
	fetcher: Fetcher,
	options?: Omit<ResourceOptions<Awaited<ReturnType<Fetcher>>>, "initialValue">
): ResourceReturn<Awaited<ReturnType<Fetcher>>, RefetchInfo, false>;

// For array of sources with initialValue
export function resource<
	Sources extends Array<unknown>,
	RefetchInfo = unknown,
	Fetcher extends ResourceFetcher<
		Sources,
		Awaited<ReturnType<Fetcher>>,
		RefetchInfo
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	> = ResourceFetcher<Sources, any, RefetchInfo>,
>(
	sources: { [K in keyof Sources]: Getter<Sources[K]> },
	fetcher: Fetcher,
	options: ResourceOptions<Awaited<ReturnType<Fetcher>>> & {
		initialValue: Awaited<ReturnType<Fetcher>>;
	}
): ResourceReturn<Awaited<ReturnType<Fetcher>>, RefetchInfo, true>;

// For array of sources without initialValue
export function resource<
	Sources extends Array<unknown>,
	RefetchInfo = unknown,
	Fetcher extends ResourceFetcher<
		Sources,
		Awaited<ReturnType<Fetcher>>,
		RefetchInfo
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	> = ResourceFetcher<Sources, any, RefetchInfo>,
>(
	sources: { [K in keyof Sources]: Getter<Sources[K]> },
	fetcher: Fetcher,
	options?: Omit<ResourceOptions<Awaited<ReturnType<Fetcher>>>, "initialValue">
): ResourceReturn<Awaited<ReturnType<Fetcher>>, RefetchInfo, false>;

// Implementation
export function resource<
	Source,
	RefetchInfo = unknown,
	Fetcher extends ResourceFetcher<
		Source,
		Awaited<ReturnType<Fetcher>>,
		RefetchInfo
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	> = ResourceFetcher<Source, any, RefetchInfo>,
>(
	source: Getter<Source> | Array<Getter<Source>>,
	fetcher: Fetcher,
	options?: ResourceOptions<Awaited<ReturnType<Fetcher>>>
): ResourceReturn<Awaited<ReturnType<Fetcher>>, RefetchInfo, boolean> {
	return runResource<Source, RefetchInfo, Fetcher>(source, fetcher, options, (fn, options) => {
		const sources = Array.isArray(source) ? source : [source];
		const getters = () => sources.map((s) => s());
		watch(
			getters,
			(values, previousValues) => {
				fn(values, previousValues ?? []);
			},
			options
		);
	});
}

/**
 * Helper function to create a resource with pre-effect (runs before render).
 * Uses watch.pre internally instead of watch for pre-render execution.
 * Includes all features of the standard resource including automatic request cancellation.
 *
 * @example
 * ```typescript
 * // Pre-render resource with automatic cancellation
 * const data = resource.pre(
 *   () => query,
 *   async (newQuery, prevQuery, { signal }) => {
 *     const res = await fetch(`/api/search?q=${newQuery}`, { signal });
 *     return res.json();
 *   }
 * );
 * ```
 */
// For single source with initialValue
export function resourcePre<
	Source,
	RefetchInfo = unknown,
	Fetcher extends ResourceFetcher<
		Source,
		Awaited<ReturnType<Fetcher>>,
		RefetchInfo
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	> = ResourceFetcher<Source, any, RefetchInfo>,
>(
	source: Getter<Source>,
	fetcher: Fetcher,
	options: ResourceOptions<Awaited<ReturnType<Fetcher>>> & {
		initialValue: Awaited<ReturnType<Fetcher>>;
	}
): ResourceReturn<Awaited<ReturnType<Fetcher>>, RefetchInfo, true>;

// For single source without initialValue
export function resourcePre<
	Source,
	RefetchInfo = unknown,
	Fetcher extends ResourceFetcher<
		Source,
		Awaited<ReturnType<Fetcher>>,
		RefetchInfo
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	> = ResourceFetcher<Source, any, RefetchInfo>,
>(
	source: Getter<Source>,
	fetcher: Fetcher,
	options?: Omit<ResourceOptions<Awaited<ReturnType<Fetcher>>>, "initialValue">
): ResourceReturn<Awaited<ReturnType<Fetcher>>, RefetchInfo, false>;

// For array of sources with initialValue
export function resourcePre<
	Sources extends Array<unknown>,
	RefetchInfo = unknown,
	Fetcher extends ResourceFetcher<
		Sources,
		Awaited<ReturnType<Fetcher>>,
		RefetchInfo
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	> = ResourceFetcher<Sources, any, RefetchInfo>,
>(
	sources: {
		[K in keyof Sources]: Getter<Sources[K]>;
	},
	fetcher: Fetcher,
	options: ResourceOptions<Awaited<ReturnType<Fetcher>>> & {
		initialValue: Awaited<ReturnType<Fetcher>>;
	}
): ResourceReturn<Awaited<ReturnType<Fetcher>>, RefetchInfo, true>;

// For array of sources without initialValue
export function resourcePre<
	Sources extends Array<unknown>,
	RefetchInfo = unknown,
	Fetcher extends ResourceFetcher<
		Sources,
		Awaited<ReturnType<Fetcher>>,
		RefetchInfo
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	> = ResourceFetcher<Sources, any, RefetchInfo>,
>(
	sources: {
		[K in keyof Sources]: Getter<Sources[K]>;
	},
	fetcher: Fetcher,
	options?: Omit<ResourceOptions<Awaited<ReturnType<Fetcher>>>, "initialValue">
): ResourceReturn<Awaited<ReturnType<Fetcher>>, RefetchInfo, false>;

// Implementation
export function resourcePre<
	Source,
	RefetchInfo = unknown,
	Fetcher extends ResourceFetcher<
		Source,
		Awaited<ReturnType<Fetcher>>,
		RefetchInfo
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	> = ResourceFetcher<Source, any, RefetchInfo>,
>(
	source: Getter<Source> | Array<Getter<Source>>,
	fetcher: Fetcher,
	options?: ResourceOptions<Awaited<ReturnType<Fetcher>>>
): ResourceReturn<Awaited<ReturnType<Fetcher>>, RefetchInfo, boolean> {
	return runResource<Source, RefetchInfo, Fetcher>(source, fetcher, options, (fn, options) => {
		const sources = Array.isArray(source) ? source : [source];
		const getter = () => sources.map((s) => s());
		watch.pre(
			getter,
			(values, previousValues) => {
				fn(values, previousValues ?? []);
			},
			options
		);
	});
}

resource.pre = resourcePre;
