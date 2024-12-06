import { extract } from "../extract/extract.svelte.js";
import type { GlobalWindow, MaybeGetter } from "$lib/internal/types.js";
import { defaultWindow, type ConfigurableWindow } from "$lib/internal/configurable-globals.js";

export interface ResizeObserverSize {
	readonly inlineSize: number;
	readonly blockSize: number;
}

export interface ResizeObserverEntry {
	readonly target: Element;
	readonly contentRect: DOMRectReadOnly;
	readonly borderBoxSize?: ReadonlyArray<ResizeObserverSize>;
	readonly contentBoxSize?: ReadonlyArray<ResizeObserverSize>;
	readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>;
}

export type ResizeObserverCallback = (
	entries: ReadonlyArray<ResizeObserverEntry>,
	observer: ResizeObserver
) => void;

export interface UseResizeObserverOptions extends ConfigurableWindow {
	/**
	 * Sets which box model the observer will observe changes to. Possible values
	 * are `content-box` (the default), `border-box` and `device-pixel-content-box`.
	 *
	 * @default 'content-box'
	 */
	box?: ResizeObserverBoxOptions;
}

declare class ResizeObserver {
	constructor(callback: ResizeObserverCallback);
	disconnect(): void;
	observe(target: Element, options?: UseResizeObserverOptions): void;
	unobserve(target: Element): void;
}

/**
 * Reports changes to the dimensions of an Element's content or the border-box
 *
 * @see https://runed.dev/docs/utilities/useResizeObserver
 */
export function useResizeObserver(
	target: MaybeGetter<HTMLElement | HTMLElement[] | null | undefined>,
	callback: ResizeObserverCallback,
	options: UseResizeObserverOptions = {}
) {
	const { window = defaultWindow } = options;
	let observer: ResizeObserver | undefined;

	const targets = $derived.by(() => {
		const value = extract(target);
		return new Set(value ? (Array.isArray(value) ? value : [value]) : []);
	});

	const stop = $effect.root(() => {
		$effect(() => {
			if (!targets.size || !window || !("ResizeObserver" in window)) return;
			observer = new (window as GlobalWindow).ResizeObserver(callback);
			for (const el of targets) observer.observe(el, options);

			return () => {
				observer?.disconnect();
				observer = undefined;
			};
		});
	});

	$effect(() => {
		return stop;
	});

	return {
		stop,
	};
}

export type UseResizeObserverReturn = ReturnType<typeof useResizeObserver>;
