/**
 *  Overloaded function signatures for addEventListener
 */
export function addEventListener<TEvent extends keyof WindowEventMap>(
	target: Window,
	event: TEvent,
	handler: (this: Window, event: WindowEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions
): VoidFunction;

export function addEventListener<TEvent extends keyof DocumentEventMap>(
	target: Document,
	event: TEvent,
	handler: (this: Document, event: DocumentEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions
): VoidFunction;

export function addEventListener<
	TElement extends HTMLElement,
	TEvent extends keyof HTMLElementEventMap,
>(
	target: TElement,
	event: TEvent,
	handler: (this: TElement, event: HTMLElementEventMap[TEvent]) => unknown,
	options?: boolean | AddEventListenerOptions
): VoidFunction;

export function addEventListener(
	target: EventTarget,
	event: string,
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
): VoidFunction;

/**
 * Adds an event listener to the specified target element for the given event, and returns a function to remove it.
 * @param target The target element to add the event listener to.
 * @param event The event to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 * @returns A function that removes the event listener from the target element.
 */
export function addEventListener(
	target: EventTarget,
	event: string,
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
) {
	// Add the event listener to each specified event for the target element.
	target.addEventListener(event, handler, options);

	// Return a function that removes the event listener from the target element(s).
	return () => {
		target.removeEventListener(event, handler, options);
	};
}
