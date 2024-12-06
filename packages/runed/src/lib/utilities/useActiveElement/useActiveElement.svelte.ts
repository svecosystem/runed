import { defaultDocument, type ConfigurableDocument } from "$lib/internal/configurable-globals.js";
import { Readable } from "../Readable/readable.svelte.js";

/**
 * Returns a reactive value that is equal to `document.activeElement`.
 * Optionally accepts a options object with a `document` property to configure
 * a different document to listen to.
 */
export function useActiveElement(opts: ConfigurableDocument = {}) {
	const { document = defaultDocument } = opts;
	return new Readable<Element | null>(null, (set, insideEffect) => {
		function update() {
			if (!document) return;
			set(document.activeElement);
		}

		update();

		if (!insideEffect || !document) return;

		document.addEventListener("focusin", update);
		document.addEventListener("focusout", update);

		return () => {
			document.removeEventListener("focusin", update);
			document.removeEventListener("focusout", update);
		};
	});
}
