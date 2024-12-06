import { extract } from "../extract/extract.svelte.js";
import type { MaybeGetter } from "$lib/internal/types.js";
import { defaultDocument, type ConfigurableDocument } from "$lib/internal/configurable-globals.js";
import { useActiveElement } from "../useActiveElement/useActiveElement.svelte.js";

type IsFocusWithinOptions = ConfigurableDocument;

/**
 * Tracks whether the focus is within a target element.
 * @see {@link https://runed.dev/docs/utilities/is-focus-within}
 */
export class IsFocusWithin {
	#node: MaybeGetter<HTMLElement | undefined | null>;
	#target = $derived.by(() => extract(this.#node));
	#document: IsFocusWithinOptions["document"] = defaultDocument;
	#activeElement: ReturnType<typeof useActiveElement>;

	constructor(
		node: MaybeGetter<HTMLElement | undefined | null>,
		options: IsFocusWithinOptions = {}
	) {
		this.#node = node;
		if (options.document) this.#document = options.document;
		this.#activeElement = useActiveElement({ document: this.#document });
	}

	readonly current = $derived.by(() => {
		if (!this.#target || !this.#activeElement.current) return false;
		return this.#target.contains(this.#activeElement.current);
	});
}
