import { describe, expect } from "vitest";
import { get, readable, writable } from "svelte/store";
import { useStore } from "./index.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

describe("useStore", () => {
	testWithEffect("box of writable store should be settable", () => {
		const store = writable(0);
		const count = useStore(store);
		expect(count.value).toBe(0);
		expect(get(store)).toBe(0);

		count.value = 1;
		expect(count.value).toBe(1);
		expect(get(store)).toBe(1);

		store.set(2);
		expect(count.value).toBe(2);
		expect(get(store)).toBe(2);
	});

	testWithEffect("box of readable store should not be settable", () => {
		const count = useStore(readable(0));
		expect(count.value).toBe(0);
		// @ts-expect-error -- we're testing that the setter is not run
		expect(() => (count.value = 1)).toThrow();
	});
});
