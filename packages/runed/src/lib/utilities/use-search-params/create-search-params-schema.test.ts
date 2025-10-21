import { describe, it, expect } from "vitest";
import { createSearchParamsSchema } from "./use-search-params.svelte.js";
import type { StandardSchemaV1 } from "./use-search-params.svelte.js";

describe("createSearchParamsSchema", () => {
	it("applies default values for all schema types", () => {
		const testDate = new Date("2023-01-01T00:00:00Z");
		const schema = createSearchParamsSchema({
			str: { type: "string", default: "hello" },
			num: { type: "number", default: 2 },
			bool: { type: "boolean", default: true },
			date: { type: "date", default: testDate },
			arr: { type: "array", default: [1, 2], arrayType: 1 },
			obj: { type: "object", default: { a: "b" }, objectType: { a: "" } },
		});
		const result = schema["~standard"].validate({});
		expect("value" in result && result.value).toEqual({
			str: "hello",
			num: 2,
			bool: true,
			date: testDate,
			arr: [1, 2],
			obj: { a: "b" },
		});
	});

	it("converts input values to correct types", () => {
		const schema = createSearchParamsSchema({
			str: { type: "string", default: "" },
			num: { type: "number", default: 0 },
			bool: { type: "boolean", default: false },
			date: { type: "date", default: new Date() },
			arr: { type: "array", default: [], arrayType: 1 },
			obj: { type: "object", default: {}, objectType: { a: "" } },
		});
		const testDate = new Date("2023-06-15T10:30:00.000Z");
		const input = {
			str: 123,
			num: "5",
			bool: "true",
			date: testDate,
			arr: [3, 4],
			obj: { c: 4 },
		} as unknown;
		const result = schema["~standard"].validate(input);
		expect("value" in result && result.value).toEqual({
			str: "123",
			num: 5,
			bool: true,
			date: testDate,
			arr: [3, 4],
			obj: { c: 4 },
		});
	});

	it("returns issues for invalid number, array, date, and object inputs", () => {
		const schema = createSearchParamsSchema({
			foo: { type: "string" },
			bar: { type: "number" },
			baz: { type: "array" },
			qux: { type: "object" },
			date: { type: "date" },
		});

		// Invalid input
		const invalidResult = schema["~standard"].validate({
			foo: undefined,
			bar: "not-a-number",
			baz: "not-array",
			qux: "not-object",
			date: "invalid-date-string",
		}) as StandardSchemaV1.FailureResult;

		expect("issues" in invalidResult).toBe(true);
		expect(Array.isArray(invalidResult.issues)).toBe(true);
		expect(invalidResult.issues).toEqual(
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
				expect.objectContaining({
					message: expect.stringContaining("Invalid date"),
					path: ["date"],
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
		const invalid = schema["~standard"].validate({ page: "abc" }) as StandardSchemaV1.FailureResult;
		expect("issues" in invalid).toBe(true);
		expect(invalid.issues?.[0]?.message ?? "").toMatch(/Invalid number/);
		expect(invalid.issues?.[0]?.path ?? []).toEqual(["page"]);
	});

	it("handles missing defaults as null", () => {
		const schema = createSearchParamsSchema({
			foo: { type: "string" },
			bar: { type: "number" },
			baz: { type: "array" },
			qux: { type: "object" },
			date: { type: "date" },
		});
		const emptyResult = schema["~standard"].validate({});
		expect("value" in emptyResult && emptyResult.value).toEqual({
			foo: null,
			bar: null,
			baz: null,
			qux: null,
			date: null,
		});
	});

	it("preserves numeric strings as strings when schema expects string type", () => {
		const schema = createSearchParamsSchema({
			id: { type: "string", default: "" },
			page: { type: "number", default: 1 },
		});

		// Test that a numeric string stays as string for string type
		const result = schema["~standard"].validate({
			id: "123",
			page: 42,
		});

		expect("value" in result && result.value).toEqual({
			id: "123", // should stay as string
			page: 42, // should be number
		});
	});

	it("converts numeric strings to numbers only for number type", () => {
		const schema = createSearchParamsSchema({
			id: { type: "string", default: "" },
			count: { type: "number", default: 0 },
		});

		// When parsing from URL, numeric strings for number fields should be converted
		const result = schema["~standard"].validate({
			id: "789", // string field gets numeric string
			count: "456", // number field gets numeric string
		});

		expect("value" in result && result.value).toEqual({
			id: "789", // stays as string
			count: 456, // converted to number
		});
	});

	describe("Date type support", () => {
		it("validates Date objects correctly", () => {
			const schema = createSearchParamsSchema({
				startDate: { type: "date", default: new Date("2023-01-01T00:00:00Z") },
				endDate: { type: "date", default: new Date("2023-12-31T23:59:59Z") },
			});

			// Test with Date objects
			const result = schema["~standard"].validate({
				startDate: new Date("2023-06-15T10:30:00Z"),
				endDate: new Date("2023-06-20T18:00:00Z"),
			});

			expect(result).toHaveProperty("value");
			if ("value" in result) {
				expect(result.value.startDate).toBeInstanceOf(Date);
				expect(result.value.endDate).toBeInstanceOf(Date);
				expect(result.value.startDate.toISOString()).toBe("2023-06-15T10:30:00.000Z");
				expect(result.value.endDate.toISOString()).toBe("2023-06-20T18:00:00.000Z");
			}
		});

		it("validates ISO8601 strings correctly (simulating URL parameters)", () => {
			const schema = createSearchParamsSchema({
				startDate: { type: "date", default: new Date("2023-01-01T00:00:00Z") },
			});

			// Test with ISO8601 string (simulating URL parameter)
			const result = schema["~standard"].validate({
				startDate: "2023-06-15T10:30:00.000Z",
			});

			expect(result).toHaveProperty("value");
			if ("value" in result) {
				expect(result.value.startDate).toBeInstanceOf(Date);
				expect(result.value.startDate.toISOString()).toBe("2023-06-15T10:30:00.000Z");
			}
		});

		it("rejects invalid date strings", () => {
			const schema = createSearchParamsSchema({
				startDate: { type: "date", default: new Date("2023-01-01T00:00:00Z") },
			});

			// Test with invalid date string
			const result = schema["~standard"].validate({
				startDate: "invalid-date-string",
			});

			expect(result).toHaveProperty("issues");
			if ("issues" in result && result.issues) {
				expect(result.issues.length).toBeGreaterThan(0);
				expect(result.issues[0]?.message).toContain("Invalid date");
			}
		});

		it("uses default Date values when no input provided", () => {
			const defaultDate = new Date("2023-01-01T00:00:00Z");
			const schema = createSearchParamsSchema({
				startDate: { type: "date", default: defaultDate },
			});

			// Test with empty object (should use defaults)
			const result = schema["~standard"].validate({});

			expect(result).toHaveProperty("value");
			if ("value" in result) {
				expect(result.value.startDate).toBeInstanceOf(Date);
				expect(result.value.startDate.toISOString()).toBe(defaultDate.toISOString());
			}
		});
	});
});
