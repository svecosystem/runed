import { extract } from "../extract/extract.svelte.js";
import type { MaybeElementGetter } from "$lib/internal/types.js";
import {
	type ConfigurableDocumentOrShadowRoot,
	type ConfigurableWindow,
} from "$lib/internal/configurable-globals.js";
import { useActiveElement } from "../useActiveElement/useActiveElement.svelte.js";

type IsFocusWithinOptions = ConfigurableDocumentOrShadowRoot & ConfigurableWindow;

/**
 * Tracks whether the focus is within a target element.
 * @see {@link https://runed.dev/docs/utilities/is-focus-within}
 */
export class IsFocusWithin {
	#node: MaybeElementGetter;
	#target = $derived.by(() => extract(this.#node));
	#activeElement: ReturnType<typeof useActiveElement>;

	constructor(node: MaybeElementGetter, options: IsFocusWithinOptions = {}) {
		this.#node = node;
		this.#activeElement = useActiveElement({ document: options.document, window: options.window });
	}

	readonly current = $derived.by(() => {
		if (!this.#target || !this.#activeElement.current) return false;
		return this.#target.contains(this.#activeElement.current);
	});
}
