import type { ResizeEvent } from "../types.js";

export const isBrowser = typeof document !== "undefined";

export function isHTMLElement(element: unknown): element is HTMLElement {
	return element instanceof HTMLElement;
}

export function isKeyDown(event: ResizeEvent): event is KeyboardEvent {
	return event.type === "keydown";
}

export function isMouseEvent(event: ResizeEvent): event is MouseEvent {
	return event.type.startsWith("mouse");
}

export function isTouchEvent(event: ResizeEvent): event is TouchEvent {
	return event.type.startsWith("touch");
}
