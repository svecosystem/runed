import { type ConfigurableWindow } from "#lib/internal/configurable-globals.js";
import type { MaybeElementGetter } from "#lib/internal/types.js";
import {
	useIntersectionObserver,
	type UseIntersectionObserverOptions,
	type UseIntersectionObserverReturn,
} from "../use-intersection-observer/use-intersection-observer.svelte.js";

export type IsInViewportOptions = ConfigurableWindow & UseIntersectionObserverOptions;

/**
 * Tracks if an element is visible within the current viewport.
 *
 * @see {@link https://runed.dev/docs/utilities/is-in-viewport}
 */
export class IsInViewport {
	#isInViewport = $state(false);
	#observer: UseIntersectionObserverReturn;

	constructor(node: MaybeElementGetter, options?: IsInViewportOptions) {
		this.#observer = useIntersectionObserver(
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
	/** Current viewport intersection state */
	get current() {
		return this.#isInViewport;
	}

	/** The underlying intersection observer */
	get observer() {
		return this.#observer;
	}
}
