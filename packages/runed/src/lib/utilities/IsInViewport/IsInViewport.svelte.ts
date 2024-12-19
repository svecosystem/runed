import type { MaybeGetter } from "$lib/internal/types.js";
import {
	useIntersectionObserver,
	type UseIntersectionObserverOptions,
} from "../useIntersectionObserver/useIntersectionObserver.svelte.js";

export type IsInViewportOptions = UseIntersectionObserverOptions;

/**
 * Tracks if an element is visible within the current viewport.
 *
 * @see {@link https://runed.dev/docs/utilities/is-in-viewport}
 */
export class IsInViewport {
	#isInViewport = $state(false);

	constructor(node: MaybeGetter<HTMLElement | null | undefined>, options?: IsInViewportOptions) {
		useIntersectionObserver(
			node,
			(intersectionObserverEntries) => {
				let isIntersecting = this.#isInViewport;
				let latestTime = 0;
				for (const entry of intersectionObserverEntries) {
					if (entry.time >= latestTime) {
						latestTime = entry.time;
						isIntersecting = entry.isIntersecting;
					}
				}
				this.#isInViewport = isIntersecting;
			},
			options
		);
	}

	get current() {
		return this.#isInViewport;
	}
}
