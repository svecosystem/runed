import { describe, expect } from "vitest";
import { extract } from "./extract.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

describe("extract", () => {
	testWithEffect("resolves primitive values", () => {
		const value = 303;
		const result = extract(value);
		expect(result).toBe(value);
	});

	testWithEffect("resolves to default if undefined", () => {
		const value = undefined;
		const defaultValue = 808;
		const result = extract(value, defaultValue);
		expect(result).toBe(defaultValue);
	});

	testWithEffect("resolves to default if function returns undefined", () => {
		const value = (): number | undefined => undefined;
		const defaultValue = 808;
		const result = extract(value, defaultValue);
		expect(result).toBe(defaultValue);
	});

	testWithEffect("resolves to function return value", () => {
		const value = () => 505;
		const result = extract(value);
		expect(result).toBe(505);
	});
});
