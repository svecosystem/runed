import { box } from "../box/box.svelte.js";
import type { MaybeBoxOrGetter } from "$lib/internal/types.js";
import { addEventListener } from "$lib/internal/utils/event.js";
;

export function useEventListener<TEvent extends keyof WindowEventMap>(
	target: MaybeBoxOrGetter<Window | null | undefined>,
	event: TEvent,
	handler: (this: Window, event: WindowEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<TEvent extends keyof DocumentEventMap>(
	target: MaybeBoxOrGetter<Document | null | undefined>,
	event: TEvent,
	handler: (this: Document, event: DocumentEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<
	TElement extends HTMLElement,
	TEvent extends keyof HTMLElementEventMap,
>(
	target: MaybeBoxOrGetter<TElement | null | undefined>,
	event: TEvent,
	handler: (this: TElement, event: HTMLElementEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions
): void;

export function useEventListener(
	target: MaybeBoxOrGetter<EventTarget | null | undefined>,
	event: string,
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
): void;

export function useEventListener(
	_target: MaybeBoxOrGetter<EventTarget | null | undefined>,
	event: string,
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
) {
	const target = box.from(_target);

	$effect(() => {
		if (target.value === undefined || target.value === null) return;
		return addEventListener(target.value, event, handler, options);
	});
}
