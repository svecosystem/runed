import { describe, it, expect, vi } from "vitest";
import { createSearchParamsSchema, validateSearchParams } from "./use-search-params.svelte";
import * as lzString from "lz-string";

// Reuse the schema from the test page
const testSchema = createSearchParamsSchema({
	page: { type: "number", default: 1 },
	filter: { type: "string", default: "" },
	active: { type: "boolean", default: false },
	tags: { type: "array", default: [], arrayType: "" },
	config: { type: "object", default: {}, objectType: { theme: "" } },
});

// Helper to create URL objects
const createURL = (search: string) => new URL(`http://localhost:5173${search}`);

// Define expected default string once
const expectedDefaultsString = "page=1&filter=&active=false&tags=%5B%5D&config=%7B%7D";

describe("validateSearchParams", () => {
	it("parses standard URL parameters correctly, including defaults for missing", () => {
		const url = createURL("?page=3&filter=test&active=true");
		const params = validateSearchParams(url, testSchema);
		expect(params.get("page")).toBe("3");
		expect(params.get("filter")).toBe("test");
		expect(params.get("active")).toBe("true");
		// Expect default values for parameters not provided in URL
		expect(params.get("tags")).toBe("[]"); // Default [] stringified
		expect(params.get("config")).toBe("{}"); // Default {} stringified
	});

	it("returns default values when parameters are missing", () => {
		const url = createURL(""); // Empty search string
		const params = validateSearchParams(url, testSchema);
		// Expect the string representation of all defaults
		expect(params.toString()).toBe(expectedDefaultsString);
	});

	it("handles partially provided standard parameters, including defaults", () => {
		const url = createURL("?filter=partial");
		const params = validateSearchParams(url, testSchema);
		// Expect default values for missing parameters
		expect(params.get("page")).toBe("1"); // Default value
		expect(params.get("filter")).toBe("partial");
		expect(params.get("active")).toBe("false"); // Default value
		expect(params.get("tags")).toBe("[]");
		expect(params.get("config")).toBe("{}");
	});

	it("parses compressed parameters with default key (_data), including defaults", () => {
		const dataToCompress = { page: 5, filter: "compressed", active: true, tags: ["a", "b"] };
		const compressed = lzString.compressToEncodedURIComponent(JSON.stringify(dataToCompress));
		const url = createURL(`?_data=${compressed}`);
		const params = validateSearchParams(url, testSchema);

		expect(params.get("page")).toBe("5");
		expect(params.get("filter")).toBe("compressed");
		expect(params.get("active")).toBe("true");
		expect(params.get("tags")).toBe(JSON.stringify(["a", "b"]));
		// Expect default value for config, as it wasn't in compressed data
		expect(params.get("config")).toBe("{}"); // Default {} stringified
	});

	it("parses compressed parameters with custom key, including defaults", () => {
		const dataToCompress = { page: 10, filter: "custom_key" };
		const compressed = lzString.compressToEncodedURIComponent(JSON.stringify(dataToCompress));
		const url = createURL(`?custom_comp=${compressed}`);
		const params = validateSearchParams(url, testSchema, { compressedParamName: "custom_comp" });

		expect(params.get("page")).toBe("10");
		expect(params.get("filter")).toBe("custom_key");
		// Expect defaults for others
		expect(params.get("active")).toBe("false");
		expect(params.get("tags")).toBe("[]");
		expect(params.get("config")).toBe("{}");
	});

	it("prioritizes compressed data over standard parameters if both exist", () => {
		const dataToCompress = { page: 20, filter: "compressed_priority" };
		const compressed = lzString.compressToEncodedURIComponent(JSON.stringify(dataToCompress));
		const url = createURL(`?page=1&filter=standard&_data=${compressed}`); // Both present
		const params = validateSearchParams(url, testSchema);

		// Compressed values should win
		expect(params.get("page")).toBe("20");
		expect(params.get("filter")).toBe("compressed_priority");
		// Defaults for others
		expect(params.get("active")).toBe("false");
		expect(params.get("tags")).toBe("[]");
		expect(params.get("config")).toBe("{}");
	});

	it("handles invalid or missing compressed data by falling back to defaults", () => {
		// Invalid compressed string - decompress returns null, should not log error
		const urlInvalid = createURL("?_data=invalid%%%");
		const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const paramsInvalid = validateSearchParams(urlInvalid, testSchema);
		expect(paramsInvalid.toString()).toBe(expectedDefaultsString);
		// console.error is NOT called when decompress simply returns null
		expect(consoleErrorSpy).not.toHaveBeenCalled();
		consoleErrorSpy.mockRestore();

		// Missing compressed data (but key exists) - also should not log error
		const urlMissing = createURL("?_data=");
		const paramsMissing = validateSearchParams(urlMissing, testSchema);
		expect(paramsMissing.toString()).toBe(expectedDefaultsString);
	});

	it("handles JSON parsing errors in decompressed data by falling back to defaults", () => {
		const invalidJson = '{ page: 5, filter: "malformed }'; // Malformed JSON
		const compressed = lzString.compressToEncodedURIComponent(invalidJson);
		const url = createURL(`?_data=${compressed}`);
		const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const params = validateSearchParams(url, testSchema);
		// Expect defaults string on parse error
		expect(params.toString()).toBe(expectedDefaultsString);
		expect(consoleErrorSpy).toHaveBeenCalled();
		consoleErrorSpy.mockRestore();
	});

	it("handles different data types correctly in output URLSearchParams", () => {
		const data = {
			page: 99,
			filter: "types",
			active: false,
			tags: [1, "two"],
			config: { theme: "dark" },
		};
		const compressed = lzString.compressToEncodedURIComponent(JSON.stringify(data));
		const url = createURL(`?_data=${compressed}`);
		const params = validateSearchParams(url, testSchema);

		expect(params.get("page")).toBe("99"); // Number -> String
		expect(params.get("filter")).toBe("types"); // String -> String
		expect(params.get("active")).toBe("false"); // Boolean -> String
		expect(params.get("tags")).toBe(JSON.stringify([1, "two"])); // Array -> JSON String
		expect(params.get("config")).toBe(JSON.stringify({ theme: "dark" })); // Object -> JSON String
	});

	it("removes invalid parameters and uses defaults for them", () => {
		const schema = createSearchParamsSchema({
			page: { type: "number", default: 1 },
			filter: { type: "string", default: "" },
		});
		const url = new URL("http://localhost:5173/?page=abc&filter=foo");
		const params = validateSearchParams(url, schema);

		// page=abc is invalid, so should fallback to default
		expect(params.get("page")).toBe("1");
		// filter=foo is valid
		expect(params.get("filter")).toBe("foo");
		// Only valid/normalized params should be present
		expect(Array.from(params.keys()).sort()).toEqual(["filter", "page"]);
	});

	describe("fine-grained reactivity (selective parameter access)", () => {
		it("only accesses parameters defined in the schema for fine-grained reactivity", () => {
			// Create a mock URLSearchParams that tracks which parameters are accessed
			const accessedParams = new Set<string>();
			const mockSearchParams = {
				has: vi.fn((key: string) => {
					accessedParams.add(key);
					return key === "page" || key === "filter" || key === "nonSchemaParam";
				}),
				get: vi.fn((key: string) => {
					accessedParams.add(key);
					if (key === "page") return "2";
					if (key === "filter") return "test";
					if (key === "nonSchemaParam") return "should-not-be-accessed";
					return null;
				}),
				entries: vi.fn(() => {
					// This should NOT be called for selective extraction
					throw new Error("entries() should not be called for selective parameter access");
				}),
			};

			const schema = createSearchParamsSchema({
				page: { type: "number", default: 1 },
				filter: { type: "string", default: "" },
			});

			const url = {
				searchParams: mockSearchParams,
			};

			const params = validateSearchParams(url as unknown as URL, schema);

			// Should only access parameters that are in the schema
			expect(accessedParams).toEqual(new Set(["page", "filter"]));
			// Should NOT access nonSchemaParam
			expect(accessedParams).not.toContain("nonSchemaParam");
			// Should NOT call entries()
			expect(mockSearchParams.entries).not.toHaveBeenCalled();

			// Should return the correct values
			expect(params.get("page")).toBe("2");
			expect(params.get("filter")).toBe("test");
		});

		it("ignores non-schema parameters in URL without accessing them", () => {
			const schema = createSearchParamsSchema({
				page: { type: "number", default: 1 },
				filter: { type: "string", default: "" },
			});

			// URL contains both schema and non-schema parameters
			const url = createURL("?page=5&filter=hello&limit=10&sort=asc&other=value");
			const params = validateSearchParams(url, schema);

			// Should only return schema-defined parameters
			const paramKeys = Array.from(params.keys()).sort();
			expect(paramKeys).toEqual(["filter", "page"]);

			// Should have correct values for schema parameters
			expect(params.get("page")).toBe("5");
			expect(params.get("filter")).toBe("hello");

			// Should not include non-schema parameters
			expect(params.get("limit")).toBeNull();
			expect(params.get("sort")).toBeNull();
			expect(params.get("other")).toBeNull();
		});

		it("works with different schema types while maintaining selectivity", () => {
			const schema = createSearchParamsSchema({
				count: { type: "number", default: 0 },
				enabled: { type: "boolean", default: false },
				items: { type: "array", default: [], arrayType: "" },
				settings: { type: "object", default: {}, objectType: { theme: "" } },
			});

			// URL with both schema and non-schema parameters
			const url = createURL(
				'?count=42&enabled=true&items=["a","b"]&settings={"theme":"dark"}&extra=ignored&another=also-ignored'
			);
			const params = validateSearchParams(url, schema);

			// Should only contain schema parameters
			const paramKeys = Array.from(params.keys()).sort();
			expect(paramKeys).toEqual(["count", "enabled", "items", "settings"]);

			// Should have correct values
			expect(params.get("count")).toBe("42");
			expect(params.get("enabled")).toBe("true");
			expect(params.get("items")).toBe('["a","b"]');
			expect(params.get("settings")).toBe('{"theme":"dark"}');

			// Should not include non-schema parameters
			expect(params.get("extra")).toBeNull();
			expect(params.get("another")).toBeNull();
		});
	});
});
