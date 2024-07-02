import type { MaybeGetter } from "../../internal/types.js";
import { watch } from "../watch/watch.svelte.js";
import { extract } from "../extract/extract.js";

type ClickOutside = {
	start: () => void;
	stop: () => void;
};

/**
 * Accepts a box which holds a container element and callback function.
 * Invokes the callback function when the user clicks outside of the
 * container.
 *
 * @returns an object with start and stop functions
 *
 * @see {@link https://runed.dev/docs/functions/use-click-outside}
 */
export function useClickOutside<T extends Element>(
	container: MaybeGetter<T | undefined>,
	callback: () => void
): ClickOutside {
	let isEnabled = $state<boolean>(true);
	const el = $derived<T | undefined>(extract(container));

	function start() {
		isEnabled = true;
	}

	function stop() {
		isEnabled = false;
	}

	function handleClick(event: MouseEvent) {
		if (event.target && !el?.contains(event.target as Node)) {
			callback();
		}
	}

	watch([() => el, () => isEnabled], ([currentEl, currentIsEnabled]) => {
		if (currentEl && currentIsEnabled) {
			window.addEventListener("click", handleClick);
		}

		return () => {
			window.removeEventListener("click", handleClick);
		};
	});

	return {
		start,
		stop,
	};
}
