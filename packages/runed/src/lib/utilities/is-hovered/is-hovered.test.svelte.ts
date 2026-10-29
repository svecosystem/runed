import { describe, expect, vi, beforeEach, afterEach } from "vitest";
import { tick } from "svelte";
import { IsHovered } from "./is-hovered.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

describe("IsHovered", () => {
	let container: HTMLDivElement;

	beforeEach(() => {
		container = document.createElement("div");
		document.body.appendChild(container);
	});

	afterEach(() => {
		container.remove();
	});

	class MockPointerEvent extends Event {
		pointerType: string;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		constructor(type: string, options: any = {}) {
			super(type, { bubbles: true, ...options });
			this.pointerType = options.pointerType ?? "mouse";
		}
	}

	const PointerEventMock =
		globalThis.PointerEvent ?? (MockPointerEvent as unknown as typeof globalThis.PointerEvent);
	vi.stubGlobal("PointerEvent", PointerEventMock);

	const createPointerEvent = (type: string, options: Partial<PointerEventInit> = {}) => {
		return new PointerEventMock(type, {
			bubbles: true,
			cancelable: true,
			pointerType: "mouse",
			...options,
		});
	};

	testWithEffect("should be false initially", () => {
		const hovered = new IsHovered();
		expect(hovered.current).toBe(false);
	});

	testWithEffect("should be true when pointer enters", async () => {
		const hovered = new IsHovered();
		hovered.attach(container);
		await tick();

		container.dispatchEvent(createPointerEvent("pointerenter"));
		expect(hovered.current).toBe(true);
	});

	testWithEffect("should be false when pointer leaves", async () => {
		const hovered = new IsHovered();
		hovered.attach(container);
		await tick();

		container.dispatchEvent(createPointerEvent("pointerenter"));
		expect(hovered.current).toBe(true);

		container.dispatchEvent(createPointerEvent("pointerleave"));
		expect(hovered.current).toBe(false);
	});

	testWithEffect("should respect isDisabled", async () => {
		let isDisabled = $state(false);
		const hovered = new IsHovered({ isDisabled: () => isDisabled });
		hovered.attach(container);
		await tick();

		container.dispatchEvent(createPointerEvent("pointerenter"));
		expect(hovered.current).toBe(true);

		isDisabled = true;
		await tick();
		expect(hovered.current).toBe(false);

		container.dispatchEvent(createPointerEvent("pointerenter"));
		expect(hovered.current).toBe(false);
	});

	testWithEffect("should call callbacks", async () => {
		const onHoverStart = vi.fn();
		const onHoverEnd = vi.fn();
		const onHoverChange = vi.fn();

		const hovered = new IsHovered({ onHoverStart, onHoverEnd, onHoverChange });
		hovered.attach(container);
		await tick();

		container.dispatchEvent(createPointerEvent("pointerenter"));
		expect(onHoverStart).toHaveBeenCalledOnce();
		expect(onHoverChange).toHaveBeenCalledWith(true);

		container.dispatchEvent(createPointerEvent("pointerleave"));
		expect(onHoverEnd).toHaveBeenCalledOnce();
		expect(onHoverChange).toHaveBeenCalledWith(false);
	});
});
