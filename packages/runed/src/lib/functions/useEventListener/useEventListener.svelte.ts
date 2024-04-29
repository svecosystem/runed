import { box } from "../box/box.svelte.js";
import type { MaybeBoxOrGetter } from "$lib/internal/types.js";
import { addEventListener } from "$lib/internal/utils/event.js";

/**
 * Adds an event listener to the specified target element for the given event(s), and returns a function to remove it.
 * @param target The target element to add the event listener to.
 * @param event The event(s) to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 * 
 * @see {@link https://runed.dev/docs/functions/use-event-listener}
 */
export function useEventListener<TEvent extends keyof WindowEventMap>(
	target: MaybeBoxOrGetter<Window | null | undefined>,
	event: TEvent | TEvent[],
	handler: (this: Window, event: WindowEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<TEvent extends keyof DocumentEventMap>(
	target: MaybeBoxOrGetter<Document | null | undefined>,
	event: TEvent | TEvent[],
	handler: (this: Document, event: DocumentEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions
): void;

/**
 * Adds an event listener to the specified target element for the given event(s), and returns a function to remove it.
 * @param target The target element to add the event listener to.
 * @param event The event(s) to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 * 
 * @see {@link https://runed.dev/docs/functions/use-event-listener}
 */
export function useEventListener<
	TElement extends HTMLElement,
	TEvent extends keyof HTMLElementEventMap,
>(
	target: MaybeBoxOrGetter<TElement | null | undefined>,
	event: TEvent | TEvent[],
	handler: (this: TElement, event: HTMLElementEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions
): void;

/**
 * Adds an event listener to the specified target element for the given event(s), and returns a function to remove it.
 * @param target The target element to add the event listener to.
 * @param event The event(s) to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 * 
 * @see {@link https://runed.dev/docs/functions/use-event-listener}
 */
export function useEventListener(
	target: MaybeBoxOrGetter<EventTarget | null | undefined>,
	event: string | string[],
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
): void;

export function useEventListener(
	_target: MaybeBoxOrGetter<EventTarget | null | undefined>,
	event: string | string[],
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
): void {
	const target = box.from(_target);

	$effect(() => {
		if (target.value === undefined || target.value === null) return;
		return addEventListener(target.value, event, handler, options);
	});
}
