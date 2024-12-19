import { extract } from "../extract/extract.svelte.js";
import { activeElement } from "../activeElement/activeElement.svelte.js";
import type { MaybeGetter } from "$lib/internal/types.js";

/**
 * Tracks whether the focus is within a target element.
 * @see {@link https://runed.dev/docs/utilities/is-focus-within}
 */
export class IsFocusWithin {
	#node: MaybeGetter<HTMLElement | undefined | null>;
	#target = $derived.by(() => extract(this.#node));

	constructor(node: MaybeGetter<HTMLElement | undefined | null>) {
		this.#node = node;
	}

	readonly current = $derived.by(() => {
		if (!this.#target || !activeElement.current) return false;
		return this.#target.contains(activeElement.current);
	});
}
