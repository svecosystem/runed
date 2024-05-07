import { untrack } from "svelte";
import { extract } from "../extract/extract.js";
import { isFunction } from "$lib/internal/utils/is.js";
import type { Getter } from "$lib/internal/types.js";

function runEffect(flush: "pre" | "post", effect: () => void | (() => void)) {
	switch (flush) {
		case "pre": {
			$effect.pre(effect);
			break;
		}
		case "post": {
			$effect(effect);
			break;
		}
	}
}


export type WatchOptions = {
	/**
	 * If `true`, the effect doesn't run until one of the `sources` changes.
	 *
	 * @default false
	 */
	lazy?: boolean;

	/**
	 * If `true`, the effect only runs once.
	 *
	 * @default false
	 */
	once?: boolean;
};

function runWatcher<T>(
	sources: Getter<T> | Getter<T>[],
	effect: (
		values: T | Array<T>,
		previousValues: T | undefined | Array<T | undefined>
	) => void | (() => void),
	flush: "pre" | "post",
	options: WatchOptions
) {
	const { lazy = false, once = false } = options;

	const cleanupRoot = $effect.root(() => {
		let initialRun = true;
		let stopEffect = false;
		let previousValues: T | undefined | Array<T | undefined>;
		runEffect(flush, () => {
			if (stopEffect) {
				cleanupRoot();
				return;
			}

			const values = Array.isArray(sources) ? sources.map(s => extract(s)) : extract(sources);

			let cleanupEffect: void | (() => void);
			if (!lazy || !initialRun) {
				// On the first run, if this fn received an array, pass an array of `undefined`
				// values instead of `undefined` to allow destructuring.
				//
				// watch([a, b], ([a, b], [prevA, prevB]) => { ... });
				if (previousValues === undefined && Array.isArray(values)) {
					previousValues = Array(values.length).fill(undefined);
				}

				cleanupEffect = untrack(() => effect(values, previousValues));

				if (once) {
					stopEffect = true;
				}
			}

			initialRun = false;
			previousValues = values;

			return () => {
				if (isFunction(cleanupEffect)) {
					cleanupEffect();
				}
			};
		});
	});

	$effect(() => {
		return cleanupRoot;
	});
}

export function watch<T>(
	source: Getter<T>,
	effect: (value: T, previousValue: T | undefined) => void | (() => void),
	options?: WatchOptions
): void;

export function watch<T extends unknown[]>(
	sources: { [K in keyof T]: Getter<T[K]> },
	effect: (values: T, previousValues: { [K in keyof T]: T[K] | undefined }) => void | (() => void),
	options?: WatchOptions
): void;

export function watch<T>(
	sources: Getter<T> | Array<Getter<T>>,
	effect: (
		values: T | Array<T>,
		previousValues: T | undefined | Array<T | undefined>
	) => void | (() => void),
	options: WatchOptions = {}
): void {
	runWatcher(sources, effect, "post", options);
}

function watchPre<T>(
	source: Getter<T>,
	effect: (value: T, previousValue: T | undefined) => void | (() => void),
	options?: WatchOptions
): void;

function watchPre<T extends unknown[]>(
	sources: { [K in keyof T]: Getter<T[K]> },
	effect: (values: T, previousValues: { [K in keyof T]: T[K] | undefined }) => void | (() => void),
	options?: WatchOptions
): void;

function watchPre<T>(
	sources: Getter<T> | Array<Getter<T>>,
	effect: (
		values: T | Array<T>,
		previousValues: T | undefined | Array<T | undefined>
	) => void | (() => void),
	options: WatchOptions = {}
): void {
	runWatcher(sources, effect, "pre", options);
}

watch.pre = watchPre;
