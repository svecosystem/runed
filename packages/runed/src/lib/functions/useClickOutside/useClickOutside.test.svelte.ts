import { describe, expect, vi } from "vitest";
import { tick } from "svelte";
import { testWithEffect } from "$lib/test/util.svelte.js";
import { box } from "$lib/functions/box/box.svelte.js";
import { useClickOutside } from "./useClickOutside.svelte.js";

describe("useClickOutside", () => {
	testWithEffect("calls a given callback on an outside of container click", async () => {
		const container = document.createElement("div");
		const innerButton = document.createElement("button");
		const button = document.createElement("button");

		document.body.appendChild(container);
		document.body.appendChild(button);
		container.appendChild(innerButton);

		const callbackFn = vi.fn();

		useClickOutside(box.from(container), callbackFn);
		await tick();

		button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(callbackFn).toHaveBeenCalledOnce();

		innerButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(callbackFn).toHaveBeenCalledOnce();

		container.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(callbackFn).toHaveBeenCalledOnce();
	});

	testWithEffect("can be paused and resumed", async () => {
		const container = document.createElement("div");
		const button = document.createElement("button");

		document.body.appendChild(container);
		document.body.appendChild(button);

		const callbackFn = vi.fn();

		const clickOutside = useClickOutside(box.from(container), callbackFn);

		clickOutside.stop();
		await tick();

		button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(callbackFn).not.toHaveBeenCalled();

		clickOutside.start();
		await tick();

		button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(callbackFn).toHaveBeenCalledOnce();
	});
});
