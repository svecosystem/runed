import { extract } from "../extract/extract.js";

import type { MaybeGetter } from "$lib/internal/types.js";
import { addEventListener } from "$lib/internal/utils/event.js";

// Whether the primary input device supports hover
function isHoverSupported() {
	return window.matchMedia("(hover: hover)").matches;
}

// Whether the primary input device supports fine pointer accuracy
function hasFinePointer() {
	return window.matchMedia("(pointer: fine)").matches;
}

function canHover() {
	return isHoverSupported() && hasFinePointer();
}

/**
 * Tracks whether the user is hovering over the target element.
 * @see {@link https://runed.dev/docs/utilities/is-hovered}
 */
export class IsHovered<T extends HTMLElement | undefined> {
	#node: MaybeGetter<T>;
	#target = $derived.by(() => extract(this.#node));
	#current = $state<boolean>(false);

	constructor(node: MaybeGetter<T>) {
		this.#node = node;

		const handleMouseEnter = () => {
			this.#current = true;
		};
		const handleMouseLeave = () => {
			this.#current = false;
		};

		$effect(() => {
			if (!this.#target || !canHover()) {
				return;
			}

			const callbacks: VoidFunction[] = [];

			callbacks.push(addEventListener(this.#target, "mouseenter", handleMouseEnter));
			callbacks.push(addEventListener(this.#target, "mouseleave", handleMouseLeave));

			return () => {
				return () => callbacks.forEach((c) => c());
			};
		});
	}

	get current(): boolean {
		return this.#current;
	}
}
