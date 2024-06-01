import { IsSupported } from "../IsSupported/IsSupported.svelte.js";
import { extract } from "../extract/extract.js";
import { watch } from "../watch/watch.svelte.js";
import { safelyCleanup } from "$lib/internal/utils/effect.svelte.js";
import type { MaybeGetter } from "$lib/internal/types.js";

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

export interface UseResizeObserverOptions {
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
	let observer: ResizeObserver | undefined;
	const isSupported = new IsSupported(() => window && "ResizeObserver" in window);

	const cleanup = () => {
		if (observer) {
			observer.disconnect();
			observer = undefined;
		}
	};

	const targets = $derived.by(() => {
		const value = extract(target);
		const items =
			value === null || value === undefined ? [] : Array.isArray(value) ? value : [value];
		return new Set(items);
	});

	const stopWatch = watch(
		() => targets,
		(els) => {
			cleanup();
			if (isSupported.current && window) {
				observer = new ResizeObserver(callback);
				for (const _el of els) _el && observer!.observe(_el, options);
			}
		}
	);

	const stop = () => {
		cleanup();
		stopWatch();
	};

	safelyCleanup(stop);

	return {
		isSupported,
		stop,
	};
}

export type UseResizeObserverReturn = ReturnType<typeof useResizeObserver>;
