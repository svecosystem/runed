import { describe, expect, vi, beforeEach, afterEach } from "vitest";
import { onKeyStroke, onKeyDown, onKeyUp, onKeyPress } from "./onKeyStroke.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";
import { tick } from "svelte";

describe("key stroke utilities", () => {
	let target: HTMLElement;

	beforeEach(() => {
		target = document.createElement("div");
		document.body.appendChild(target);
	});

	afterEach(() => {
		document.body.removeChild(target);
		vi.clearAllMocks();
	});

	// Helper function to create and dispatch keyboard events
	const dispatchKeyEvent = (
		element: HTMLElement,
		eventType: string,
		key: string,
		options: Partial<KeyboardEventInit> = {}
	) => {
		const event = new KeyboardEvent(eventType, {
			key,
			bubbles: true,
			cancelable: true,
			...options,
		});
		element.dispatchEvent(event);
	};

	testWithEffect("should handle single key filter", async () => {
		const handler = vi.fn();
		const { stop } = onKeyStroke("a", handler, { target });
		await tick();

		dispatchKeyEvent(target, "keydown", "a");
		await tick();
		await tick(); // Double tick to ensure reactivity has settled

		expect(handler).toHaveBeenCalledTimes(1);

		dispatchKeyEvent(target, "keydown", "b");
		await tick();
		await tick();

		expect(handler).toHaveBeenCalledTimes(1);
		stop();
	});

	testWithEffect("should handle command/control + K combination", async () => {
		const handler = vi.fn();
		const predicate = (event: KeyboardEvent) => {
			const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
			const modifier = isMac ? event.metaKey : event.ctrlKey;
			return event.key.toLowerCase() === "k" && modifier && !event.shiftKey && !event.altKey;
		};

		const { stop } = onKeyStroke(predicate, handler, { target });
		await tick();

		// Test without any modifier (should not trigger)
		dispatchKeyEvent(target, "keydown", "k");
		await tick();
		await tick();
		expect(handler).not.toHaveBeenCalled();

		// Test with correct modifier for platform
		const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
		dispatchKeyEvent(target, "keydown", "k", {
			metaKey: isMac,
			ctrlKey: !isMac,
			shiftKey: false,
			altKey: false,
		});
		await tick();
		await tick();
		expect(handler).toHaveBeenCalledTimes(1);

		// Test with wrong modifier (should not trigger)
		dispatchKeyEvent(target, "keydown", "k", {
			metaKey: !isMac,
			ctrlKey: isMac,
		});
		await tick();
		await tick();
		expect(handler).toHaveBeenCalledTimes(1);

		// Test with additional modifiers (should not trigger)
		dispatchKeyEvent(target, "keydown", "k", {
			metaKey: isMac,
			ctrlKey: !isMac,
			shiftKey: true,
		});
		await tick();
		await tick();
		expect(handler).toHaveBeenCalledTimes(1);

		stop();
	});

	testWithEffect("should handle array of keys", async () => {
		const handler = vi.fn();
		const { stop } = onKeyStroke(["a", "b"], handler, { target });
		await tick();

		dispatchKeyEvent(target, "keydown", "a");
		await tick();
		await tick();

		dispatchKeyEvent(target, "keydown", "b");
		await tick();
		await tick();

		dispatchKeyEvent(target, "keydown", "c");
		await tick();
		await tick();

		expect(handler).toHaveBeenCalledTimes(2);
		stop();
	});

	testWithEffect("should handle custom predicate", async () => {
		const handler = vi.fn();
		const predicate = (event: KeyboardEvent) => event.key.length === 1;
		const { stop } = onKeyStroke(predicate, handler, { target });
		await tick();

		dispatchKeyEvent(target, "keydown", "a");
		await tick();
		await tick();

		dispatchKeyEvent(target, "keydown", "Enter");
		await tick();
		await tick();

		expect(handler).toHaveBeenCalledTimes(1);
		stop();
	});

	testWithEffect("should respect ignoreRepeat option", async () => {
		const handler = vi.fn();
		const { stop } = onKeyStroke("a", handler, { target, ignoreRepeat: true });
		await tick();

		dispatchKeyEvent(target, "keydown", "a", { repeat: true });
		await tick();
		await tick();
		expect(handler).not.toHaveBeenCalled();

		dispatchKeyEvent(target, "keydown", "a", { repeat: false });
		await tick();
		await tick();
		expect(handler).toHaveBeenCalledTimes(1);

		stop();
	});

	testWithEffect("should handle immediate option", async () => {
		const handler = vi.fn();
		const { start, stop } = onKeyStroke("a", handler, { target, immediate: false });
		await tick();

		dispatchKeyEvent(target, "keydown", "a");
		await tick();
		await tick();
		expect(handler).not.toHaveBeenCalled();

		start();
		await tick();
		dispatchKeyEvent(target, "keydown", "a");
		await tick();
		await tick();
		expect(handler).toHaveBeenCalledTimes(1);

		stop();
	});

	describe("event type variants", () => {
		testWithEffect("should handle onKeyDown", async () => {
			const handler = vi.fn();
			const { stop } = onKeyDown("a", handler, { target });
			await tick();

			dispatchKeyEvent(target, "keydown", "a");
			await tick();
			await tick();
			expect(handler).toHaveBeenCalledTimes(1);

			stop();
		});

		testWithEffect("should handle onKeyUp", async () => {
			const handler = vi.fn();
			const { stop } = onKeyUp("a", handler, { target });
			await tick();

			dispatchKeyEvent(target, "keyup", "a");
			await tick();
			await tick();
			expect(handler).toHaveBeenCalledTimes(1);

			stop();
		});

		testWithEffect("should handle onKeyPress", async () => {
			const handler = vi.fn();
			const { stop } = onKeyPress("a", handler, { target });
			await tick();

			dispatchKeyEvent(target, "keypress", "a");
			await tick();
			await tick();
			expect(handler).toHaveBeenCalledTimes(1);

			stop();
		});
	});

	describe("cleanup", () => {
		testWithEffect("should properly clean up listeners", async () => {
			const handler = vi.fn();
			const { stop } = onKeyStroke("a", handler, { target });
			await tick();

			stop();
			await tick();
			dispatchKeyEvent(target, "keydown", "a");
			await tick();
			await tick();
			expect(handler).not.toHaveBeenCalled();
		});

		testWithEffect("should handle multiple start/stop calls", async () => {
			const handler = vi.fn();
			const { start, stop } = onKeyStroke("a", handler, { target });
			await tick();

			stop();
			await tick();
			dispatchKeyEvent(target, "keydown", "a");
			await tick();
			await tick();
			expect(handler).not.toHaveBeenCalled();

			start();
			await tick();
			dispatchKeyEvent(target, "keydown", "a");
			await tick();
			await tick();
			expect(handler).toHaveBeenCalledTimes(1);

			stop();
			await tick();
			dispatchKeyEvent(target, "keydown", "a");
			await tick();
			await tick();
			expect(handler).toHaveBeenCalledTimes(1);
		});
	});
});
