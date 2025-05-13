import { defaultWindow, type ConfigurableWindow } from "$lib/internal/configurable-globals.js";
import type { MaybeElementGetter } from "$lib/internal/types.js";
import { get } from "$lib/internal/utils/get.js";
import { createSubscriber } from "svelte/reactivity";

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
	// no need to use `$state` here since we are using createSubscriber
	#size = {
		width: 0,
		height: 0,
	};

	#options: ElementSizeOptions;

	#node: MaybeElementGetter;

	#window: ElementSizeOptions["window"];

	// we use a derived here to extract the width so that if the width doesn't change we don't get a state update
	// which we would get if we would just use a getter since the version of the subscriber will be changing
	#width = $derived.by(() => {
		this.#subscribe?.();
		return this.#size.width;
	});

	// we use a derived here to extract the height so that if the height doesn't change we don't get a state update
	// which we would get if we would just use a getter since the version of the subscriber will be changing
	#height = $derived.by(() => {
		this.#subscribe?.();
		return this.#size.height;
	});

	// we need to use a derived here because the class will be created before the node is bound to the ref
	#subscribe = $derived.by(() => {
		const node$ = get(this.#node);
		if (!node$) return;
		return createSubscriber((update) => {
			if (!this.#window) return;
			const observer = new this.#window.ResizeObserver((entries) => {
				for (const entry of entries) {
					const boxSize =
						this.#options.box === "content-box" ? entry.contentBoxSize : entry.borderBoxSize;
					const boxSizeArr = Array.isArray(boxSize) ? boxSize : [boxSize];
					this.#size.width = boxSizeArr.reduce((acc, size) => Math.max(acc, size.inlineSize), 0);
					this.#size.height = boxSizeArr.reduce((acc, size) => Math.max(acc, size.blockSize), 0);
				}
				update();
			});
			observer.observe(node$);

			return () => {
				observer.disconnect();
			};
		});
	});

	constructor(node: MaybeElementGetter, options: ElementSizeOptions = { box: "border-box" }) {
		this.#window = options.window ?? defaultWindow;
		this.#options = options;
		this.#node = node;

		this.#size = {
			width: options.initialSize?.width ?? 0,
			height: options.initialSize?.height ?? 0,
		};
	}

	get current(): { width: number; height: number } {
		this.#subscribe?.();
		return this.#size;
	}

	get width(): number {
		return this.#width;
	}

	get height(): number {
		return this.#height;
	}
}
