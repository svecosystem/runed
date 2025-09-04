import { extract } from "../extract/extract.svelte.js";
import type { MaybeGetter } from "$lib/internal/types.js";
import { on } from "svelte/events";
import type { EventHandler } from "svelte/elements";

/**
 * Adds an event listener to the specified target element for the given event(s), and returns a function to remove it.
 * @param target The target element to add the event listener to.
 * @param event The event(s) to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 *
 * @see {@link https://runed.dev/docs/utilities/use-event-listener}
 */
export function useEventListener<TEvent extends keyof WindowEventMap>(
	target: MaybeGetter<Window | null | undefined>,
	event: MaybeGetter<TEvent | TEvent[]>,
	handler: EventHandler<WindowEventMap[TEvent], Window>,
	options?: AddEventListenerOptions
): void;

/**
 * Adds an event listener to the specified target element for the given event(s), and returns a function to remove it.
 * @param target The target element to add the event listener to.
 * @param event The event(s) to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 *
 * @see {@link https://runed.dev/docs/utilities/use-event-listener}
 */
export function useEventListener<TEvent extends keyof DocumentEventMap>(
	target: MaybeGetter<Document | null | undefined>,
	event: MaybeGetter<TEvent | TEvent[]>,
	handler: EventHandler<DocumentEventMap[TEvent], Document>,
	options?: AddEventListenerOptions
): void;

/**
 * Adds an event listener to the specified target element for the given event(s), and returns a function to remove it.
 * @param target The target element to add the event listener to.
 * @param event The event(s) to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 *
 * @see {@link https://runed.dev/docs/utilities/use-event-listener}
 */
export function useEventListener<
	TElement extends HTMLElement,
	TEvent extends keyof HTMLElementEventMap,
>(
	target: MaybeGetter<TElement | null | undefined>,
	event: MaybeGetter<TEvent | TEvent[]>,
	handler: EventHandler<HTMLElementEventMap[TEvent], TElement>,
	options?: AddEventListenerOptions
): void;

/**
 * Adds an event listener to the specified target element for the given event(s), and returns a function to remove it.
 * @param target The target element to add the event listener to.
 * @param event The event(s) to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 *
 * @see {@link https://runed.dev/docs/utilities/use-event-listener}
 */
export function useEventListener<TEvent extends keyof MediaQueryListEventMap>(
	target: MaybeGetter<MediaQueryList | null | undefined>,
	event: MaybeGetter<TEvent | TEvent[]>,
	handler: EventHandler<MediaQueryListEventMap[TEvent], MediaQueryList>,
	options?: AddEventListenerOptions
): void;

/**
 * Adds an event listener to the specified target element for the given event(s), and returns a function to remove it.
 * @param target The target element to add the event listener to.
 * @param event The event(s) to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 *
 * @see {@link https://runed.dev/docs/utilities/use-event-listener}
 */
export function useEventListener(
	target: MaybeGetter<EventTarget | null | undefined>,
	event: MaybeGetter<string | string[]>,
	handler: EventListener,
	options?: AddEventListenerOptions
): void;

export function useEventListener(
	_target: MaybeGetter<EventTarget | null | undefined>,
	_events: MaybeGetter<string | string[]>,
	handler: EventListener,
	options?: AddEventListenerOptions
): void {
	$effect(() => {
		const target = extract(_target);
		if (target == null) return;

		const events = extract(_events);
		if (Array.isArray(events)) {
			for (const event of events) {
				$effect(() => on(target, event, handler, options));
			}
		} else {
			return on(target, events, handler, options);
		}
	});
}
