import { defaultWindow, type ConfigurableWindow } from "$lib/internal/configurable-globals.js";
import type { MaybeElementGetter } from "$lib/internal/types.js";
import { get } from "$lib/internal/utils/get.js";

export type ElementSizeOptions = ConfigurableWindow & {
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
 * @see {@link https://runed.dev/docs/utilities/element-size}
 */
export class ElementSize {
	#size = $state({
		width: 0,
		height: 0,
	});

	constructor(node: MaybeElementGetter, options: ElementSizeOptions = { box: "border-box" }) {
		const window = options.window ?? defaultWindow;

		this.#size = {
			width: options.initialSize?.width ?? 0,
			height: options.initialSize?.height ?? 0,
		};

		$effect(() => {
			if (!window) return;
			const node$ = get(node);
			if (!node$) return;

			const observer = new window.ResizeObserver((entries) => {
				for (const entry of entries) {
					const boxSize =
						options.box === "content-box" ? entry.contentBoxSize : entry.borderBoxSize;
					const boxSizeArr = Array.isArray(boxSize) ? boxSize : [boxSize];
					this.#size.width = boxSizeArr.reduce((acc, size) => Math.max(acc, size.inlineSize), 0);
					this.#size.height = boxSizeArr.reduce((acc, size) => Math.max(acc, size.blockSize), 0);
				}
			});
			observer.observe(node$);

			return () => {
				observer.disconnect();
			};
		});
	}

	get current(): { width: number; height: number } {
		return this.#size;
	}

	get width(): number {
		return this.#size.width;
	}

	get height(): number {
		return this.#size.height;
	}
}
