import { describe, it, expect } from "vitest";
import { extractParamValues } from "./use-search-params.svelte.js";

describe("extractParamValues", () => {
	describe("basic type conversion", () => {
		it("converts boolean strings to boolean values", () => {
			const params = new URLSearchParams("active=true&disabled=false");
			const result = extractParamValues(params);

			expect(result.active).toBe(true);
			expect(result.disabled).toBe(false);
		});

		it("converts numeric strings to numbers when field is in numberFields", () => {
			const params = new URLSearchParams("page=5&limit=10&code=123");
			const numberFields = new Set(["page", "limit"]);
			const result = extractParamValues(params, numberFields);

			expect(result.page).toBe(5);
			expect(typeof result.page).toBe("number");
			expect(result.limit).toBe(10);
			expect(typeof result.limit).toBe("number");
			expect(result.code).toBe("123");
			expect(typeof result.code).toBe("string");
		});

		it("handles negative numbers", () => {
			const params = new URLSearchParams("temperature=-5");
			const numberFields = new Set(["temperature"]);
			const result = extractParamValues(params, numberFields);

			expect(result.temperature).toBe(-5);
		});

		it("handles decimal numbers", () => {
			const params = new URLSearchParams("price=19.99");
			const numberFields = new Set(["price"]);
			const result = extractParamValues(params, numberFields);

			expect(result.price).toBe(19.99);
		});

		it("keeps strings as strings when not in numberFields", () => {
			const params = new URLSearchParams("name=John&id=12345");
			const numberFields = new Set([]);
			const result = extractParamValues(params, numberFields);

			expect(result.name).toBe("John");
			expect(typeof result.name).toBe("string");
			expect(result.id).toBe("12345");
			expect(typeof result.id).toBe("string");
		});
	});

	describe("JSON parsing", () => {
		it("parses empty array notation", () => {
			const params = new URLSearchParams("tags=[]");
			const result = extractParamValues(params);

			expect(result.tags).toEqual([]);
			expect(Array.isArray(result.tags)).toBe(true);
		});

		it("parses empty object notation", () => {
			const params = new URLSearchParams("config={}");
			const result = extractParamValues(params);

			expect(result.config).toEqual({});
			expect(typeof result.config).toBe("object");
		});

		it("parses JSON arrays", () => {
			const params = new URLSearchParams('tags=["foo","bar","baz"]');
			const result = extractParamValues(params);

			expect(result.tags).toEqual(["foo", "bar", "baz"]);
			expect(Array.isArray(result.tags)).toBe(true);
		});

		it("parses JSON objects", () => {
			const params = new URLSearchParams('config={"theme":"dark","size":14}');
			const result = extractParamValues(params);

			expect(result.config).toEqual({ theme: "dark", size: 14 });
		});

		it("handles JSON parsing errors gracefully", () => {
			const params = new URLSearchParams('data={"invalid}');
			const result = extractParamValues(params);

			expect(typeof result.data).toBe("string");
		});
	});

	describe("comma handling (issue #367) - demonstrating the bug", () => {
		it("should NOT split string values with commas into arrays", () => {
			const params = new URLSearchParams("name=Smith, John&address=123 Main St, Apt 4");
			const result = extractParamValues(params);

			expect(result.name).toBe("Smith, John");
			expect(typeof result.name).toBe("string");
			expect(result.address).toBe("123 Main St, Apt 4");
			expect(typeof result.address).toBe("string");
		});

		it("should NOT split string with multiple commas into array", () => {
			const params = new URLSearchParams("address=123 Main St, Apt 4B, City, State, 12345");
			const result = extractParamValues(params);

			// Expected behavior: keep as single string
			expect(result.address).toBe("123 Main St, Apt 4B, City, State, 12345");
			expect(typeof result.address).toBe("string");
		});

		it("should NOT split email-like strings with comma into array", () => {
			const params = new URLSearchParams(
				"description=Contact us at: hello@example.com, support@example.com"
			);
			const result = extractParamValues(params);

			expect(result.description).toBe("Contact us at: hello@example.com, support@example.com");
			expect(typeof result.description).toBe("string");
		});

		it("should split comma-separated values ONLY for array fields (currently fails)", () => {
			const params = new URLSearchParams("name=Smith, John&tags=tag1,tag2,tag3");

			const result = extractParamValues(params, new Set(), new Set(["tags"]));

			expect(result.name).toBe("Smith, John");
			expect(typeof result.name).toBe("string");
			expect(Array.isArray(result.tags)).toBe(true);
		});

		it("should NOT treat CSV-like data as array by default", () => {
			const params = new URLSearchParams("data=column1,column2,column3");
			const result = extractParamValues(params, new Set(), new Set());

			expect(result.data).toBe("column1,column2,column3");
			expect(typeof result.data).toBe("string");
		});
	});

	describe("edge cases", () => {
		it("handles empty string values", () => {
			const params = new URLSearchParams("name=&filter=");
			const result = extractParamValues(params);

			expect(result.name).toBe("");
			expect(result.filter).toBe("");
		});

		it("handles special characters in values", () => {
			const params = new URLSearchParams("query=hello%20world&symbol=%24%26%23");
			const result = extractParamValues(params);

			expect(result.query).toBe("hello world");
			expect(result.symbol).toBe("$&#");
		});

		it("handles values with equals signs", () => {
			const params = new URLSearchParams("equation=x%3D5");
			const result = extractParamValues(params);

			expect(result.equation).toBe("x=5");
		});

		it("handles whitespace-only values", () => {
			const params = new URLSearchParams("spaces=%20%20%20");
			const result = extractParamValues(params);

			expect(result.spaces).toBe("   ");
		});

		it("handles unicode characters", () => {
			const params = new URLSearchParams("emoji=%F0%9F%98%80&chinese=%E4%BD%A0%E5%A5%BD");
			const result = extractParamValues(params);

			expect(result.emoji).toBe("😀");
			expect(result.chinese).toBe("你好");
		});

		it("handles single comma without surrounding values", () => {
			const params = new URLSearchParams("value=,");
			const result = extractParamValues(params);

			expect(result.value).toBe(",");
		});

		it("handles leading/trailing commas", () => {
			const params = new URLSearchParams("value=,leading&value2=trailing,");
			const result = extractParamValues(params);

			expect(result.value).toBe(",leading");
			expect(result.value2).toBe("trailing,");
		});
	});

	describe("mixed scenarios", () => {
		it("processes multiple different types correctly", () => {
			const params = new URLSearchParams('page=5&active=true&tags=["a","b"]&name=John Doe&empty=');
			const numberFields = new Set(["page"]);
			const result = extractParamValues(params, numberFields);

			expect(result.page).toBe(5);
			expect(result.active).toBe(true);
			expect(result.tags).toEqual(["a", "b"]);
			expect(result.name).toBe("John Doe");
			expect(result.empty).toBe("");
		});

		it("name with comma should NOT be split even when number field specified", () => {
			const params = new URLSearchParams("page=3&name=Smith, John");
			const numberFields = new Set(["page"]);
			const result = extractParamValues(params, numberFields);

			expect(result.page).toBe(3);
			// Expected: name should remain as string
			expect(result.name).toBe("Smith, John");
			expect(typeof result.name).toBe("string");
		});
	});

	describe("fallback comma-separated array format (should only work for array fields)", () => {
		it("does NOT split comma-separated values when field is not marked as array", () => {
			const params = new URLSearchParams("tags=red,blue,green");
			const result = extractParamValues(params); // No arrayFields specified

			// New behavior: keeps as string when not an array field
			expect(result.tags).toBe("red,blue,green");
			expect(typeof result.tags).toBe("string");
		});

		it("splits comma-separated values ONLY when field is marked as array", () => {
			const params = new URLSearchParams("tags=red,%20blue,%20%20green");
			const arrayFields = new Set(["tags"]);
			const result = extractParamValues(params, new Set(), arrayFields);

			expect(result.tags).toEqual(["red", " blue", "  green"]);
			expect(Array.isArray(result.tags)).toBe(true);
		});

		it("splits numeric comma-separated values into array only for array fields", () => {
			const params = new URLSearchParams("ids=1,2,3,4,5");
			const arrayFields = new Set(["ids"]);
			const result = extractParamValues(params, new Set(), arrayFields);

			expect(result.ids).toEqual(["1", "2", "3", "4", "5"]);
			expect(Array.isArray(result.ids)).toBe(true);
		});

		it("keeps comma-separated values as string when NOT an array field", () => {
			const params = new URLSearchParams("ids=1,2,3,4,5");
			const result = extractParamValues(params);

			expect(result.ids).toBe("1,2,3,4,5");
			expect(typeof result.ids).toBe("string");
		});
	});
});
