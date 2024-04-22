import type { ValueOrGetter } from "$lib/internal/types.js";
import { boxed } from "$lib/internal/utils/boxed.svelte.js";
import { addEventListener } from "$lib/internal/utils/event.js";

export function useEventListener<TEvent extends keyof WindowEventMap>(
	target: ValueOrGetter<Window | null | undefined>,
	event: TEvent,
	handler: (this: Window, event: WindowEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<TEvent extends keyof DocumentEventMap>(
	target: ValueOrGetter<Document | null | undefined>,
	event: TEvent,
	handler: (this: Document, event: DocumentEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<
	TElement extends HTMLElement,
	TEvent extends keyof HTMLElementEventMap,
>(
	target: ValueOrGetter<TElement | null | undefined>,
	event: TEvent,
	handler: (this: TElement, event: HTMLElementEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions
): void;

export function useEventListener(
	target: ValueOrGetter<EventTarget | null | undefined>,
	event: string,
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
): void;

export function useEventListener(
	_target: ValueOrGetter<EventTarget | null | undefined>,
	event: string,
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
) {
	const target = boxed(_target);

	$effect(() => {
		if (target.value === undefined || target.value === null) return;
		return addEventListener(target.value, event, handler, options)
	});
} 
