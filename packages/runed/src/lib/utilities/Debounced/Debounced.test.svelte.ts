import { describe, expect } from "vitest";
import { Debounced } from "./Debounced.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

describe("Debounced", () => {
	testWithEffect("Value does not get updated immediately", async () => {
		let value = $state(0);
		const debounced = new Debounced(() => value, 100);

		expect(debounced.current).toBe(0);
		value = 1;
		expect(debounced.current).toBe(0);
		await new Promise((resolve) => setTimeout(resolve, 200));
		expect(debounced.current).toBe(1);
	});

	testWithEffect("Can cancel debounced update", async () => {
		let value = $state(0);
		const debounced = new Debounced(() => value, 100);

		expect(debounced.current).toBe(0);
		value = 1;
		expect(debounced.current).toBe(0);
		debounced.cancel();
		await new Promise((resolve) => setTimeout(resolve, 200));
		expect(debounced.current).toBe(0);
	});

	testWithEffect("Can set value immediately", async () => {
		let value = $state(0);
		const debounced = new Debounced(() => value, 100);

		expect(debounced.current).toBe(0);
		value = 1;
		expect(debounced.current).toBe(0);
		await new Promise((resolve) => setTimeout(resolve, 200));
		expect(debounced.current).toBe(1);

		debounced.setImmediately(2);
		expect(debounced.current).toBe(2);
	});

	testWithEffect("Can run update immediately", async () => {
		let value = $state(0);
		const debounced = new Debounced(() => value * 2, 100);

		expect(debounced.current).toBe(0);
		value = 1;
		expect(debounced.current).toBe(0);
		await debounced.updateImmediately();
		expect(debounced.current).toBe(2);
	});
});
