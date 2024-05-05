import { box } from "../box/box.svelte.js";
import type { MaybeBoxOrGetter, MaybeGetter } from "$lib/internal/types.js";
import { get } from "$lib/internal/utils/get.js";

export type UseElementSizeOptions = {
	initialSize?: {
		width: number;
		height: number;
	};
	box?: "content-box" | "border-box";
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
 * @see {@link https://runed.dev/docs/functions/use-element-size}
 */
export function useElementSize(
	_node: MaybeBoxOrGetter<HTMLElement | undefined>,
	options: UseElementSizeOptions = {
		box: "border-box",
	}
): { width: number; height: number } {
	const node = box.from(_node);
	const size = $state({
		width: options.initialSize?.width ?? 0,
		height: options.initialSize?.height ?? 0,
	});

	$effect(() => {
		if (!node.value) return;

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const boxSize = options.box === "content-box" ? entry.contentBoxSize : entry.borderBoxSize;
				const boxSizeArr = Array.isArray(boxSize) ? boxSize : [boxSize];
				size.width = boxSizeArr.reduce((acc, size) => Math.max(acc, size.inlineSize), 0);
				size.height = boxSizeArr.reduce((acc, size) => Math.max(acc, size.blockSize), 0);
			}
		});
		observer.observe(node.value);

		return () => {
			observer.disconnect();
		};
	});

	return size;
}

/**
 * Returns a reactive value holding the size of `node`.
 *
 * Accepts an `options` object with the following properties:
 * - `initialSize`: The initial size of the element. Defaults to `{ width: 0, height: 0 }`.
 * - `box`: The box model to use. Can be either `"content-box"` or `"border-box"`. Defaults to `"border-box"`.
 *
 * @returns an object with `width` and `height` properties.
 *
 * @see {@link https://runed.dev/docs/functions/use-element-size}
 */
export class ElementSize {
	#size = $state({
		width: 0,
		height: 0,
	})

	constructor(node: MaybeGetter<HTMLElement | undefined>, options: UseElementSizeOptions = { box: "border-box" }) {
		this.#size = {
			width: options.initialSize?.width ?? 0,
			height: options.initialSize?.height ?? 0,
		}

		$effect(() => {
			const node$ = get(node)
			if (!node$) return;

			const observer = new ResizeObserver((entries) => {
				for (const entry of entries) {
					const boxSize = options.box === "content-box" ? entry.contentBoxSize : entry.borderBoxSize;
					const boxSizeArr = Array.isArray(boxSize) ? boxSize : [boxSize];
					this.#size.width = boxSizeArr.reduce((acc, size) => Math.max(acc, size.inlineSize), 0);
					this.#size.height = boxSizeArr.reduce((acc, size) => Math.max(acc, size.blockSize), 0);
				}
			});
			observer.observe(node$);

			return () => {
				observer.disconnect();
			};
		})
	}

	get width() {
		return this.#size.width
	}

	get height() {
		return this.#size.height
	}
}
