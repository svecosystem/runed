import {
	defaultWindow,
	type ConfigurableDocumentOrShadowRoot,
	type ConfigurableWindow,
} from "$lib/internal/configurable-globals.js";
import { getActiveElement } from "$lib/internal/utils/dom.js";
import { addEventListener } from "$lib/internal/utils/event.js";
import { Readable } from "../Readable/readable.svelte.js";

export type UseActiveElementOptions = ConfigurableDocumentOrShadowRoot & ConfigurableWindow;

/**
 * Returns a reactive value that is equal to `document.activeElement`.
 * Optionally accepts a options object to configure custom `document` and `window` environments.
 * When
 */
export function useActiveElement(opts: UseActiveElementOptions = {}) {
	const { window = defaultWindow } = opts;
	const document = opts.document ?? window?.document;

	return new Readable<Element | null>(null, (set, insideEffect) => {
		function update() {
			if (!document) return;
			set(getActiveElement(document));
		}

		update();

		if (!insideEffect || !window) return;

		const removeFocusIn = addEventListener(window, "focusin", update);
		const removeFocusOut = addEventListener(window, "focusout", update);

		return () => {
			removeFocusIn();
			removeFocusOut();
		};
	});
}
