import { describe, expect, it, vi } from "vitest";
import { PressedKeys } from "./pressed-keys.svelte.js";
import { testWithEffect } from "$lib/internal/test-utils.svelte.js";

describe("PressedKeys", () => {
	describe("has method", () => {
		it("should use exact matching by default", async () => {
			await testWithEffect(async () => {
				const keys = new PressedKeys();
				const target = document.body;

				// Press only 'k'
				target.dispatchEvent(new KeyboardEvent("keydown", { key: "k" }));
				expect(keys.has("k")).toBe(true);
				expect(keys.has("K")).toBe(true); // case insensitive
				
				// Now press 'meta' while 'k' is still down
				target.dispatchEvent(new KeyboardEvent("keydown", { key: "Meta" }));
				expect(keys.has("k")).toBe(false); // exact match fails
				expect(keys.has("meta", "k")).toBe(true); // exact match for both keys
				expect(keys.has("k", "meta")).toBe(true); // order doesn't matter
				
				// Release 'meta'
				target.dispatchEvent(new KeyboardEvent("keyup", { key: "Meta" }));
				expect(keys.has("k")).toBe(true); // back to just 'k'
				
				// Release 'k'
				target.dispatchEvent(new KeyboardEvent("keyup", { key: "k" }));
				expect(keys.has("k")).toBe(false);
			});
		});


		it("should handle modifier keys correctly", async () => {
			await testWithEffect(async () => {
				const keys = new PressedKeys();
				const target = document.body;

				// Test each modifier
				const modifiers = ["Control", "Alt", "Shift", "Meta"];
				
				for (const modifier of modifiers) {
					target.dispatchEvent(new KeyboardEvent("keydown", { key: modifier }));
					expect(keys.has(modifier.toLowerCase())).toBe(true);
					target.dispatchEvent(new KeyboardEvent("keyup", { key: modifier }));
				}
			});
		});

		it("should clear keys on blur", async () => {
			await testWithEffect(async () => {
				const keys = new PressedKeys();
				const target = document.body;

				target.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
				target.dispatchEvent(new KeyboardEvent("keydown", { key: "b" }));
				expect(keys.has("a", "b")).toBe(true);

				window.dispatchEvent(new Event("blur"));
				expect(keys.all).toEqual([]);
				expect(keys.has("a")).toBe(false);
				expect(keys.has("b")).toBe(false);
			});
		});

		it("should clear keys on visibility change", async () => {
			await testWithEffect(async () => {
				const keys = new PressedKeys();
				const target = document.body;

				target.dispatchEvent(new KeyboardEvent("keydown", { key: "x" }));
				expect(keys.has("x")).toBe(true);

				// Mock hidden visibility
				Object.defineProperty(document, "visibilityState", {
					value: "hidden",
					writable: true,
				});
				document.dispatchEvent(new Event("visibilitychange"));
				
				expect(keys.all).toEqual([]);
				expect(keys.has("x")).toBe(false);
			});
		});
	});

	describe("onKeys method", () => {
		it("should use exact matching by default", async () => {
			await testWithEffect(async () => {
				const keys = new PressedKeys();
				const target = document.body;
				const callback = vi.fn();

				keys.onKeys("k", callback);

				// Press only 'k' - should trigger
				target.dispatchEvent(new KeyboardEvent("keydown", { key: "k" }));
				expect(callback).toHaveBeenCalledTimes(1);

				// Press 'meta' while 'k' is down - should not trigger again
				target.dispatchEvent(new KeyboardEvent("keydown", { key: "Meta" }));
				expect(callback).toHaveBeenCalledTimes(1); // still 1

				// Release 'meta' - should trigger again as we're back to just 'k'
				target.dispatchEvent(new KeyboardEvent("keyup", { key: "Meta" }));
				expect(callback).toHaveBeenCalledTimes(2);
			});
		});


		it("should handle multiple keys with exact matching", async () => {
			await testWithEffect(async () => {
				const keys = new PressedKeys();
				const target = document.body;
				const callback = vi.fn();

				keys.onKeys(["meta", "k"], callback);

				// Press only 'k' - should not trigger
				target.dispatchEvent(new KeyboardEvent("keydown", { key: "k" }));
				expect(callback).toHaveBeenCalledTimes(0);

				// Press 'meta' - should trigger
				target.dispatchEvent(new KeyboardEvent("keydown", { key: "Meta" }));
				expect(callback).toHaveBeenCalledTimes(1);

				// Press 'shift' - should not trigger again (exact match fails)
				target.dispatchEvent(new KeyboardEvent("keydown", { key: "Shift" }));
				expect(callback).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe("all property", () => {
		it("should return all pressed keys", async () => {
			await testWithEffect(async () => {
				const keys = new PressedKeys();
				const target = document.body;

				expect(keys.all).toEqual([]);

				target.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
				expect(keys.all).toEqual(["a"]);

				target.dispatchEvent(new KeyboardEvent("keydown", { key: "B" }));
				expect(keys.all).toEqual(["a", "b"]);

				target.dispatchEvent(new KeyboardEvent("keyup", { key: "a" }));
				expect(keys.all).toEqual(["b"]);
			});
		});
	});

	describe("edge cases", () => {
		it("should handle repeated keydown events for same key", async () => {
			await testWithEffect(async () => {
				const keys = new PressedKeys();
				const target = document.body;

				target.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
				target.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
				target.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
				
				expect(keys.all).toEqual(["a"]);
				expect(keys.has("a")).toBe(true);
			});
		});

		it("should handle modifier release clearing non-modifier keys", async () => {
			await testWithEffect(async () => {
				const keys = new PressedKeys();
				const target = document.body;

				// Press several keys including modifiers
				target.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
				target.dispatchEvent(new KeyboardEvent("keydown", { key: "Meta" }));
				target.dispatchEvent(new KeyboardEvent("keydown", { key: "b" }));
				target.dispatchEvent(new KeyboardEvent("keydown", { key: "Shift" }));
				
				expect(keys.all.sort()).toEqual(["a", "b", "meta", "shift"]);
				
				// Release one modifier - should clear non-modifiers
				target.dispatchEvent(new KeyboardEvent("keyup", { key: "Meta" }));
				expect(keys.all).toEqual(["shift"]);
			});
		});
	});
});