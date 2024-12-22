import {
	defaultWindow,
	type ConfigurableDocumentOrShadowRoot,
	type ConfigurableWindow,
} from "$lib/internal/configurable-globals.js";
import { getActiveElement } from "$lib/internal/utils/dom.js";
import { on } from "svelte/events";
import { createSubscriber } from "svelte/reactivity";

export interface ActiveElementOptions
	extends ConfigurableDocumentOrShadowRoot,
		ConfigurableWindow {}

export class ActiveElement {
	#current: Element | null = null;
	readonly #subscribe?: () => void;

	constructor(options: ActiveElementOptions = {}) {
		const { window = defaultWindow, document = window?.document } = options;
		if (window === undefined || document === undefined) {
			return;
		}

		this.#current = getActiveElement(document);
		this.#subscribe = createSubscriber((update) => {
			this.#current = getActiveElement(document);

			const onFocusInOrOut = () => {
				this.#current = getActiveElement(document);
				update();
			};

			const cleanupFocusIn = on(window, "focusin", onFocusInOrOut);
			const cleanupFocusOut = on(window, "focusout", onFocusInOrOut);
			return () => {
				cleanupFocusIn();
				cleanupFocusOut();
			};
		});
	}

	get current(): Element | null {
		this.#subscribe?.();
		return this.#current;
	}
}

/**
 * An object holding a reactive value that is equal to `document.activeElement`.
 * It automatically listens for changes, keeping the reference up to date.
 *
 * If you wish to use a custom document or shadowRoot, you should use
 * [useActiveElement](https://runed.dev/docs/utilities/active-element) instead.
 *
 * @see {@link https://runed.dev/docs/utilities/active-element}
 */
export const activeElement = new ActiveElement();
