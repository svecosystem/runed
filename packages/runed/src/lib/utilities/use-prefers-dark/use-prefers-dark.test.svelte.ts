import { describe, expect } from "vitest";
import { flushSync } from "svelte";
import { UsePrefersDark, usePrefersDark } from "./use-prefers-dark.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

describe("UsePrefersDark", () => {
	testWithEffect("initializes with fallback value", () => {
		const util = new UsePrefersDark({ fallback: true });
		flushSync();
		expect(typeof util.current).toBe("boolean");
	});

	testWithEffect("initializes with default fallback", () => {
		const util = new UsePrefersDark();
		flushSync();
		expect(typeof util.current).toBe("boolean");
	});

	testWithEffect("usePrefersDark function returns UsePrefersDark instance", () => {
		const util = usePrefersDark({ fallback: false });
		flushSync();
		expect(util).toBeInstanceOf(UsePrefersDark);
		expect(typeof util.current).toBe("boolean");
	});

	testWithEffect("usePrefersDark function with default options", () => {
		const util = usePrefersDark();
		flushSync();
		expect(util).toBeInstanceOf(UsePrefersDark);
		expect(typeof util.current).toBe("boolean");
	});
});
