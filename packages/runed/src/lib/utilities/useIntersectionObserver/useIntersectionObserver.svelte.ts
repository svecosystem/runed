import { extract } from "../extract/extract.js";
import type { MaybeGetter } from "$lib/internal/types.js";

export interface UseIntersectionObserverOptions extends Omit<IntersectionObserverInit, "root"> {
	/**
	 * Whether to start the observer immediately upon creation. If set to `false`, the observer
	 * will only start observing when `resume()` is called.
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

	let isActive = $state(immediate);
	let observer: IntersectionObserver | undefined;

	const targets = $derived.by(() => {
		const value = extract(target);
		return new Set(value ? (Array.isArray(value) ? value : [value]) : []);
	});

	const stop = $effect.root(() => {
		$effect(() => {
			if (!targets.size || !isActive) return;
			observer = new IntersectionObserver(callback, { rootMargin, root: extract(root), threshold });
			for (const el of targets) observer.observe(el);

			return () => {
				observer?.disconnect();
			};
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
			isActive = false;
		},
		resume() {
			isActive = true;
		},
	};
}

export type UseIntersectionObserverReturn = ReturnType<typeof useIntersectionObserver>;
