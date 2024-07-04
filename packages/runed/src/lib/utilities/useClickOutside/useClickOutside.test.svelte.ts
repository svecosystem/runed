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

		const callbackFn = vi.fn();

		useClickOutside(() => container, callbackFn);
		await tick();

		button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(callbackFn).toHaveBeenCalledOnce();

		innerButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(callbackFn).toHaveBeenCalledOnce();

		container.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(callbackFn).toHaveBeenCalledOnce();
	});
});