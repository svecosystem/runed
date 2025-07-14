import { describe, expect } from "vitest";
import { PressedKeys } from "./pressed-keys.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";
import { flushSync } from "svelte";

describe(PressedKeys, () => {
	testWithEffect("on keydown key is pressed", () => {
		const pressedKeys = new PressedKeys();
		const key = "a";
		let pressedKeysList: string[] = [];
		$effect(() => {
			pressedKeysList = pressedKeys.all;
		});
		flushSync();
		const event = new KeyboardEvent("keydown", { key });
		window.dispatchEvent(event);
		flushSync();

		expect(pressedKeysList).toEqual([key]);
	});

	testWithEffect("on keyup key is released", () => {
		const pressedKeys = new PressedKeys();
		const key = "a";
		let pressedKeysList: string[] = [];
		$effect(() => {
			pressedKeysList = pressedKeys.all;
		});
		flushSync();
		window.dispatchEvent(new KeyboardEvent("keydown", { key }));
		flushSync();
		window.dispatchEvent(new KeyboardEvent("keyup", { key }));
		flushSync();

		expect(pressedKeysList).toEqual([]);
	});

	testWithEffect("on window blur, all keys are released", () => {
		const pressedKeys = new PressedKeys();
		const key = "a";
		let pressedKeysList: string[] = [];
		$effect(() => {
			pressedKeysList = pressedKeys.all;
		});
		flushSync();
		window.dispatchEvent(new KeyboardEvent("keydown", { key }));
		flushSync();
		window.dispatchEvent(new Event("blur"));
		flushSync();

		expect(pressedKeysList).toEqual([]);
	});

	testWithEffect("has() returns true for pressed key", () => {
		const pressedKeys = new PressedKeys();
		const key = "a";
		let hasKey = false;
		$effect(() => {
			hasKey = pressedKeys.has(key);
		});
		flushSync();
		window.dispatchEvent(new KeyboardEvent("keydown", { key }));
		flushSync();

		expect(hasKey).toBe(true);
	});

	testWithEffect("has() returns false for non-pressed key", () => {
		const pressedKeys = new PressedKeys();
		const key = "a";
		let hasKey = false;
		$effect(() => {
			hasKey = pressedKeys.has(key);
		});
		flushSync();

		expect(hasKey).toBe(false);
	});

	testWithEffect("multiple keys can be pressed", () => {
		const pressedKeys = new PressedKeys();
		const keys = ["a", "b", "c"];
		let pressedKeysList: string[] = [];
		$effect(() => {
			pressedKeysList = pressedKeys.all;
		});
		flushSync();

		keys.forEach((key) => {
			window.dispatchEvent(new KeyboardEvent("keydown", { key }));
			flushSync();
		});

		expect(pressedKeysList).toEqual(keys);
	});

	testWithEffect("releasing a modifier key clears non-modifier keys", () => {
		const pressedKeys = new PressedKeys();
		const keys = ["control", "alt", "a", "b"];
		let pressedKeysList: string[] = [];
		$effect(() => {
			pressedKeysList = pressedKeys.all;
		});
		flushSync();

		keys.forEach((key) => {
			window.dispatchEvent(new KeyboardEvent("keydown", { key }));
			flushSync();
		});

		window.dispatchEvent(new KeyboardEvent("keyup", { key: "control" }));
		flushSync();

		expect(pressedKeysList).toEqual(["alt"]);
	});
});
