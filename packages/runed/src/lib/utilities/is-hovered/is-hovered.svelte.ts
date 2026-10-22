import { on } from "svelte/events";
import type { Attachment } from "svelte/attachments";
import { extract } from "../extract/extract.svelte.js";
import type { MaybeGetter } from "$lib/internal/types.js";
import { noop } from "$lib/internal/utils/function.js";

export type IsHoveredHandlers = {
	/** Callback when hover interaction starts */
	onHoverStart?: (e: IsHoveredEvent) => void;
	/** Callback when hover interaction ends */
	onHoverEnd?: (e: IsHoveredEvent) => void;
	/** Callback when hover state changes */
	onHoverChange?: (isHovered: boolean) => void;
};

export type IsHoveredOptions = IsHoveredHandlers & {
	/** Whether the hover events should be disabled */
	isDisabled?: MaybeGetter<boolean>;
};

export class IsHoveredEvent {
	type: "hoverstart" | "hoverend";
	pointerType: "mouse" | "pen";
	target: Element;

	constructor(type: "hoverstart" | "hoverend", pointerType: "mouse" | "pen", originalEvent: Event) {
		this.type = type;
		this.pointerType = pointerType;
		this.target = originalEvent.currentTarget as Element;
	}
}

// iOS fires onPointerEnter twice: once with pointerType="touch" and again with pointerType="mouse".
// We want to ignore these emulated events so they do not trigger hover behavior.
// See https://bugs.webkit.org/show_bug.cgi?id=214609
// As of 2024-01-08, this bug has been resolved at the end of 2022, however, we want
// to support older versions of iOS and revisit the necessity of this in the future
let globalIgnoreEmulatedMouseEvents = false;
let hoverCount = 0;

function setGlobalIgnoreEmulatedMouseEvents() {
	globalIgnoreEmulatedMouseEvents = true;

	// Clear globalIgnoreEmulatedMouseEvents after a short timeout. iOS fires onPointerEnter
	// with pointerType="mouse" immediately after onPointerUp and before onFocus. On other
	// devices that don't have this quirk, we don't want to ignore a mouse hover sometime in
	// the distant future because a user previously touched the element.
	setTimeout(() => {
		globalIgnoreEmulatedMouseEvents = false;
	}, 50);
}

function handleGlobalPointerEvent(e: PointerEvent) {
	if (e.pointerType === "touch") {
		setGlobalIgnoreEmulatedMouseEvents();
	}
}

function setupGlobalTouchEvents() {
	if (typeof document === "undefined") {
		return;
	}

	let unsubListener = noop;

	if (typeof PointerEvent !== "undefined") {
		unsubListener = on(document, "pointerup", handleGlobalPointerEvent as EventListener);
	} else {
		unsubListener = on(document, "touchend", setGlobalIgnoreEmulatedMouseEvents as EventListener);
	}

	hoverCount++;
	return () => {
		hoverCount--;
		if (hoverCount > 0) {
			return;
		}

		unsubListener();
	};
}

/**
 * Handles pointer hover interactions for an element. Normalizes behavior
 * across browsers and platforms, and ignores emulated mouse events on touch devices.
 *
 * @see {@link https://runed.dev/docs/utilities/is-hovered}
 */
export class IsHovered {
	#current = $state(false);
	#options: IsHoveredOptions;
	#ignoreEmulatedMouseEvents = false;

	constructor(options: IsHoveredOptions = {}) {
		this.#options = options;

		$effect(() => {
			const isDisabled = extract(this.#options.isDisabled) ?? false;
			if (isDisabled && this.#current) {
				this.#current = false;
				this.#options.onHoverChange?.(false);
			}
		});
	}

	get current(): boolean {
		return this.#current;
	}

	#triggerHoverStart(originalEvent: MouseEvent | PointerEvent, pointerType: "mouse" | "pen") {
		const isDisabled = extract(this.#options.isDisabled) ?? false;
		if (isDisabled || this.#current) return;

		this.#current = true;
		const event = new IsHoveredEvent("hoverstart", pointerType, originalEvent);

		this.#options.onHoverStart?.(event);
		this.#options.onHoverChange?.(true);
	}

	#triggerHoverEnd(originalEvent: MouseEvent | PointerEvent, pointerType: "mouse" | "pen") {
		if (!this.#current) return;
		this.#current = false;
		const event = new IsHoveredEvent("hoverend", pointerType, originalEvent);

		this.#options.onHoverEnd?.(event);
		this.#options.onHoverChange?.(false);
	}

	readonly attach: Attachment<HTMLElement | SVGElement> = (node) => {
		const cleanupGlobal = setupGlobalTouchEvents();

		let unsub: () => void;

		if (typeof PointerEvent !== "undefined") {
			const unsubEnter = on(node, "pointerenter", ((e: PointerEvent) => {
				if (
					e.pointerType === "touch" ||
					(globalIgnoreEmulatedMouseEvents && e.pointerType === "mouse")
				)
					return;
				this.#triggerHoverStart(e, e.pointerType as "mouse" | "pen");
			}) as EventListener);
			const unsubLeave = on(node, "pointerleave", ((e: PointerEvent) => {
				if (e.pointerType === "touch") return;
				this.#triggerHoverEnd(e, e.pointerType as "mouse" | "pen");
			}) as EventListener);
			unsub = () => {
				unsubEnter();
				unsubLeave();
			};
		} else {
			const unsubTouch = on(node, "touchstart", () => {
				this.#ignoreEmulatedMouseEvents = true;
			});
			const unsubEnter = on(node, "mouseenter", ((e: MouseEvent) => {
				if (!this.#ignoreEmulatedMouseEvents && !globalIgnoreEmulatedMouseEvents) {
					this.#triggerHoverStart(e, "mouse");
				}
				this.#ignoreEmulatedMouseEvents = false;
			}) as EventListener);
			const unsubLeave = on(node, "mouseleave", ((e: MouseEvent) => {
				this.#triggerHoverEnd(e, "mouse");
			}) as EventListener);
			unsub = () => {
				unsubTouch();
				unsubEnter();
				unsubLeave();
			};
		}

		return () => {
			unsub();
			cleanupGlobal?.();
			if (this.#current) {
				this.#current = false;
				this.#options.onHoverChange?.(false);
			}
		};
	};
}
