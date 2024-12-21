import { describe, expect, vi, beforeEach, afterEach } from "vitest";
import { tick } from "svelte";
import { onClickOutside } from "./onClickOutside.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

describe("onClickOutside", () => {
	let container: HTMLDivElement;
	let innerButton: HTMLButtonElement;
	let outsideButton: HTMLButtonElement;
	let callbackFn: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		container = document.createElement("div");
		innerButton = document.createElement("button");
		outsideButton = document.createElement("button");

		document.body.appendChild(container);
		document.body.appendChild(outsideButton);
		container.appendChild(innerButton);

		// we need to mock getBoundingClientRect
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
		vi.clearAllMocks();
	});

	const createMouseEvent = (x: number, y: number) =>
		new MouseEvent("click", {
			bubbles: true,
			clientX: x,
			clientY: y,
		});

	testWithEffect("calls callback on click outside container", async () => {
		onClickOutside(() => container, callbackFn);
		await tick();

		outsideButton.dispatchEvent(createMouseEvent(10, 10));
		expect(callbackFn).toHaveBeenCalledOnce();
	});

	testWithEffect("doesn't call callback on click inside container", async () => {
		onClickOutside(() => container, callbackFn);
		await tick();

		innerButton.dispatchEvent(createMouseEvent(75, 75));
		expect(callbackFn).not.toHaveBeenCalled();

		container.dispatchEvent(createMouseEvent(60, 60));
		expect(callbackFn).not.toHaveBeenCalled();
	});

	testWithEffect("handles edge cases of container boundaries", async () => {
		onClickOutside(() => container, callbackFn);
		await tick();

		// Click exactly on boundaries
		outsideButton.dispatchEvent(createMouseEvent(50, 50)); // Top-left corner
		expect(callbackFn).not.toHaveBeenCalled();

		outsideButton.dispatchEvent(createMouseEvent(150, 150)); // Bottom-right corner
		expect(callbackFn).not.toHaveBeenCalled();

		// Click just outside boundaries
		outsideButton.dispatchEvent(createMouseEvent(49, 50));
		expect(callbackFn).toHaveBeenCalledTimes(1);

		outsideButton.dispatchEvent(createMouseEvent(151, 150));
		expect(callbackFn).toHaveBeenCalledTimes(2);
	});

	testWithEffect("handles null container gracefully", async () => {
		onClickOutside(() => null, callbackFn);
		await tick();

		outsideButton.dispatchEvent(createMouseEvent(0, 0));
		expect(callbackFn).not.toHaveBeenCalled();
	});

	testWithEffect("handles clicks when target is null", async () => {
		onClickOutside(() => container, callbackFn);
		await tick();

		// Simulate a click event with null target
		const nullTargetEvent = new MouseEvent("click", {
			bubbles: true,
			clientX: 0,
			clientY: 0,
		});
		Object.defineProperty(nullTargetEvent, "target", { value: null });

		document.dispatchEvent(nullTargetEvent);
		expect(callbackFn).not.toHaveBeenCalled();
	});
});
