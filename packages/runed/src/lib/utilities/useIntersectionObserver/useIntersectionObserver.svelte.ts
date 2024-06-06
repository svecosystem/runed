import { extract } from "../extract/extract.js";
import type { MaybeGetter } from "$lib/internal/types.js";
import { get } from "$lib/internal/utils/get.js";
import { noop } from "$lib/internal/utils/function.js";

export interface UseIntersectionObserverOptions extends Omit<IntersectionObserverInit, "root"> {
	/**
	 * Whether to start the observer immediately upon creation.
	 *
	 * @defaultValue true
	 */
	immediate?: boolean;

	/**
	 * The root document/element to use as the bounding box for the intersection.
	 */
	root?: MaybeGetter<HTMLElement | null | undefined>;
}

/**
 * Watch for intersection changes of a target element.
 *
 * @see https://runed.dev/docs/utilities/useIntersectionObserver
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver IntersectionObserver MDN
 */
export function useIntersectionObserver(
	target: MaybeGetter<HTMLElement | HTMLElement[] | null | undefined>,
	callback: IntersectionObserverCallback,
	options: UseIntersectionObserverOptions = {}
) {
	const { root, rootMargin = "0px", threshold = 0.1, immediate = true } = options;

	let observer: IntersectionObserver | undefined;

	let cleanup = noop;

	const targets = $derived.by(() => {
		const value = extract(target);
		return new Set(value ? (Array.isArray(value) ? value : [value]) : []);
	});

	let isActive = $state(immediate);

	const stop = $effect.root(() => {
		$effect(() => {
			if (!targets.size || !isActive) return;
			observer = new IntersectionObserver(callback, { rootMargin, root: get(root), threshold });
			for (const el of targets) observer.observe(el);

			cleanup = () => {
				observer?.disconnect();
				cleanup = noop;
				observer = undefined;
			};

			return cleanup;
		});
	});

	$effect(() => {
		return stop;
	});

	return {
		get isActive() {
			return isActive;
		},
		stop,
		pause() {
			cleanup();
			isActive = false;
		},
		resume() {
			isActive = true;
		},
	};
}

export type UseIntersectionObserverReturn = ReturnType<typeof useIntersectionObserver>;
