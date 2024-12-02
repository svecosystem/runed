import { extract } from "../extract/extract.svelte.js";
import { useMutationObserver } from "../useMutationObserver/useMutationObserver.svelte.js";
import { useResizeObserver } from "../useResizeObserver/useResizeObserver.svelte.js";
import type { MaybeGetter } from "$lib/internal/types.js";

type Rect = Omit<DOMRect, "toJSON">;

export type ElementRectOptions = {
	initialRect?: DOMRect;
};

/**
 * Returns a reactive value holding the size of `node`.
 *
 * Accepts an `options` object with the following properties:
 * - `initialSize`: The initial size of the element. Defaults to `{ width: 0, height: 0 }`.
 * - `box`: The box model to use. Can be either `"content-box"` or `"border-box"`. Defaults to `"border-box"`.
 *
 * @returns an object with `width` and `height` properties.
 *
 * @see {@link https://runed.dev/docs/utilities/element-size}
 */
export class ElementRect {
	#rect = $state<Rect>({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	});

	constructor(node: MaybeGetter<HTMLElement | undefined | null>, options: ElementRectOptions = {}) {
		this.#rect = {
			width: options.initialRect?.width ?? 0,
			height: options.initialRect?.height ?? 0,
			x: options.initialRect?.x ?? 0,
			y: options.initialRect?.y ?? 0,
			top: options.initialRect?.top ?? 0,
			right: options.initialRect?.right ?? 0,
			bottom: options.initialRect?.bottom ?? 0,
			left: options.initialRect?.left ?? 0,
		};

		const el = $derived(extract(node));
		const update = () => {
			if (!el) return;
			const rect = el.getBoundingClientRect();
			this.#rect = {
				width: rect.width,
				height: rect.height,
				x: rect.x,
				y: rect.y,
				top: rect.top,
				right: rect.right,
				bottom: rect.bottom,
				left: rect.left,
			};
		};

		useResizeObserver(() => el, update);
		$effect(update);
		useMutationObserver(() => el, update, { attributeFilter: ["style", "class"] });
	}

	get x(): number {
		return this.#rect.x;
	}

	get y(): number {
		return this.#rect.y;
	}

	get width(): number {
		return this.#rect.width;
	}

	get height(): number {
		return this.#rect.height;
	}

	get top(): number {
		return this.#rect.top;
	}

	get right(): number {
		return this.#rect.right;
	}

	get bottom(): number {
		return this.#rect.bottom;
	}

	get left(): number {
		return this.#rect.left;
	}

	get current(): Rect {
		return this.#rect;
	}
}
