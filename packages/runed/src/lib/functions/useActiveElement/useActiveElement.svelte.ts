import { isBrowser } from "$lib/internal/utils/browser.js";

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
