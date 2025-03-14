import type { Getter } from "$lib/internal/types.js";
import { useResizeObserver, watch } from "runed";
import { tick } from "svelte";
import { extract } from "$lib/utilities/extract/index.js";

export interface TextareaAutosizeOptions {
	/** Textarea element to autosize. */
	element: Getter<HTMLElement | undefined>;
	/** Textarea content. */
	input: Getter<string>;
	/** Function called when the textarea size changes. */
	onResize?: () => void;
	/**
	 * Specify the style property that will be used to manipulate height. Can be `height | minHeight`.
	 * @default `height`
	 **/
	styleProp?: "height" | "minHeight";
}

export class TextareaAutosize {
	#options: TextareaAutosizeOptions;
	element = $derived.by(() => extract(this.#options.element));
	input = $derived.by(() => extract(this.#options.input));
	styleProp = $derived.by(() => extract(this.#options.styleProp, "height"));

	textareaScrollHeight = $state(1);
	textareaOldWidth = $state(0);

	constructor(options: TextareaAutosizeOptions) {
		this.#options = options;

		watch([() => this.input, () => this.element], () => {
			tick().then(() => this.triggerResize());
		});

		watch(
			() => this.textareaScrollHeight,
			() => options?.onResize?.()
		);

		useResizeObserver(
			() => this.element,
			([entry]) => {
				if (!entry) return;
				const { contentRect } = entry;
				if (this.textareaOldWidth === contentRect.width) return;

				requestAnimationFrame(() => {
					this.textareaOldWidth = contentRect.width;
					this.triggerResize();
				});
			}
		);
	}

	triggerResize = () => {
		if (!this.element) return;

		let height = "";

		this.element.style[this.styleProp] = "1px";
		this.textareaScrollHeight = this.element?.scrollHeight;
		height = `${this.textareaScrollHeight}px`;

		this.element.style[this.styleProp] = height;
	};
}
