import { useEventListener } from "../useEventListener/useEventListener.svelte.js";
import type { Getter, MaybeGetter } from "$lib/internal/types.js";
import { browser } from "$lib/internal/utils/browser.js";

/**
 * Take a media query (or a function that returns one if you want reactivity)
 * as input and you can check if it currently matches doing `instance.match`
 *
 * @see {@link https://runed.dev/docs/utilities/media-query}
 *
 * @example
 * ```ts
 * const screen = new MediaQuery("(min-width: 640px)");
 *
 * $effect(() => {
 * 	if (screen.match) {
 * 		console.log("The screen is less than 640px");
 * 	}
 * });
 * ```
 *
 * @example
 * ```ts
 * let media = $state("(min-width: 640px)");
 * const screen = new MediaQuery(()=> media);
 *
 * $effect(() => {
 * 	if (screen.match) {
 * 		console.log(`Media query ${media} is ${screen.match}`);
 * 	}
 * });
 *
 * media = "(min-width: 320px)";
 * ```
 */
export class MediaQuery {
	#matches: boolean | undefined = $state();
	#effectRegistered = false;
	#query_fn: Getter<string | void> = () => {};
	// this will be initialized in the constructor
	#query = $derived(this.#query_fn?.()) as string;

	constructor(query: MaybeGetter<string>) {
		this.#query_fn = typeof query === "function" ? query : () => query;
	}

	#matchMedia() {
		const result = window.matchMedia(this.#query);
		this.#matches = result.matches;
		return result;
	}

	get matches(): boolean | undefined {
		// if we are in an effect and this effect has not been registered yet
		// we match the current value, register the listener and return match
		if ($effect.active() && !this.#effectRegistered) {
			$effect(() => {
				const result = this.#matchMedia();
				this.#effectRegistered = true;
				useEventListener(result, "change", (changed) => {
					this.#matches = changed.matches;
				});
				return () => {
					this.#effectRegistered = false;
				};
			});
		} else if (!$effect.active()) {
			// otherwise if we are not in an effect and the effect has not
			//been registered we just match media to get the current value
			if (browser) {
				this.#matchMedia();
			}
		}
		return this.#matches;
	}
}
