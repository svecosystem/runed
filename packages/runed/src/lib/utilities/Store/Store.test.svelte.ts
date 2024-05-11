import { describe, expect } from "vitest";
import { get, readable, writable } from "svelte/store";
import { Store } from "./index.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

describe("Store", () => {
	testWithEffect("box of writable store should be settable", () => {
		const store = writable(0);
		const count = new Store(store);
		expect(count.current).toBe(0);
		expect(get(store)).toBe(0);

		count.current = 1;
		expect(count.current).toBe(1);
		expect(get(store)).toBe(1);

		store.set(2);
		expect(count.current).toBe(2);
		expect(get(store)).toBe(2);
	});

	testWithEffect("box of readable store should not be settable", () => {
		const count = new Store(readable(0));
		expect(count.current).toBe(0);
		// @ts-expect-error -- we're testing that the setter is not run
		expect(() => (count.current = 'abc')).toThrow();
	});
});
