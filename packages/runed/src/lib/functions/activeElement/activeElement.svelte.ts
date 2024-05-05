import { box } from "../box/box.svelte.js";

let value = $state<Element | null>(null);
function onFocusChange() {
	if (typeof document === "undefined") return;
	value = document.activeElement;
}
let hasActiveBox = $state(false);

$effect.root(() => {
	$effect(() => {
		if (!hasActiveBox) return

		document.addEventListener("focusin", onFocusChange);
		document.addEventListener("focusout", onFocusChange);

		return () => {

			document.removeEventListener("focusin", onFocusChange);
			document.removeEventListener("focusout", onFocusChange);
		};
	})
});

/**
 * A box holding a reactive value that is equal to `document.activeElement`.
 * It automatically listens for changes, keeping the reference up to date.
 *
 * @see {@link https://runed.dev/docs/functions/use-active-element}
 */
export const activeElement = box.with(() => {
	if (!hasActiveBox) {
		hasActiveBox = true
	}
	onFocusChange();

	return value
})