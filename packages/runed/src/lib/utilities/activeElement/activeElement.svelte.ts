import { Readable } from "../Readable/readable.svelte.js";
import { browser } from "$lib/internal/utils/browser.js";
import { defaultDocument, type ConfigurableDocument } from "$lib/internal/configurable-globals.js";

/**
 * Returns a reactive value that is equal to `document.activeElement`.
 * Optionally accepts a options object with a `document` property to specify the
 * document to listen to.
 */
function useActiveElement(opts: ConfigurableDocument = {}) {
	const document = opts.document ?? defaultDocument!;
	return new Readable<Element | null>(null, (set, insideEffect) => {
		function update() {
			if (!browser) return;
			set(document.activeElement);
		}

		update();

		if (!insideEffect) return;

		document.addEventListener("focusin", update);
		document.addEventListener("focusout", update);

		return () => {
			document.removeEventListener("focusin", update);
			document.removeEventListener("focusout", update);
		};
	});
}

/**
 * An object holding a reactive value that is equal to `document.activeElement`.
 * It automatically listens for changes, keeping the reference up to date.
 *
 * @see {@link https://runed.dev/docs/utilities/active-element}
 */
export const activeElement = useActiveElement();
