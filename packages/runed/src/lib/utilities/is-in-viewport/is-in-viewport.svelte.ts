import type { ConfigurableWindow } from "$lib/internal/configurable-globals.js";
import type { MaybeElementGetter } from "$lib/internal/types.js";
import {
	useIntersectionObserver,
	type UseIntersectionObserverOptions,
} from "../use-intersection-observer/use-intersection-observer.svelte.js";

export type IsInViewportOptions = ConfigurableWindow & UseIntersectionObserverOptions;

/**
 * Tracks if an element is visible within the current viewport.
 *
 * @see {@link https://runed.dev/docs/utilities/is-in-viewport}
 */
export class IsInViewport {
	#isInViewport = $state(false);
	#observer;

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

	/**
	 * Stop observing the element.
	 */
	stop() {
		this.#observer.stop();
	}

	/**
	 * Pause the intersection observer.
	 */
	pause() {
		this.#observer.pause();
	}

	/**
	 * Resume the intersection observer.
	 */
	resume() {
		this.#observer.resume();
	}

	/**
	 * Whether the intersection observer is currently active.
	 */
	get isActive() {
		return this.#observer.isActive;
	}
}
