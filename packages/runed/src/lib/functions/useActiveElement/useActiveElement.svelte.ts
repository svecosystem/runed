import { isBrowser } from "$lib/internal/utils/browser.js";


/**
 * Returns a reactive value that is equal to `document.activeElement`.
 * It automatically listens for changes, keeping the reference up to date.
 *
 * @export
 * @returns {{ value: Readonly<Element | null> }}
 */
export function useActiveElement(): { value: Readonly<Element | null> } {
	const activeElement = $state({ value: isBrowser() ? document.activeElement : null });

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

	return activeElement;
}
