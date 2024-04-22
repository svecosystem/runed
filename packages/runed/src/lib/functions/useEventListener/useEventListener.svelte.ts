import { addEventListener } from "$lib/internal/utils/event.js";
import { type ValueOrReadonlyBox, readonlyBox } from "$lib/index.js";

export function useEventListener<TEvent extends keyof WindowEventMap>(
	target: ValueOrReadonlyBox<Window | null | undefined>,
	event: TEvent,
	handler: (this: Window, event: WindowEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<TEvent extends keyof DocumentEventMap>(
	target: ValueOrReadonlyBox<Document | null | undefined>,
	event: TEvent,
	handler: (this: Document, event: DocumentEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<
	TElement extends HTMLElement,
	TEvent extends keyof HTMLElementEventMap,
>(
	target: ValueOrReadonlyBox<TElement | null | undefined>,
	event: TEvent,
	handler: (this: TElement, event: HTMLElementEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions
): void;

export function useEventListener(
	target: ValueOrReadonlyBox<EventTarget | null | undefined>,
	event: string,
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
): void;

export function useEventListener(
	_target: ValueOrReadonlyBox<EventTarget | null | undefined>,
	event: string,
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
) {
	const target = readonlyBox(_target);

	$effect(() => {
		if (target.value === undefined || target.value === null) return;
		return addEventListener(target.value, event, handler, options);
	});
}
