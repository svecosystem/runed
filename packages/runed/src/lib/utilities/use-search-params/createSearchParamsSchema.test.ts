import { describe, it, expect } from "vitest";
import { createSearchParamsSchema } from "./use-search-params.svelte";

describe("createSearchParamsSchema", () => {
	it("applies default values for all schema types", () => {
		const schema = createSearchParamsSchema({
			str: { type: "string", default: "hello" },
			num: { type: "number", default: 2 },
			bool: { type: "boolean", default: true },
			arr: { type: "array", default: [1, 2], arrayType: 1 },
			obj: { type: "object", default: { a: "b" }, objectType: { a: "" } },
		});
		const result = schema["~standard"].validate({});
		expect("value" in result && result.value).toEqual({
			str: "hello",
			num: 2,
			bool: true,
			arr: [1, 2],
			obj: { a: "b" },
		});
	});

	it("converts input values to correct types", () => {
		const schema = createSearchParamsSchema({
			str: { type: "string", default: "" },
			num: { type: "number", default: 0 },
			bool: { type: "boolean", default: false },
			arr: { type: "array", default: [], arrayType: 1 },
			obj: { type: "object", default: {}, objectType: { a: "" } },
		});
		const input = {
			str: 123,
			num: "5",
			bool: "true",
			arr: [3, 4],
			obj: { c: 4 },
		} as unknown;
		const result = schema["~standard"].validate(input);
		expect("value" in result && result.value).toEqual({
			str: "123",
			num: 5,
			bool: true,
			arr: [3, 4],
			obj: { c: 4 },
		});
	});

	it("returns issues for invalid number, array, and object inputs", () => {
		const schema = createSearchParamsSchema({
			foo: { type: "string" },
			bar: { type: "number" },
			baz: { type: "array" },
			qux: { type: "object" },
		});

		// Invalid input
		const invalidResult = schema["~standard"].validate({
			foo: undefined,
			bar: "not-a-number",
			baz: "not-array",
			qux: "not-object",
		} as any);

		expect("issues" in invalidResult).toBe(true);
		expect(Array.isArray((invalidResult as any).issues)).toBe(true);
		expect((invalidResult as any).issues).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					message: expect.stringContaining("Invalid number"),
					path: ["bar"],
				}),
				expect.objectContaining({
					message: expect.stringContaining("Invalid array"),
					path: ["baz"],
				}),
				expect.objectContaining({
					message: expect.stringContaining("Invalid object"),
					path: ["qux"],
				}),
			])
		);
	});

	it("returns value for valid input and issues for invalid input", () => {
		const schema = createSearchParamsSchema({
			page: { type: "number", default: 1 },
		});

		// Valid input
		const valid = schema["~standard"].validate({ page: 2 });
		expect("value" in valid && valid.value).toEqual({ page: 2 });

		// Invalid input
		const invalid = schema["~standard"].validate({ page: "abc" });
		expect("issues" in invalid).toBe(true);
		expect((invalid as any).issues[0].message).toMatch(/Invalid number/);
		expect((invalid as any).issues[0].path).toEqual(["page"]);
	});

	it("handles missing defaults as null", () => {
		const schema = createSearchParamsSchema({
			foo: { type: "string" },
			bar: { type: "number" },
			baz: { type: "array" },
			qux: { type: "object" },
		});
		const emptyResult = schema["~standard"].validate({});
		expect("value" in emptyResult && emptyResult.value).toEqual({
			foo: null,
			bar: null,
			baz: null,
			qux: null,
		});
	});
});
