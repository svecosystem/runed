import { describe, expect, test } from "vitest";
import { box } from "./box.svelte.js";

describe("box", () => {
	test("box with initial value should be settable", () => {
		const count = box(0);
		expect(count.value).toBe(0);
		count.value = 1;
		expect(count.value).toBe(1);
	})

	test("box with getter only should be readonly", () => {
		const count = box(() => 0);
		expect(count.value).toBe(0);
		// @ts-expect-error - We're testing if it throws, so it's fine.
		expect(() => count.value = 1).toThrow();
	})

	test("box with initial value and setter should be settable", () => {
		const count = box(0, (c) => c);
		expect(count.value).toBe(0);
		count.value = 1;
		expect(count.value).toBe(1);
	})

	test("box with getter and setter should be settable", () => {
		let count = $state(0);
		const countBox = box(() => count, (c) => count = c);
		expect(countBox.value).toBe(0);
		countBox.value = 1;
		expect(countBox.value).toBe(1);
	})
})