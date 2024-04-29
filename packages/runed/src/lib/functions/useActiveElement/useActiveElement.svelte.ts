import { type ReadableBox, box } from "../box/box.svelte.js";
import { isBrowser } from "$lib/internal/utils/browser.js";

/**
 * Returns a reactive value that is equal to `document.activeElement`.
 * It automatically listens for changes, keeping the reference up to date.
 *
 * @returns an object with a reactive value `value` that is equal to `document.activeElement`,
 * or `null` if there's no active element.
 * 
 * @see {@link https://runed.dev/docs/functions/use-active-element}
 */
export function useActiveElement(): ReadableBox<Element | null> {
	const activeElement = box(isBrowser() ? document.activeElement : null);

	function onFocusChange() {
		activeElement.value = document.activeElement;
	}

	$effect(() => {
		document.addEventListener("focusin", onFocusChange);
		document.addEventListener("focusout", onFocusChange);

		return () => {
			document.removeEventListener("focusin", onFocusChange);
			document.removeEventListener("focusout", onFocusChange);
		};
	});

	return box.readonly(activeElement);
}
