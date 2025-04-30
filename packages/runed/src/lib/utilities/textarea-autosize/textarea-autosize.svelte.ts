import type { Getter } from "$lib/internal/types.js";
import { useResizeObserver, watch } from "runed";
import { tick } from "svelte";
import { extract } from "$lib/utilities/extract/index.js";

const stylesToCopy = [
	"box-sizing",
	"width",
	"padding-top",
	"padding-right",
	"padding-bottom",
	"padding-left",
	"border-top-width",
	"border-right-width",
	"border-bottom-width",
	"border-left-width",
	"font-family",
	"font-size",
	"font-weight",
	"font-style",
	"letter-spacing",
	"text-indent",
	"text-transform",
	"line-height",
	"word-spacing",
	"word-wrap",
	"word-break",
	"white-space",
];

export interface TextareaAutosizeOptions {
	/**
	 * The textarea element to autosize.
	 */
	element: Getter<HTMLElement | undefined>;

	/**
	 * The current text value of the textarea.
	 * Should be reactive.
	 */
	input: Getter<string>;

	/**
	 * Callback triggered whenever the textarea resizes.
	 */
	onResize?: () => void;

	/**
	 * Style property to update during resize. Defaults to `"height"`.
	 * Use `"minHeight"` to allow natural expansion without shrinking.
	 *
	 * @default "height"
	 */
	styleProp?: "height" | "minHeight";

	/**
	 * Optional maximum height in pixels. If exceeded, scrolling is enabled.
	 *
	 * @default undefined (no limit)
	 */
	maxHeight?: number;
}

/**
 * Automatically resizes a textarea element based on its content and width.
 *
 * Uses a hidden clone for accurate measurements without layout shift.
 * Reactively updates when the input or element changes, or when the
 * element is resized.
 */
export class TextareaAutosize {
	#options: TextareaAutosizeOptions;
	#resizeTimeout: number | null = null;
	#hiddenTextarea: HTMLTextAreaElement | null = null;

	element = $derived.by(() => extract(this.#options.element));
	input = $derived.by(() => extract(this.#options.input));
	styleProp = $derived.by(() => extract(this.#options.styleProp, "height"));
	maxHeight = $derived.by(() => extract(this.#options.maxHeight, undefined));
	textareaHeight = $state(0);
	textareaOldWidth = $state(0);

	constructor(options: TextareaAutosizeOptions) {
		this.#options = options;

		// Create hidden textarea for measurements
		this.#createHiddenTextarea();

		watch([() => this.input, () => this.element], () => {
			tick().then(() => this.triggerResize());
		});

		watch(
			() => this.textareaHeight,
			() => options?.onResize?.()
		);

		useResizeObserver(
			() => this.element,
			([entry]) => {
				if (!entry) return;
				const { contentRect } = entry;
				if (this.textareaOldWidth === contentRect.width) return;

				this.textareaOldWidth = contentRect.width;
				this.triggerResize();
			}
		);

		$effect(() => {
			return () => {
				// Clean up
				if (this.#hiddenTextarea) {
					this.#hiddenTextarea.remove();
					this.#hiddenTextarea = null;
				}

				if (this.#resizeTimeout) {
					window.cancelAnimationFrame(this.#resizeTimeout);
					this.#resizeTimeout = null;
				}
			};
		});
	}
	// Copy all the styles that affect text layout

	#createHiddenTextarea() {
		// Create a hidden textarea that will be used for measurements
		// This avoids layout shifts caused by manipulating the actual textarea
		if (typeof window === "undefined") return;

		this.#hiddenTextarea = document.createElement("textarea");
		const style = this.#hiddenTextarea.style;

		// Make it invisible but keep same text layout properties
		style.visibility = "hidden";
		style.position = "absolute";
		style.overflow = "hidden";
		style.height = "0";
		style.top = "0";
		style.left = "-9999px";

		document.body.appendChild(this.#hiddenTextarea);
	}

	#copyStyles() {
		if (!this.element || !this.#hiddenTextarea) return;

		const computed = window.getComputedStyle(this.element);

		for (const style of stylesToCopy) {
			this.#hiddenTextarea!.style.setProperty(style, computed.getPropertyValue(style));
		}

		// Ensure the width matches exactly
		this.#hiddenTextarea.style.width = `${this.element.clientWidth}px`;
	}

	/**
	 * Recomputes the required height based on current content and applies it
	 * to the textarea. If `maxHeight` is exceeded, vertical scrolling is enabled.
	 */
	triggerResize = () => {
		if (!this.element || !this.#hiddenTextarea) return;

		// Copy current styles and content to hidden textarea
		this.#copyStyles();
		this.#hiddenTextarea.value = this.input || "";

		// Measure the hidden textarea
		const scrollHeight = this.#hiddenTextarea.scrollHeight;

		// Apply the height, respecting maxHeight if set
		let newHeight = scrollHeight;
		if (this.maxHeight && newHeight > this.maxHeight) {
			newHeight = this.maxHeight;
			this.element.style.overflowY = "auto";
		} else {
			this.element.style.overflowY = "hidden";
		}

		// Only update if height actually changed
		if (this.textareaHeight !== newHeight) {
			this.textareaHeight = newHeight;
			this.element.style[this.styleProp] = `${newHeight}px`;
		}
	};
}
