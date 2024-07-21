import type { MaybeGetter } from "../../internal/types.js";
import { extract } from "../extract/extract.js";
import { useEventListener } from "../useEventListener/useEventListener.svelte.js";

/**
 * Accepts a box which holds a container element and callback function.
 * Invokes the callback function when the user clicks outside of the
 * container.
 *
 * @see {@link https://runed.dev/docs/utilities/use-click-outside}
 */
export function useClickOutside<T extends Element>(
	container: MaybeGetter<T | undefined>,
	callback: () => void
) {
	const el = $derived(extract(container));

	function handleClick(event: MouseEvent) {
		if (!event.target || !el) {
			return;
		}

		const rect = el.getBoundingClientRect();
		const clickedInside =
			rect.top <= event.clientY &&
			event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX &&
			event.clientX <= rect.left + rect.width;

		if (!clickedInside) {
			callback();
		}
	}

	useEventListener(() => document, "click", handleClick);
}
