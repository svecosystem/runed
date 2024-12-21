import { defaultDocument, type ConfigurableDocument } from "$lib/internal/configurable-globals.js";
import type { MaybeElement, MaybeElementGetter, MaybeGetter } from "$lib/internal/types.js";
import { extract } from "../extract/extract.svelte.js";
import { useEventListener } from "../useEventListener/useEventListener.svelte.js";

export type OnClickOutsideOptions = ConfigurableDocument & {
	/**
	 * A list of elements and/or selectors to ignore when determining if a click
	 * event occurred outside of the container.
	 */
	ignore?: MaybeGetter<Array<MaybeElement | string>>;
};

/**
 * A utility that calls a given callback when a click event occurs outside of
 * a specified container element.
 *
 * @template T - The type of the container element, defaults to HTMLElement.
 * @param {MaybeElementGetter<T>} container - The container element or a getter function that returns the container element.
 * @param {() => void} callback - The callback function to call when a click event occurs outside of the container.
 * @param {OnClickOutsideOptions} [opts={}] - Optional configuration object.
 * @param {ConfigurableDocument} [opts.document=defaultDocument] - The document object to use, defaults to the global document.
 *
 * @example
 * ```svelte
 * <script>
 *   import { onClickOutside } from 'runed'
 *   let container = $state<HTMLElement>()!
 *
 *   onClickOutside(() => container, () => {
 *     console.log('clicked outside the container!')
 *   });
 * </script>
 *
 * <div bind:this={container}>
 *  <span>Inside</span>
 * </div>
 * <button>Outside, click me to trigger callback</button>
 *```
 * @see {@link https://runed.dev/docs/utilities/on-click-outside}
 */
export function onClickOutside<T extends Element = HTMLElement>(
	container: MaybeElementGetter<T>,
	callback: () => void,
	opts: OnClickOutsideOptions = {}
): void {
	const { document = defaultDocument } = opts;

	/**
	 * WIP - need to handle cases where a pointerdown starts in the container
	 * but is released outside the container. This would result in a click event
	 * occurring outside the container, but we shouldn't trigger the callback
	 * unless the _complete_ click event occurred outside.
	 *
	 * Additionally, we should _really_ only doing the rect comparison if the event target
	 * is the same as the container or a descendant of the container which should cover the
	 * cases of pseudo elements being clicked.
	 */

	function handleClick(e: MouseEvent) {
		if (!e.target) return;
		const node = extract(container);
		if (!node) return;

		const rect = node.getBoundingClientRect();
		const wasInsideClick =
			rect.top <= e.clientY &&
			e.clientY <= rect.top + rect.height &&
			rect.left <= e.clientX &&
			e.clientX <= rect.left + rect.width;

		if (!wasInsideClick) callback();
	}

	useEventListener(() => document, "click", handleClick);
}
