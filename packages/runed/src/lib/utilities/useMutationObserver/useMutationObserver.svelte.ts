import { IsSupported } from "../IsSupported/IsSupported.svelte.js";
import { extract } from "../extract/extract.js";
import { watch } from "../watch/watch.svelte.js";
import type { MaybeGetter } from "$lib/internal/types.js";
import { safelyCleanup } from "$lib/internal/utils/effect.svelte.js";

export interface UseMutationObserverOptions extends MutationObserverInit {}

/**
 * Watch for changes being made to the DOM tree.
 *
 * @see https://runed.dev/docs/utilities/useMutationObserver
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver MutationObserver MDN
 */
export function useMutationObserver(
	target: MaybeGetter<HTMLElement | HTMLElement[] | null | undefined>,
	callback: MutationCallback,
	options: UseMutationObserverOptions = {}
) {
	let observer: MutationObserver | undefined;
	const isSupported = new IsSupported(() => window && "MutationObserver" in window);

	const cleanup = () => {
		if (!observer) return;
		observer.disconnect();
		observer = undefined;
	};

	const targets = $derived.by(() => {
		const value = extract(target);
		const items =
			value === null || value === undefined ? [] : Array.isArray(value) ? value : [value];
		return new Set(items);
	});

	const stopWatch = watch(
		() => targets,
		(targets) => {
			cleanup();

			if (isSupported.current && targets.size) {
				observer = new MutationObserver(callback);
				targets.forEach((el) => observer!.observe(el, options));
			}
		}
	);

	const takeRecords = () => {
		return observer?.takeRecords();
	};

	const stop = () => {
		cleanup();
		stopWatch();
	};

	safelyCleanup(stop);

	return {
		isSupported,
		stop,
		takeRecords,
	};
}

export type UseMutationObserverReturn = ReturnType<typeof useMutationObserver>;
