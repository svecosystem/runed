import { describe, expect, vi, beforeEach, afterEach } from "vitest";
import { tick } from "svelte";
import { onClickOutside } from "./onClickOutside.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

describe("onClickOutside", () => {
	let container: HTMLDivElement;
	let innerButton: HTMLButtonElement;
	let outsideButton: HTMLButtonElement;
	let callbackFn: ReturnType<typeof vi.fn>;

	class MockPointerEvent extends Event {
		clientX: number;
		clientY: number;
		pointerType: string;
		button: number;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		constructor(type: string, options: any = {}) {
			super(type, { bubbles: true, ...options });
			this.clientX = options.clientX ?? 0;
			this.clientY = options.clientY ?? 0;
			this.pointerType = options.pointerType ?? "mouse";
			this.button = options.button ?? 0;
		}
	}

	const PointerEvent = globalThis.PointerEvent ?? MockPointerEvent;

	beforeEach(() => {
		vi.useFakeTimers();

		container = document.createElement("div");
		innerButton = document.createElement("button");
		outsideButton = document.createElement("button");

		document.body.appendChild(container);
		document.body.appendChild(outsideButton);
		container.appendChild(innerButton);

		container.getBoundingClientRect = vi.fn(() => ({
			height: 100,
			width: 100,
			top: 50,
			left: 50,
			bottom: 150,
			right: 150,
			x: 50,
			y: 50,
			toJSON: vi.fn(),
		}));

		callbackFn = vi.fn();
	});

	afterEach(() => {
		document.body.removeChild(container);
		document.body.removeChild(outsideButton);
		// Remove any iframes that might have been added
		document.querySelectorAll("iframe").forEach((iframe) => iframe.remove());
		vi.clearAllMocks();
		vi.useRealTimers();
	});

	const createPointerEvent = (type: string, options: Partial<PointerEventInit> = {}) => {
		return new PointerEvent(type, {
			bubbles: true,
			cancelable: true,
			clientX: 10,
			clientY: 10,
			pointerType: "mouse",
			button: 0,
			...options,
		});
	};

	const advanceTimers = async () => {
		await vi.advanceTimersByTimeAsync(10); // Match the debounce time
		await tick();
	};

	testWithEffect("starts enabled by default", async () => {
		onClickOutside(() => container, callbackFn);
		await tick();

		outsideButton.dispatchEvent(createPointerEvent("pointerdown"));
		await advanceTimers();

		expect(callbackFn).toHaveBeenCalledOnce();
	});

	testWithEffect("respects `immediate` option", async () => {
		const controls = onClickOutside(() => container, callbackFn, { immediate: false });
		await tick();

		outsideButton.dispatchEvent(createPointerEvent("pointerdown"));
		await advanceTimers();
		expect(callbackFn).not.toHaveBeenCalled();

		controls.start();
		await tick();

		outsideButton.dispatchEvent(createPointerEvent("pointerdown"));
		await advanceTimers();
		expect(callbackFn).toHaveBeenCalledOnce();
	});

	testWithEffect("handles touch events with click confirmation", async () => {
		onClickOutside(() => container, callbackFn);
		await tick();

		outsideButton.dispatchEvent(createPointerEvent("pointerdown", { pointerType: "touch" }));
		await advanceTimers();

		// Without the click event, callback shouldn't be called yet
		expect(callbackFn).not.toHaveBeenCalled();

		outsideButton.dispatchEvent(new Event("click", { bubbles: true }));
		await advanceTimers();

		expect(callbackFn).toHaveBeenCalledOnce();
	});

	testWithEffect("debounces rapid pointer events", async () => {
		onClickOutside(() => container, callbackFn);
		await tick();

		outsideButton.dispatchEvent(createPointerEvent("pointerdown"));
		outsideButton.dispatchEvent(createPointerEvent("pointerdown"));
		outsideButton.dispatchEvent(createPointerEvent("pointerdown"));

		await advanceTimers();

		// due to debouncing, should only be called once
		expect(callbackFn).toHaveBeenCalledOnce();
	});

	testWithEffect("can be stopped and started", async () => {
		const controls = onClickOutside(() => container, callbackFn);
		await tick();

		// Initial state (enabled)
		outsideButton.dispatchEvent(createPointerEvent("pointerdown"));
		await advanceTimers();
		expect(callbackFn).toHaveBeenCalledTimes(1);

		// Stop listening
		controls.stop();
		await tick();

		outsideButton.dispatchEvent(createPointerEvent("pointerdown"));
		await advanceTimers();
		expect(callbackFn).toHaveBeenCalledTimes(1);

		// Start listening again
		controls.start();
		await tick();

		outsideButton.dispatchEvent(createPointerEvent("pointerdown"));
		await advanceTimers();
		expect(callbackFn).toHaveBeenCalledTimes(2);
	});

	testWithEffect("respects button type in pointer events", async () => {
		onClickOutside(() => container, callbackFn);
		await tick();

		// Right click should be ignored
		outsideButton.dispatchEvent(createPointerEvent("pointerdown", { button: 2 }));
		await advanceTimers();
		expect(callbackFn).not.toHaveBeenCalled();

		// Left click should trigger callback
		outsideButton.dispatchEvent(createPointerEvent("pointerdown", { button: 0 }));
		await advanceTimers();
		expect(callbackFn).toHaveBeenCalledOnce();
	});

	testWithEffect("handles pointer down interception correctly", async () => {
		onClickOutside(() => container, callbackFn);
		await tick();

		// Simulate captured pointerdown (should be intercepted)
		container.dispatchEvent(
			createPointerEvent("pointerdown", {
				clientX: 75,
				clientY: 75,
			})
		);
		await advanceTimers();
		expect(callbackFn).not.toHaveBeenCalled();

		// Simulate non-intercepted pointerdown
		outsideButton.dispatchEvent(createPointerEvent("pointerdown"));
		await advanceTimers();
		expect(callbackFn).toHaveBeenCalledOnce();
	});

	testWithEffect("handles pseudo-element clicks outside element bounds", async () => {
		const dialog = document.createElement("dialog");
		document.body.appendChild(dialog);

		onClickOutside(() => dialog, callbackFn);
		await tick();

		dialog.getBoundingClientRect = vi.fn(() => ({
			height: 200,
			width: 200,
			top: 100,
			left: 100,
			bottom: 300,
			right: 300,
			x: 100,
			y: 100,
			toJSON: vi.fn(),
		}));

		// click inside dialog's actual bounds
		const insideDialogClick = createPointerEvent("pointerdown", {
			clientX: 150,
			clientY: 150,
		});
		Object.defineProperty(insideDialogClick, "target", { value: dialog });
		document.dispatchEvent(insideDialogClick);
		await advanceTimers();

		expect(callbackFn).not.toHaveBeenCalled();

		// click outside dialog's bounds but with dialog as target (simulating pseudo-element)
		const pseudoElementClick = createPointerEvent("pointerdown", {
			clientX: 400,
			clientY: 400,
		});
		Object.defineProperty(pseudoElementClick, "target", { value: dialog });
		document.dispatchEvent(pseudoElementClick);
		await advanceTimers();

		expect(callbackFn).toHaveBeenCalledOnce();

		dialog.remove();
	});

	testWithEffect("ignores iframe interactions by default (detectIframe: false)", async () => {
		let iframe = document.createElement("iframe");
		document.body.appendChild(iframe);

		onClickOutside(() => container, callbackFn);
		await tick();

		window.dispatchEvent(new Event("blur", { bubbles: true }));
		await tick();
		vi.spyOn(document, "activeElement", "get").mockReturnValue(iframe);
		await vi.runAllTimersAsync();

		expect(callbackFn).not.toHaveBeenCalled();

		document.body.removeChild(iframe);
		vi.restoreAllMocks();
	});

	testWithEffect("detects iframe interactions when detectIframe is true", async () => {
		let iframe = document.createElement("iframe");
		document.body.appendChild(iframe);

		onClickOutside(() => container, callbackFn, { detectIframe: true });
		await tick();

		window.dispatchEvent(new Event("blur", { bubbles: true }));
		await tick();
		vi.spyOn(document, "activeElement", "get").mockReturnValue(iframe);
		await vi.runAllTimersAsync();

		expect(callbackFn).toHaveBeenCalledOnce();

		document.body.removeChild(iframe);
		vi.restoreAllMocks();
	});
});
