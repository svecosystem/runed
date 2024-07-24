import { extract } from "../extract/extract.js";
import { useEventListener } from "../useEventListener/useEventListener.svelte.js";
import type { MaybeGetter } from "$lib/internal/types.js";

/**
 * Takes a media query as an input and listsens for changes to it,
 * holding a reactive property with its current state.
 *
 * @see {@link https://runed.dev/docs/utilities/media-query}
 *
 * @example
 * ```ts
 * const screen = new MediaQuery("(min-width: 640px)");
 *
 * $effect(() => {
 * 	if (screen.matches) {
 * 		console.log("The screen is less than 640px");
 * 	}
 * });
 * ```
 *
 * @example
 * ```ts
 * let media = $state("(min-width: 640px)");
 * const screen = new MediaQuery(() => media);
 *
 * $effect(() => {
 * 	if (screen.matches) {
 * 		console.log(`Media query ${media} is ${screen.match}`);
 * 	}
 * });
 *
 * media = "(min-width: 320px)";
 * ```
 */
export class MediaQuery {
	#propQuery: MaybeGetter<string>;
	#query = $derived.by(() => extract(this.#propQuery));
	#mediaQueryList: MediaQueryList = $derived(window.matchMedia(this.#query));
	#effectRegistered = false;
	#matches: boolean | undefined = $state();

	constructor(query: MaybeGetter<string>) {
		this.#propQuery = query;
	}

	get matches(): boolean | undefined {
		if ($effect.tracking() && !this.#effectRegistered) {
			// If we are in an effect and this effect has not been registered yet
			// we match the current value, register the listener and return match
			$effect(() => {
				this.#effectRegistered = true;

				useEventListener(
					() => this.#mediaQueryList,
					"change",
					(changed) => (this.#matches = changed.matches)
				);

				return () => (this.#effectRegistered = false);
			});
		}

		return this.#matches ?? this.#mediaQueryList.matches;
	}
}
