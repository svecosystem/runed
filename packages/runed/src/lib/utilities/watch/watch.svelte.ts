import { untrack } from "svelte";
import { isFunction } from "$lib/internal/utils/is.js";
import type { Getter } from "$lib/internal/types.js";

function runEffect(flush: "pre" | "post", effect: () => void | (() => void)): void {
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

type PreviousValue<T> = T extends Array<infer U> ? Array<U | undefined> : T | undefined;

function runWatcher<T>(
	source: Getter<T>,
	effect: (value: T, previousValue: PreviousValue<T>) => void | (() => void),
	flush: "pre" | "post",
	options: WatchOptions = {}
): void {
	const { lazy = false, once = false } = options;

	const cleanupRoot = $effect.root(() => {
		let initialRun = true;
		let stopEffect = false;
		let previousValues: T | [] | undefined;
		runEffect(flush, () => {
			if (stopEffect) {
				cleanupRoot();
				return;
			}

			const values = source();

			let cleanupEffect: void | (() => void);
			if (!lazy || !initialRun) {
				// On the first run, if this fn received an array, pass an empty array
				// instead of `undefined` to allow destructuring.
				//
				// watch(() => [a, b], ([a, b], [prevA, prevB]) => { ... });
				if (previousValues === undefined && Array.isArray(values)) {
					previousValues = [];
				}

				// eslint-disable-next-line ts/no-explicit-any
				cleanupEffect = untrack(() => effect(values, previousValues as any));

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
	effect: (value: T, previousValue: PreviousValue<T>) => void | (() => void),
	options?: WatchOptions
): void {
	runWatcher(source, effect, "post", options);
}

watch.pre = function <T>(
	source: Getter<T>,
	effect: (value: T, previousValue: PreviousValue<T>) => void | (() => void),
	options?: WatchOptions
): void {
	runWatcher(source, effect, "pre", options);
};
