import { describe, expect, beforeEach, afterEach } from "vitest";
import { flushSync } from "svelte";
import { useMousePosition } from "./use-mouse-position.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

// jsdom doesn't provide PointerEvent — same mock pattern as onClickOutside tests.
class MockPointerEvent extends Event {
	clientX: number;
	clientY: number;
	pointerType: string;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(type: string, options: any = {}) {
		super(type, { bubbles: true, ...options });
		this.clientX = options.clientX ?? 0;
		this.clientY = options.clientY ?? 0;
		this.pointerType = options.pointerType ?? "mouse";
	}
}

const PointerEvent = globalThis.PointerEvent ?? MockPointerEvent;

describe("useMousePosition", () => {
	const dispatchPointerMove = (x: number, y: number) => {
		window.dispatchEvent(
			new PointerEvent("pointermove", {
				bubbles: true,
				clientX: x,
				clientY: y,
			})
		);
	};

	describe("global position", () => {
		testWithEffect("starts at 0, 0", () => {
			const mouse = useMousePosition();
			expect(mouse.x).toBe(0);
			expect(mouse.y).toBe(0);
		});

		testWithEffect("tracks cursor position on pointermove", () => {
			const mouse = useMousePosition();
			flushSync();

			dispatchPointerMove(150, 200);
			flushSync();

			expect(mouse.x).toBe(150);
			expect(mouse.y).toBe(200);
		});

		testWithEffect("updates on subsequent moves", () => {
			const mouse = useMousePosition();
			flushSync();

			dispatchPointerMove(10, 20);
			flushSync();
			expect(mouse.x).toBe(10);
			expect(mouse.y).toBe(20);

			dispatchPointerMove(300, 400);
			flushSync();
			expect(mouse.x).toBe(300);
			expect(mouse.y).toBe(400);
		});
	});

	describe("element-relative position", () => {
		let target: HTMLDivElement;

		beforeEach(() => {
			target = document.createElement("div");
			document.body.appendChild(target);
			target.getBoundingClientRect = () => ({
				x: 50,
				y: 50,
				width: 100,
				height: 100,
				top: 50,
				right: 150,
				bottom: 150,
				left: 50,
				toJSON() {},
			});
		});

		afterEach(() => {
			target.remove();
		});

		testWithEffect("computes elementX and elementY relative to target", () => {
			const mouse = useMousePosition(() => target);
			flushSync();

			dispatchPointerMove(75, 80);
			flushSync();

			expect(mouse.elementX).toBe(25);
			expect(mouse.elementY).toBe(30);
		});

		testWithEffect("returns negative values when cursor is above/left of target", () => {
			const mouse = useMousePosition(() => target);
			flushSync();

			dispatchPointerMove(30, 20);
			flushSync();

			expect(mouse.elementX).toBe(-20);
			expect(mouse.elementY).toBe(-30);
		});

		testWithEffect("returns values exceeding dimensions when cursor is beyond target", () => {
			const mouse = useMousePosition(() => target);
			flushSync();

			dispatchPointerMove(200, 250);
			flushSync();

			// 200 - 50 = 150, which is > width (100)
			expect(mouse.elementX).toBe(150);
			// 250 - 50 = 200, which is > height (100)
			expect(mouse.elementY).toBe(200);
		});

		testWithEffect("isInside is true when cursor is within target bounds", () => {
			const mouse = useMousePosition(() => target);
			flushSync();

			dispatchPointerMove(100, 100);
			flushSync();

			expect(mouse.isInside).toBe(true);
		});

		testWithEffect("isInside is false when cursor is outside target bounds", () => {
			const mouse = useMousePosition(() => target);
			flushSync();

			dispatchPointerMove(200, 200);
			flushSync();

			expect(mouse.isInside).toBe(false);
		});

		testWithEffect("elementX/elementY are 0 when no target is provided", () => {
			const mouse = useMousePosition();
			flushSync();

			dispatchPointerMove(100, 100);
			flushSync();

			expect(mouse.elementX).toBe(0);
			expect(mouse.elementY).toBe(0);
			expect(mouse.isInside).toBe(false);
		});
	});

	describe("start / stop", () => {
		testWithEffect("is enabled by default", () => {
			const mouse = useMousePosition();
			expect(mouse.enabled).toBe(true);
		});

		testWithEffect("ignores events when stopped", () => {
			const mouse = useMousePosition();
			flushSync();

			mouse.stop();
			dispatchPointerMove(100, 200);
			flushSync();

			expect(mouse.x).toBe(0);
			expect(mouse.y).toBe(0);
			expect(mouse.enabled).toBe(false);
		});

		testWithEffect("resumes tracking after start", () => {
			const mouse = useMousePosition();
			flushSync();

			mouse.stop();
			dispatchPointerMove(100, 200);
			flushSync();
			expect(mouse.x).toBe(0);

			mouse.start();
			dispatchPointerMove(300, 400);
			flushSync();

			expect(mouse.x).toBe(300);
			expect(mouse.y).toBe(400);
			expect(mouse.enabled).toBe(true);
		});

		testWithEffect("respects immediate: false", () => {
			const mouse = useMousePosition(undefined, { immediate: false });
			flushSync();

			expect(mouse.enabled).toBe(false);

			dispatchPointerMove(100, 200);
			flushSync();

			expect(mouse.x).toBe(0);
			expect(mouse.y).toBe(0);

			mouse.start();
			dispatchPointerMove(100, 200);
			flushSync();

			expect(mouse.x).toBe(100);
			expect(mouse.y).toBe(200);
		});
	});
});
