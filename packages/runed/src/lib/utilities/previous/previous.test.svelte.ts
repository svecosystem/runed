import { testWithEffect } from "$lib/test/util.svelte.js";
import { describe } from "node:test";
import { flushSync } from "svelte";
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

	testWithEffect("Should return previous value", () => {
		let count = $state(0);
		const previous = new Previous(() => count);

		const logs: (number | undefined)[] = [];

		// test that the previous.current actually triggers reactivity
		$effect.pre(() => {
			logs.push(previous.current);
		});

		expect(previous.current).toBe(undefined);
		flushSync();
		expect(logs).toEqual([undefined]);
		count = 1;
		// check that the value is updated synchronously
		expect(previous.current).toBe(0);
		// then flushsync to check that the effect has run
		flushSync();
		expect(logs).toEqual([undefined, 0]);
		count = 2;
		// check that the value is updated synchronously
		expect(previous.current).toBe(1);
		// then flushsync to check that the effect has run
		flushSync();
		expect(logs).toEqual([undefined, 0, 1]);
	});
});
