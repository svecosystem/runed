import { describe, expect, vi, beforeEach, afterEach } from "vitest";
import { onKeyStroke, onKeyDown, onKeyUp, onKeyPress } from "./on-key-stroke.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";
import { tick } from "svelte";

const IS_MAC_REGEX = /Mac/;

describe("onKeyStroke", () => {
	let target: HTMLElement;

	beforeEach(() => {
		target = document.createElement("div");
		document.body.appendChild(target);
	});

	afterEach(() => {
		document.body.removeChild(target);
		vi.clearAllMocks();
	});

	// Helper function to set platform
	const mockPlatform = (platform: string) => {
		Object.defineProperty(global, "navigator", {
			value: {
				...navigator,
				platform,
			},
			writable: true,
		});
	};

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

	testWithEffect("should handle array of keys", async () => {
		const handler = vi.fn();
		const { stop } = onKeyStroke(["a", "b"], handler, { target });
		await tick();

		dispatchKeyEvent(target, "keydown", "a");

		dispatchKeyEvent(target, "keydown", "b");

		dispatchKeyEvent(target, "keydown", "c");

		expect(handler).toHaveBeenCalledTimes(2);
		stop();
	});

	testWithEffect("should handle custom predicate", async () => {
		const handler = vi.fn();
		const predicate = (event: KeyboardEvent) => event.key.length === 1;
		const { stop } = onKeyStroke(predicate, handler, { target });
		await tick();

		dispatchKeyEvent(target, "keydown", "a");

		dispatchKeyEvent(target, "keydown", "Enter");

		expect(handler).toHaveBeenCalledTimes(1);
		stop();
	});

	testWithEffect("should respect ignoreRepeat option", async () => {
		const handler = vi.fn();
		const { stop } = onKeyStroke("a", handler, { target, ignoreRepeat: true });
		await tick();

		dispatchKeyEvent(target, "keydown", "a", { repeat: true });
		expect(handler).not.toHaveBeenCalled();

		dispatchKeyEvent(target, "keydown", "a", { repeat: false });
		expect(handler).toHaveBeenCalledTimes(1);

		stop();
	});

	testWithEffect("should handle immediate option", async () => {
		const handler = vi.fn();
		const { start, stop } = onKeyStroke("a", handler, { target, immediate: false });

		dispatchKeyEvent(target, "keydown", "a");
		expect(handler).not.toHaveBeenCalled();

		start();
		dispatchKeyEvent(target, "keydown", "a");
		expect(handler).toHaveBeenCalledTimes(1);

		stop();
	});

	describe("event type variants", () => {
		testWithEffect("should handle onKeyDown", async () => {
			const handler = vi.fn();
			const { stop } = onKeyDown("a", handler, { target });
			await tick();

			dispatchKeyEvent(target, "keydown", "a");
			expect(handler).toHaveBeenCalledTimes(1);

			stop();
		});

		testWithEffect("should handle onKeyUp", async () => {
			const handler = vi.fn();
			const { stop } = onKeyUp("a", handler, { target });
			await tick();

			dispatchKeyEvent(target, "keyup", "a");
			expect(handler).toHaveBeenCalledTimes(1);

			stop();
		});

		testWithEffect("should handle onKeyPress", async () => {
			const handler = vi.fn();
			const { stop } = onKeyPress("a", handler, { target });
			await tick();

			dispatchKeyEvent(target, "keypress", "a");
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
			dispatchKeyEvent(target, "keydown", "a");
			expect(handler).not.toHaveBeenCalled();
		});

		testWithEffect("should handle multiple start/stop calls", async () => {
			const handler = vi.fn();
			const { start, stop } = onKeyStroke("a", handler, { target });
			await tick();

			stop();
			dispatchKeyEvent(target, "keydown", "a");
			expect(handler).not.toHaveBeenCalled();

			start();
			dispatchKeyEvent(target, "keydown", "a");
			expect(handler).toHaveBeenCalledTimes(1);

			stop();
			dispatchKeyEvent(target, "keydown", "a");
			expect(handler).toHaveBeenCalledTimes(1);
		});
	});

	describe("common key combinations", () => {
		testWithEffect("should handle command + K on Mac", async () => {
			mockPlatform("MacIntel");
			const handler = vi.fn();
			const predicate = (event: KeyboardEvent) => {
				const isMac = IS_MAC_REGEX.test(navigator.platform);
				const modifier = isMac ? event.metaKey : event.ctrlKey;
				return event.key.toLowerCase() === "k" && modifier && !event.shiftKey && !event.altKey;
			};

			const { stop } = onKeyStroke(predicate, handler, { target });
			await tick();

			// Test with command key (should trigger on Mac)
			dispatchKeyEvent(target, "keydown", "k", {
				metaKey: true,
				ctrlKey: false,
				shiftKey: false,
				altKey: false,
			});
			expect(handler).toHaveBeenCalledTimes(1);

			stop();
		});

		testWithEffect("should handle ctrl + K on Windows", async () => {
			mockPlatform("Win32");
			const handler = vi.fn();
			const predicate = (event: KeyboardEvent) => {
				const isMac = IS_MAC_REGEX.test(navigator.platform);
				const modifier = isMac ? event.metaKey : event.ctrlKey;
				return event.key.toLowerCase() === "k" && modifier && !event.shiftKey && !event.altKey;
			};

			const { stop } = onKeyStroke(predicate, handler, { target });
			await tick();

			// Test with control key (should trigger on Windows)
			dispatchKeyEvent(target, "keydown", "k", {
				metaKey: false,
				ctrlKey: true,
				shiftKey: false,
				altKey: false,
			});
			expect(handler).toHaveBeenCalledTimes(1);

			stop();
		});
	});
});
