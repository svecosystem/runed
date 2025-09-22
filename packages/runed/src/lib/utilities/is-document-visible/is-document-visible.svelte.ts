import {
	defaultWindow,
	type ConfigurableDocument,
	type ConfigurableWindow,
} from "$lib/internal/configurable-globals.js";
import { on } from "svelte/events";

export type IsDocumentVisibleOptions = ConfigurableWindow & ConfigurableDocument;

/**
 * Tracks whether the current document is visible (i.e., not hidden).
 * It listens to the "visibilitychange" event and updates reactively.
 *
 * @see {@link https://developer.mozilla.org/docs/Web/API/Document/visibilitychange_event}
 * @see {@link https://runed.dev/docs/utilities/is-document-visible}
 */
export class IsDocumentVisible {
	#visible: boolean = $state(false);

	constructor(options: IsDocumentVisibleOptions = {}) {
		const window = options.window ?? defaultWindow;
		const document = options.document ?? window?.document;

		this.#visible = document ? !document.hidden : false;

		$effect(() => {
			if (!document) return;
			return on(document, "visibilitychange", () => {
				this.#visible = !document.hidden;
			});
		});
	}

	get current(): boolean {
		return this.#visible;
	}
}
