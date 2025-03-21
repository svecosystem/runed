import { sleep } from "$lib/internal/utils/sleep.js";
import { testWithEffect } from "$lib/test/util.svelte.js";
import { describe } from "node:test";
import { expect } from "vitest";
import { Previous } from "./previous.svelte.js";

describe("usePrevious", () => {
	testWithEffect("Should return undefined initially", () => {
		const previous = new Previous(() => 0);
		expect(previous.current).toBe(undefined);
	});

	testWithEffect("Should return initialValue initially, when passed", () => {
		const previous = new Previous(() => 1, 0);
		expect(previous.current).toBe(0);
	});

	testWithEffect("Should return previous value", async () => {
		let count = $state(0);
		const previous = new Previous(() => count);

		await sleep(10);
		expect(previous.current).toBe(undefined);
		count = 1;
		await sleep(10);
		expect(previous.current).toBe(0);
		count = 2;
		await sleep(10);
		expect(previous.current).toBe(1);
	});
});
