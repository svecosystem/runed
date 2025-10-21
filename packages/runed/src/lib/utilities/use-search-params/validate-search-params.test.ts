import { describe, it, expect, vi, beforeAll } from "vitest";
import { createSearchParamsSchema, validateSearchParams } from "./use-search-params.svelte.js";
import * as lzString from "lz-string";

// Set timezone to EDT (America/New_York) for consistent test results
beforeAll(() => {
	if (!process.env.TZ) {
		process.env.TZ = "America/New_York";
	}
});

// Reuse the schema from the test page
const testSchema = createSearchParamsSchema({
	page: { type: "number", default: 1 },
	filter: { type: "string", default: "" },
	active: { type: "boolean", default: false },
	tags: { type: "array", default: [], arrayType: "" },
	config: { type: "object", default: {}, objectType: { theme: "" } },
	startDate: { type: "date", default: new Date("2023-01-01T00:00:00Z") },
	endDate: { type: "date", default: new Date("2023-12-31T23:59:59Z") },
});

// Helper to create URL objects
const createURL = (search: string) => new URL(`http://localhost:5173${search}`);

// Define expected default string once
const expectedDefaultsString =
	"page=1&filter=&active=false&tags=%5B%5D&config=%7B%7D&startDate=2023-01-01T00%3A00%3A00.000Z&endDate=2023-12-31T23%3A59%3A59.000Z";

describe("validateSearchParams", () => {
	it("parses standard URL parameters correctly, including defaults for missing", () => {
		const url = createURL("?page=3&filter=test&active=true");
		const { searchParams, data } = validateSearchParams(url, testSchema);

		// Check URLSearchParams
		expect(searchParams.get("page")).toBe("3");
		expect(searchParams.get("filter")).toBe("test");
		expect(searchParams.get("active")).toBe("true");
		// Expect default values for parameters not provided in URL
		expect(searchParams.get("tags")).toBe("[]"); // Default [] stringified
		expect(searchParams.get("config")).toBe("{}"); // Default {} stringified

		// Check typed data object
		expect(data.page).toBe(3); // number
		expect(data.filter).toBe("test"); // string
		expect(data.active).toBe(true); // boolean
		expect(data.tags).toEqual([]); // array (default)
		expect(data.config).toEqual({}); // object (default)
	});

	it("returns default values when parameters are missing", () => {
		const url = createURL(""); // Empty search string
		const { searchParams, data } = validateSearchParams(url, testSchema);

		// Check URLSearchParams - expect the string representation of all defaults
		expect(searchParams.toString()).toBe(expectedDefaultsString);

		// Check typed data object - expect default values
		expect(data.page).toBe(1); // number default
		expect(data.filter).toBe(""); // string default
		expect(data.active).toBe(false); // boolean default
		expect(data.tags).toEqual([]); // array default
		expect(data.config).toEqual({}); // object default
	});

	it("handles partially provided standard parameters, including defaults", () => {
		const url = createURL("?filter=partial");
		const { searchParams, data } = validateSearchParams(url, testSchema);

		// Check URLSearchParams - expect default values for missing parameters
		expect(searchParams.get("page")).toBe("1"); // Default value
		expect(searchParams.get("filter")).toBe("partial");
		expect(searchParams.get("active")).toBe("false"); // Default value
		expect(searchParams.get("tags")).toBe("[]");
		expect(searchParams.get("config")).toBe("{}");

		// Check typed data object
		expect(data.page).toBe(1); // number default
		expect(data.filter).toBe("partial"); // string provided
		expect(data.active).toBe(false); // boolean default
		expect(data.tags).toEqual([]); // array default
		expect(data.config).toEqual({}); // object default
	});

	it("parses compressed parameters with default key (_data), including defaults", () => {
		const dataToCompress = { page: 5, filter: "compressed", active: true, tags: ["a", "b"] };
		const compressed = lzString.compressToEncodedURIComponent(JSON.stringify(dataToCompress));
		const url = createURL(`?_data=${compressed}`);
		const { searchParams, data } = validateSearchParams(url, testSchema);

		// Check URLSearchParams
		expect(searchParams.get("page")).toBe("5");
		expect(searchParams.get("filter")).toBe("compressed");
		expect(searchParams.get("active")).toBe("true");
		expect(searchParams.get("tags")).toBe(JSON.stringify(["a", "b"]));
		// Expect default value for config, as it wasn't in compressed data
		expect(searchParams.get("config")).toBe("{}"); // Default {} stringified

		// Check typed data object
		expect(data.page).toBe(5); // number
		expect(data.filter).toBe("compressed"); // string
		expect(data.active).toBe(true); // boolean
		expect(data.tags).toEqual(["a", "b"]); // array
		expect(data.config).toEqual({}); // object default
	});

	it("parses compressed parameters with custom key, including defaults", () => {
		const dataToCompress = { page: 10, filter: "custom_key" };
		const compressed = lzString.compressToEncodedURIComponent(JSON.stringify(dataToCompress));
		const url = createURL(`?custom_comp=${compressed}`);
		const { searchParams, data } = validateSearchParams(url, testSchema, {
			compressedParamName: "custom_comp",
		});

		// Check URLSearchParams
		expect(searchParams.get("page")).toBe("10");
		expect(searchParams.get("filter")).toBe("custom_key");
		// Expect defaults for others
		expect(searchParams.get("active")).toBe("false");
		expect(searchParams.get("tags")).toBe("[]");
		expect(searchParams.get("config")).toBe("{}");

		// Check typed data object
		expect(data.page).toBe(10); // number
		expect(data.filter).toBe("custom_key"); // string
		expect(data.active).toBe(false); // boolean default
		expect(data.tags).toEqual([]); // array default
		expect(data.config).toEqual({}); // object default
	});

	it("prioritizes compressed data over standard parameters if both exist", () => {
		const dataToCompress = { page: 20, filter: "compressed_priority" };
		const compressed = lzString.compressToEncodedURIComponent(JSON.stringify(dataToCompress));
		const url = createURL(`?page=1&filter=standard&_data=${compressed}`); // Both present
		const { searchParams, data } = validateSearchParams(url, testSchema);

		// Check URLSearchParams - compressed values should win
		expect(searchParams.get("page")).toBe("20");
		expect(searchParams.get("filter")).toBe("compressed_priority");
		// Defaults for others
		expect(searchParams.get("active")).toBe("false");
		expect(searchParams.get("tags")).toBe("[]");
		expect(searchParams.get("config")).toBe("{}");

		// Check typed data object - compressed values should win
		expect(data.page).toBe(20); // number from compressed
		expect(data.filter).toBe("compressed_priority"); // string from compressed
		expect(data.active).toBe(false); // boolean default
		expect(data.tags).toEqual([]); // array default
		expect(data.config).toEqual({}); // object default
	});

	it("handles invalid or missing compressed data by falling back to defaults", () => {
		// Invalid compressed string - decompress returns null, should not log error
		const urlInvalid = createURL("?_data=invalid%%%");
		const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const { searchParams: paramsInvalid, data: dataInvalid } = validateSearchParams(
			urlInvalid,
			testSchema
		);
		expect(paramsInvalid.toString()).toBe(expectedDefaultsString);
		// console.error is NOT called when decompress simply returns null
		expect(consoleErrorSpy).not.toHaveBeenCalled();
		consoleErrorSpy.mockRestore();

		// Check typed data object defaults
		expect(dataInvalid.page).toBe(1);
		expect(dataInvalid.filter).toBe("");
		expect(dataInvalid.active).toBe(false);
		expect(dataInvalid.tags).toEqual([]);
		expect(dataInvalid.config).toEqual({});

		// Missing compressed data (but key exists) - also should not log error
		const urlMissing = createURL("?_data=");
		const { searchParams: paramsMissing, data: dataMissing } = validateSearchParams(
			urlMissing,
			testSchema
		);
		expect(paramsMissing.toString()).toBe(expectedDefaultsString);

		// Check typed data object defaults for missing case too
		expect(dataMissing.page).toBe(1);
		expect(dataMissing.filter).toBe("");
		expect(dataMissing.active).toBe(false);
		expect(dataMissing.tags).toEqual([]);
		expect(dataMissing.config).toEqual({});
	});

	it("handles JSON parsing errors in decompressed data by falling back to defaults", () => {
		const invalidJson = '{ page: 5, filter: "malformed }'; // Malformed JSON
		const compressed = lzString.compressToEncodedURIComponent(invalidJson);
		const url = createURL(`?_data=${compressed}`);
		const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const { searchParams, data } = validateSearchParams(url, testSchema);

		// Check URLSearchParams - expect defaults string on parse error
		expect(searchParams.toString()).toBe(expectedDefaultsString);
		expect(consoleErrorSpy).toHaveBeenCalled();
		consoleErrorSpy.mockRestore();

		// Check typed data object - expect defaults on parse error
		expect(data.page).toBe(1);
		expect(data.filter).toBe("");
		expect(data.active).toBe(false);
		expect(data.tags).toEqual([]);
		expect(data.config).toEqual({});
	});

	it("handles different data types correctly in output URLSearchParams", () => {
		const testData = {
			page: 99,
			filter: "types",
			active: false,
			tags: [1, "two"],
			config: { theme: "dark" },
		};
		const compressed = lzString.compressToEncodedURIComponent(JSON.stringify(testData));
		const url = createURL(`?_data=${compressed}`);
		const { searchParams, data } = validateSearchParams(url, testSchema);

		// Check URLSearchParams
		expect(searchParams.get("page")).toBe("99"); // Number -> String
		expect(searchParams.get("filter")).toBe("types"); // String -> String
		expect(searchParams.get("active")).toBe("false"); // Boolean -> String
		expect(searchParams.get("tags")).toBe(JSON.stringify([1, "two"])); // Array -> JSON String
		expect(searchParams.get("config")).toBe(JSON.stringify({ theme: "dark" })); // Object -> JSON String

		// Check typed data object - should have correct native types
		expect(data.page).toBe(99); // number
		expect(data.filter).toBe("types"); // string
		expect(data.active).toBe(false); // boolean
		expect(data.tags).toEqual([1, "two"]); // array
		expect(data.config).toEqual({ theme: "dark" }); // object
	});

	it("removes invalid parameters and uses defaults for them", () => {
		const schema = createSearchParamsSchema({
			page: { type: "number", default: 1 },
			filter: { type: "string", default: "" },
		});
		const url = new URL("http://localhost:5173/?page=abc&filter=foo");
		const { searchParams, data } = validateSearchParams(url, schema);

		// Check URLSearchParams
		// page=abc is invalid, so should fallback to default
		expect(searchParams.get("page")).toBe("1");
		// filter=foo is valid
		expect(searchParams.get("filter")).toBe("foo");
		// Only valid/normalized params should be present
		expect(Array.from(searchParams.keys()).sort()).toEqual(["filter", "page"]);

		// Check typed data object
		expect(data.page).toBe(1); // number default (invalid "abc" -> 1)
		expect(data.filter).toBe("foo"); // string valid
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

			const { searchParams, data } = validateSearchParams(url as unknown as URL, schema);

			// Should access schema parameters plus the compressed data check
			expect(accessedParams).toEqual(new Set(["_data", "page", "filter"]));
			// Should NOT access nonSchemaParam
			expect(accessedParams).not.toContain("nonSchemaParam");
			// Should NOT call entries()
			expect(mockSearchParams.entries).not.toHaveBeenCalled();

			// Should return the correct values in URLSearchParams
			expect(searchParams.get("page")).toBe("2");
			expect(searchParams.get("filter")).toBe("test");

			// Should return the correct typed values
			expect(data.page).toBe(2); // number (converted from string "2")
			expect(data.filter).toBe("test"); // string
		});

		it("ignores non-schema parameters in URL without accessing them", () => {
			const schema = createSearchParamsSchema({
				page: { type: "number", default: 1 },
				filter: { type: "string", default: "" },
			});

			// URL contains both schema and non-schema parameters
			const url = createURL("?page=5&filter=hello&limit=10&sort=asc&other=value");
			const { searchParams, data } = validateSearchParams(url, schema);

			// Check URLSearchParams - should only return schema-defined parameters
			const paramKeys = Array.from(searchParams.keys()).sort();
			expect(paramKeys).toEqual(["filter", "page"]);

			// Should have correct values for schema parameters
			expect(searchParams.get("page")).toBe("5");
			expect(searchParams.get("filter")).toBe("hello");

			// Should not include non-schema parameters
			expect(searchParams.get("limit")).toBeNull();
			expect(searchParams.get("sort")).toBeNull();
			expect(searchParams.get("other")).toBeNull();

			// Check typed data object - should only have schema-defined properties
			expect(Object.keys(data).sort()).toEqual(["filter", "page"]);
			expect(data.page).toBe(5); // number
			expect(data.filter).toBe("hello"); // string

			// Should not have non-schema properties
			expect("limit" in data).toBe(false);
			expect("sort" in data).toBe(false);
			expect("other" in data).toBe(false);
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
			const { searchParams, data } = validateSearchParams(url, schema);

			// Check URLSearchParams - should only contain schema parameters
			const paramKeys = Array.from(searchParams.keys()).sort();
			expect(paramKeys).toEqual(["count", "enabled", "items", "settings"]);

			// Should have correct values
			expect(searchParams.get("count")).toBe("42");
			expect(searchParams.get("enabled")).toBe("true");
			expect(searchParams.get("items")).toBe('["a","b"]');
			expect(searchParams.get("settings")).toBe('{"theme":"dark"}');

			// Should not include non-schema parameters
			expect(searchParams.get("extra")).toBeNull();
			expect(searchParams.get("another")).toBeNull();

			// Check typed data object
			expect(Object.keys(data).sort()).toEqual(["count", "enabled", "items", "settings"]);
			expect(data.count).toBe(42); // number
			expect(data.enabled).toBe(true); // boolean
			expect(data.items).toEqual(["a", "b"]); // array
			expect(data.settings).toEqual({ theme: "dark" }); // object

			// Should not have non-schema properties
			expect("extra" in data).toBe(false);
			expect("another" in data).toBe(false);
		});
	});

	describe("number field detection for type conversion (issue #320)", () => {
		it("converts numeric strings to numbers for number fields but preserves them for string fields", () => {
			const schema = createSearchParamsSchema({
				id: { type: "string", default: "" }, // string field
				page: { type: "number", default: 1 }, // number field
				code: { type: "string", default: "" }, // another string field
			});

			// URL with numeric-looking values for both string and number fields
			const url = createURL("?id=123&page=42&code=456");
			const { searchParams, data } = validateSearchParams(url, schema);

			// Check that values are preserved correctly in URLSearchParams
			expect(searchParams.get("id")).toBe("123");
			expect(searchParams.get("page")).toBe("42");
			expect(searchParams.get("code")).toBe("456");

			// Check typed data object - numbers should be converted, strings should stay strings
			expect(typeof data.id).toBe("string");
			expect(data.id).toBe("123"); // stays as string (even though it looks numeric)
			expect(typeof data.page).toBe("number");
			expect(data.page).toBe(42); // converted to number
			expect(typeof data.code).toBe("string");
			expect(data.code).toBe("456"); // stays as string
		});

		it("handles negative numbers correctly for number fields", () => {
			const schema = createSearchParamsSchema({
				temperature: { type: "number", default: 0 },
				zipCode: { type: "string", default: "" },
			});

			const url = createURL("?temperature=-5&zipCode=-90210");
			const { data } = validateSearchParams(url, schema);

			// Check typed data
			expect(data.temperature).toBe(-5); // negative number
			expect(typeof data.temperature).toBe("number");
			expect(data.zipCode).toBe("-90210"); // stays as string
			expect(typeof data.zipCode).toBe("string");
		});

		it("handles decimal numbers correctly for number fields", () => {
			const schema = createSearchParamsSchema({
				price: { type: "number", default: 0 },
				version: { type: "string", default: "" },
			});

			const url = createURL("?price=19.99&version=1.2.3");
			const { data } = validateSearchParams(url, schema);

			// Check typed data
			expect(data.price).toBe(19.99); // decimal number
			expect(typeof data.price).toBe("number");
			expect(data.version).toBe("1.2.3"); // stays as string
			expect(typeof data.version).toBe("string");
		});

		it("handles zero correctly for both number and string fields", () => {
			const schema = createSearchParamsSchema({
				count: { type: "number", default: 1 },
				code: { type: "string", default: "" },
			});

			const url = createURL("?count=0&code=0");
			const { data } = validateSearchParams(url, schema);

			// Check typed data
			expect(data.count).toBe(0); // number zero
			expect(typeof data.count).toBe("number");
			expect(data.code).toBe("0"); // string zero
			expect(typeof data.code).toBe("string");
		});

		it("preserves string IDs that look like numbers (common use case)", () => {
			const schema = createSearchParamsSchema({
				userId: { type: "string", default: "455" },
				postId: { type: "string", default: "123" },
				page: { type: "number", default: 1 },
			});

			// Common scenario: IDs from database might be numeric but should stay as strings
			const url = createURL("?userId=12345&postId=67890&page=2");
			const { data } = validateSearchParams(url, schema);

			// Check that IDs stay as strings
			expect(data.userId).toBe("12345");
			expect(typeof data.userId).toBe("string");
			expect(data.postId).toBe("67890");
			expect(typeof data.postId).toBe("string");
			// But page should be a number
			expect(data.page).toBe(2);
			expect(typeof data.page).toBe("number");
		});
	});

	describe("Date parameter support", () => {
		it("parses ISO8601 date strings from URL correctly", () => {
			const url = createURL(
				"?page=3&filter=test&startDate=2023-06-15T10:30:00.000Z&endDate=2023-06-20T18:00:00.000Z"
			);
			const { searchParams, data } = validateSearchParams(url, testSchema);

			// Check URLSearchParams
			expect(searchParams.get("page")).toBe("3");
			expect(searchParams.get("filter")).toBe("test");
			expect(searchParams.get("startDate")).toBe("2023-06-15T10:30:00.000Z");
			expect(searchParams.get("endDate")).toBe("2023-06-20T18:00:00.000Z");

			// Check typed data object
			expect(data.page).toBe(3); // number
			expect(data.filter).toBe("test"); // string
			expect(data.startDate).toBeInstanceOf(Date);
			expect(data.endDate).toBeInstanceOf(Date);
			expect(data.startDate.toISOString()).toBe("2023-06-15T10:30:00.000Z");
			expect(data.endDate.toISOString()).toBe("2023-06-20T18:00:00.000Z");
		});

		it("returns default Date values when dates are missing from URL", () => {
			const url = createURL("?page=5&filter=test"); // No date parameters
			const { searchParams, data } = validateSearchParams(url, testSchema);

			// Check URLSearchParams - should include defaults
			expect(searchParams.get("page")).toBe("5");
			expect(searchParams.get("filter")).toBe("test");
			expect(searchParams.get("startDate")).toBe("2023-01-01T00:00:00.000Z");
			expect(searchParams.get("endDate")).toBe("2023-12-31T23:59:59.000Z");

			// Check typed data object
			expect(data.page).toBe(5);
			expect(data.filter).toBe("test");
			expect(data.startDate).toBeInstanceOf(Date);
			expect(data.endDate).toBeInstanceOf(Date);
			expect(data.startDate.toISOString()).toBe("2023-01-01T00:00:00.000Z");
			expect(data.endDate.toISOString()).toBe("2023-12-31T23:59:59.000Z");
		});

		it("handles invalid date strings by falling back to defaults", () => {
			const url = createURL("?endDate=invalid-date");
			const { searchParams, data } = validateSearchParams(url, testSchema);

			// Check URLSearchParams - invalid date should use default
			expect(searchParams.get("page")).toBe("1"); // default
			expect(searchParams.get("filter")).toBe(""); // default
			expect(searchParams.get("startDate")).toBe("2023-01-01T00:00:00.000Z"); // default (invalid input)
			expect(searchParams.get("endDate")).toBe("2023-12-31T23:59:59.000Z"); // default (invalid input)

			// Check typed data object
			expect(data.page).toBe(1);
			expect(data.filter).toBe("");
			expect(data.startDate).toBeInstanceOf(Date);
			expect(data.endDate).toBeInstanceOf(Date);
			expect(data.startDate.toISOString()).toBe("2023-01-01T00:00:00.000Z");
			expect(data.endDate.toISOString()).toBe("2023-12-31T23:59:59.000Z");
		});

		it("handles compressed parameters with dates", () => {
			const dataToCompress = {
				page: 5,
				filter: "compressed",
				startDate: new Date("2023-06-15T10:30:00.000Z"),
				endDate: new Date("2023-06-20T18:00:00.000Z"),
			};
			const compressed = lzString.compressToEncodedURIComponent(
				JSON.stringify({
					...dataToCompress,
					startDate: dataToCompress.startDate.toISOString(), // Dates are serialized as ISO strings
					endDate: dataToCompress.endDate.toISOString(),
				})
			);
			const url = createURL(`?_data=${compressed}`);
			const { searchParams, data } = validateSearchParams(url, testSchema);

			// Check URLSearchParams
			expect(searchParams.get("page")).toBe("5");
			expect(searchParams.get("filter")).toBe("compressed");
			expect(searchParams.get("startDate")).toBe("2023-06-15T10:30:00.000Z");
			expect(searchParams.get("endDate")).toBe("2023-06-20T18:00:00.000Z");

			// Check typed data object
			expect(data.page).toBe(5);
			expect(data.filter).toBe("compressed");
			expect(data.startDate).toBeInstanceOf(Date);
			expect(data.endDate).toBeInstanceOf(Date);
			expect(data.startDate.toISOString()).toBe("2023-06-15T10:30:00.000Z");
			expect(data.endDate.toISOString()).toBe("2023-06-20T18:00:00.000Z");
		});

		it("respects dateFormats option for date-only serialization", () => {
			// Use date-only format in URL (parsed as UTC midnight)
			const url = createURL("?startDate=2023-06-15&endDate=2023-06-20T18:00:00.000Z");
			const { searchParams, data } = validateSearchParams(url, testSchema, {
				dateFormats: {
					startDate: "date", // Date-only format
					endDate: "datetime", // Full datetime format
				},
			});

			// startDate should be serialized as YYYY-MM-DD (date-only format)
			expect(searchParams.get("startDate")).toBe("2023-06-15");
			// endDate should be serialized as full ISO8601 (datetime)
			expect(searchParams.get("endDate")).toBe("2023-06-20T18:00:00.000Z");

			// Check that startDate was parsed correctly
			expect(data.startDate).toBeInstanceOf(Date);
			// Date-only strings like "2023-06-15" are parsed as UTC midnight
			expect(data.startDate.toISOString()).toBe("2023-06-15T00:00:00.000Z");
		});

		it("uses datetime format by default when dateFormats not specified", () => {
			const url = createURL("?startDate=2023-06-15T10:30:00.000Z");
			const { searchParams, data } = validateSearchParams(url, testSchema);

			// Should use full ISO8601 by default (datetime format)
			expect(searchParams.get("startDate")).toBe("2023-06-15T10:30:00.000Z");

			// Check that the date was parsed correctly
			expect(data.startDate).toBeInstanceOf(Date);
			expect(data.startDate.toISOString()).toBe("2023-06-15T10:30:00.000Z");
		});
	});
});
