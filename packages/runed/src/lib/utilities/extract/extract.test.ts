import { describe, expect, it } from "vitest";
import { extract } from "./extract.js";

describe("extract", () => {
	it("extract replaces undefined with the default value", () => {
		expect(extract(undefined, "default")).toBe("default");
		expect(extract<string | undefined>(() => undefined, "default")).toBe("default");
	});

	it("extract does not replace null with the default value", () => {
		expect(extract(null, "default")).toBe(null);
		expect(extract(() => null, "default")).toBe(null);
	});

	it("extract returns the value back without a default value", () => {
		expect(extract("value")).toBe("value");
		expect(extract(() => "value")).toBe("value");
	});
});
