import { box, type WritableBox } from "$lib/functions/box/box.svelte.js";
import { watch } from "$lib/functions/watch/watch.svelte.js";

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
	container: WritableBox<T | null>,
	fn: () => void
): ClickOutside {
	const isEnabled = box<boolean>(true);

	function start() {
		isEnabled.value = true;
	}

	function stop() {
		isEnabled.value = false;
	}

	function handleClick(event: MouseEvent) {
		if (event.target && !container.value?.contains(event.target as Node)) {
			fn();
		}
	}

	watch([container, isEnabled], ([currentContainer, currentIsEnabled]) => {
		if (currentContainer && currentIsEnabled) {
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
