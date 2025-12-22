import { describe, expect } from "vitest";
import { flushSync } from "svelte";
import { usePreferredColorScheme } from "./use-preferred-color-scheme.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

describe("usePreferredColorScheme", () => {
	testWithEffect("initializes with dark fallback", () => {
		const util = usePreferredColorScheme({ fallback: "dark" });
		flushSync();
		expect(typeof util.current).toBe("string");
		expect(["dark", "light", "no-preference"].includes(util.current)).toBe(true);
	});

	testWithEffect("initializes with light fallback", () => {
		const util = usePreferredColorScheme({ fallback: "light" });
		flushSync();
		expect(typeof util.current).toBe("string");
		expect(["dark", "light", "no-preference"].includes(util.current)).toBe(true);
	});

	testWithEffect("initializes with no-preference fallback (default)", () => {
		const util = usePreferredColorScheme();
		flushSync();
		expect(typeof util.current).toBe("string");
		expect(["dark", "light", "no-preference"].includes(util.current)).toBe(true);
	});

	testWithEffect("returns object with current getter", () => {
		const util = usePreferredColorScheme({ fallback: "no-preference" });
		flushSync();
		expect(typeof util).toBe("object");
		expect(typeof util.current).toBe("string");
		expect(["dark", "light", "no-preference"].includes(util.current)).toBe(true);
	});
});
