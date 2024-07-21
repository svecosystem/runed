import { describe, expect, vi } from "vitest";
import { tick } from "svelte";
import { useClickOutside } from "./useClickOutside.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

describe("useClickOutside", () => {
	testWithEffect("calls a given callback on an outside of container click", async () => {
		const container = document.createElement("div");
		const innerButton = document.createElement("button");
		const button = document.createElement("button");

		document.body.appendChild(container);
		document.body.appendChild(button);
		container.appendChild(innerButton);

		container.getBoundingClientRect = vi.fn(() => ({
			height: 100,
			width: 100,
			top: 50,
			left: 50,
			bottom: 0,
			right: 0,
			x: 50,
			y: 50,
			toJSON: vi.fn()
		}))

		const callbackFn = vi.fn();

		useClickOutside(() => container, callbackFn);
		await tick();

		button.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: 10, clientY: 10 }));
		expect(callbackFn).toHaveBeenCalledOnce();

		innerButton.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: 100, clientY: 100 }));
		expect(callbackFn).toHaveBeenCalledOnce();

		container.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: 50, clientY: 50 }));
		expect(callbackFn).toHaveBeenCalledOnce();
	});
});
