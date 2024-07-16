import { untrack } from "svelte";
import type { Getter } from "$lib/internal/types.js";

function runEffect(flush: "post" | "pre", effect: () => void | VoidFunction): void {
	switch (flush) {
		case "post":
			$effect(effect);
			break;
		case "pre":
			$effect.pre(effect);
			break;
	}
}

export type WatchOptions = {
	/**
	 * If `true`, the effect doesn't run until one of the `sources` changes.
	 *
	 * @default false
	 */
	lazy?: boolean;
};

function runWatcher<T>(
	sources: Getter<T> | Array<Getter<T>>,
	flush: "post" | "pre",
	effect: (
		values: T | Array<T>,
		previousValues: T | undefined | Array<T | undefined>
	) => void | VoidFunction,
	options: WatchOptions = {}
): void {
	const { lazy = false } = options;

	// Run the effect immediately if `lazy` is `false`.
	let active = !lazy;

	// On the first run, if the dependencies are an array, pass an empty array
	// to the previous value instead of `undefined` to allow destructuring.
	//
	// watch(() => [a, b], ([a, b], [prevA, prevB]) => { ... });
	let previousValues: T | undefined | Array<T | undefined> = Array.isArray(sources)
		? []
		: undefined;

	runEffect(flush, () => {
		const sourcesSnapshot = $state.snapshot(sources);
		const values = Array.isArray(sourcesSnapshot)
			? sourcesSnapshot.map((source) => $state.snapshot(source()))
			: sourcesSnapshot();

		if (!active) {
			active = true;
			previousValues = values;
			return;
		}

		const cleanup = untrack(() => effect(values, previousValues));
		previousValues = values;
		return cleanup;
	});
}

function runWatcherOnce<T>(
	sources: Getter<T> | Array<Getter<T>>,
	flush: "post" | "pre",
	effect: (values: T | Array<T>, previousValues: T | Array<T>) => void | VoidFunction
): void {
	const cleanupRoot = $effect.root(() => {
		let stop = false;
		runWatcher(
			sources,
			flush,
			(values, previousValues) => {
				if (stop) {
					cleanupRoot();
					return;
				}

				// Since `lazy` is `true`, `previousValues` is always defined.
				const cleanup = effect(values, previousValues as T | Array<T>);
				stop = true;
				return cleanup;
			},
			// Running the effect immediately just once makes no sense at all.
			// That's just `onMount` with extra steps.
			{ lazy: true }
		);
	});

	$effect(() => {
		return cleanupRoot;
	});
}

export function watch<T extends Array<unknown>>(
	sources: {
		[K in keyof T]: Getter<T[K]>;
	},
	effect: (
		values: T,
		previousValues: {
			[K in keyof T]: T[K] | undefined;
		}
	) => void | VoidFunction,
	options?: WatchOptions
): void;

export function watch<T>(
	source: Getter<T>,
	effect: (value: T, previousValue: T | undefined) => void | VoidFunction,
	options?: WatchOptions
): void;

export function watch<T>(
	sources: Getter<T> | Array<Getter<T>>,
	effect: (
		values: T | Array<T>,
		previousValues: T | undefined | Array<T | undefined>
	) => void | VoidFunction,
	options?: WatchOptions
): void {
	runWatcher(sources, "post", effect, options);
}

function watchPre<T extends Array<unknown>>(
	sources: {
		[K in keyof T]: Getter<T[K]>;
	},
	effect: (
		values: T,
		previousValues: {
			[K in keyof T]: T[K] | undefined;
		}
	) => void | VoidFunction,
	options?: WatchOptions
): void;

function watchPre<T>(
	source: Getter<T>,
	effect: (value: T, previousValue: T | undefined) => void | VoidFunction,
	options?: WatchOptions
): void;

function watchPre<T>(
	sources: Getter<T> | Array<Getter<T>>,
	effect: (
		values: T | Array<T>,
		previousValues: T | undefined | Array<T | undefined>
	) => void | VoidFunction,
	options?: WatchOptions
): void {
	runWatcher(sources, "pre", effect, options);
}

watch.pre = watchPre;

export function watchOnce<T extends Array<unknown>>(
	sources: {
		[K in keyof T]: Getter<T[K]>;
	},
	effect: (values: T, previousValues: T) => void | VoidFunction
): void;

export function watchOnce<T>(
	source: Getter<T>,
	effect: (value: T, previousValue: T) => void | VoidFunction
): void;

export function watchOnce<T>(
	source: Getter<T> | Array<Getter<T>>,
	effect: (value: T | Array<T>, previousValue: T | Array<T>) => void | VoidFunction
): void {
	runWatcherOnce(source, "post", effect);
}

function watchOncePre<T extends Array<unknown>>(
	sources: {
		[K in keyof T]: Getter<T[K]>;
	},
	effect: (values: T, previousValues: T) => void | VoidFunction
): void;

function watchOncePre<T>(
	source: Getter<T>,
	effect: (value: T, previousValue: T) => void | VoidFunction
): void;

function watchOncePre<T>(
	source: Getter<T> | Array<Getter<T>>,
	effect: (value: T | Array<T>, previousValue: T | Array<T>) => void | VoidFunction
): void {
	runWatcherOnce(source, "pre", effect);
}

watchOnce.pre = watchOncePre;
