import { defaultDocument, type ConfigurableDocument } from "$lib/internal/configurable-globals.js";
import type { MaybeElementGetter } from "$lib/internal/types.js";
import { getOwnerDocument, isOrContainsTarget } from "$lib/internal/utils/dom.js";
import { addEventListener } from "$lib/internal/utils/event.js";
import { noop } from "$lib/internal/utils/function.js";
import { isElement } from "$lib/internal/utils/is.js";
import { extract } from "../extract/extract.svelte.js";
import { useDebounce } from "../useDebounce/useDebounce.svelte.js";
import { watch } from "../watch/watch.svelte.js";

export type OnClickOutsideOptions = ConfigurableDocument & {
	/**
	 * Whether the click outside handler is enabled by default or not.
	 * If set to false, the handler will not be active until enabled by
	 * calling the returned `start` function
	 *
	 * @default true
	 */
	immediate?: boolean;
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
	callback: (event: PointerEvent) => void,
	opts: OnClickOutsideOptions = {}
) {
	const { document = defaultDocument, immediate = true } = opts;
	const node = $derived(extract(container));
	const nodeOwnerDocument = $derived(getOwnerDocument(node, document));

	let enabled = $state(immediate);
	let pointerDownIntercepted = false;
	let removeClickListener = noop;
	let removePointerListeners = noop;

	const handleClickOutside = useDebounce((e: PointerEvent) => {
		if (!node || !nodeOwnerDocument) {
			removeClickListener();
			return;
		}

		if (pointerDownIntercepted === true || !isValidEvent(e, node)) {
			removeClickListener();
			return;
		}

		if (e.pointerType === "touch") {
			/**
			 * If the pointer type is touch, we add a listener to wait for the click
			 * event that will follow the pointerdown event if the user interacts in a way
			 * that would trigger a click event.
			 *
			 * This prevents us from prematurely calling the callback if the user is simply
			 * scrolling or dragging the page.
			 */
			removeClickListener();
			removeClickListener = addEventListener(nodeOwnerDocument, "click", () => callback(e), {
				once: true,
			});
		} else {
			/**
			 * I
			 */
			callback(e);
		}
	}, 10);

	function addPointerDownListeners() {
		if (!nodeOwnerDocument) return noop;
		const events = [
			/**
			 * CAPTURE INTERACTION START
			 * mark the pointerdown event as intercepted
			 */
			addEventListener(
				nodeOwnerDocument,
				"pointerdown",
				(e) => {
					if (!node) return;
					if (isValidEvent(e, node)) {
						pointerDownIntercepted = true;
					}
				},
				true
			),
			/**
			 * BUBBLE INTERACTION START
			 * Mark the pointerdown event as non-intercepted. Debounce `handleClickOutside` to
			 * avoid prematurely checking if other events were intercepted.
			 */
			addEventListener(nodeOwnerDocument, "pointerdown", (e) => {
				pointerDownIntercepted = false;
				handleClickOutside(e);
			}),
		];
		return () => {
			for (const event of events) {
				event();
			}
		};
	}

	function cleanup() {
		pointerDownIntercepted = false;
		handleClickOutside.cancel();
		removeClickListener();
		removePointerListeners();
	}

	watch([() => enabled, () => node], ([enabled$, node$]) => {
		if (enabled$ && node$) {
			removePointerListeners();
			removePointerListeners = addPointerDownListeners();
		} else {
			cleanup();
		}
	});

	$effect(() => {
		return () => {
			cleanup();
		};
	});

	/**
	 * Stop listening for click events outside the container.
	 */
	const stop = () => (enabled = false);

	/**
	 * Start listening for click events outside the container.
	 */
	const start = () => (enabled = true);

	return {
		stop,
		start,
		/**
		 * Whether the click outside handler is currently enabled or not.
		 */
		get enabled() {
			return enabled;
		},
	};
}

function isValidEvent(e: PointerEvent, container: Element): boolean {
	if ("button" in e && e.button > 0) return false;
	const target = e.target;
	if (!isElement(target)) return false;
	const ownerDocument = getOwnerDocument(target);
	if (!ownerDocument) return false;
	// handle the case where a user may have pressed a pseudo element by
	// checking the bounding rect of the container
	if (target === container) {
		const rect = container.getBoundingClientRect();
		const wasInsideClick =
			rect.top <= e.clientY &&
			e.clientY <= rect.top + rect.height &&
			rect.left <= e.clientX &&
			e.clientX <= rect.left + rect.width;
		return !wasInsideClick;
	}
	return ownerDocument.documentElement.contains(target) && !isOrContainsTarget(container, target);
}
