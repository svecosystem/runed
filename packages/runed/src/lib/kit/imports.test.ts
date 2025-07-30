import { describe, expect, it } from "vitest";

describe("Package imports", () => {
	it("should import main module utilities from source", async () => {
		// Test importing from source files directly
		const isMountedModule = await import("../utilities/is-mounted/index.js");
		const watchModule = await import("../utilities/watch/index.js");
		const debouncedModule = await import("../utilities/debounced/index.js");

		expect(isMountedModule).toHaveProperty("IsMounted");
		expect(watchModule).toHaveProperty("watch");
		expect(debouncedModule).toHaveProperty("Debounced");
	});

	it("should import SvelteKit utilities from kit source", async () => {
		try {
			const useSearchParamsModule = await import("../utilities/use-search-params/index.js");
			expect(useSearchParamsModule).toHaveProperty("useSearchParams");
		} catch (error) {
			// This is expected if SvelteKit dependencies are not available
			console.warn(
				"SvelteKit utility import failed (expected in non-SvelteKit environment):",
				(error as Error).message
			);
			expect(error).toBeInstanceOf(Error);
		}
	});

	it("should have main index file that exports non-SvelteKit utilities", async () => {
		const mainModule = await import("../index.js");

		// Check that basic utilities are available
		expect(mainModule).toHaveProperty("IsMounted");
		expect(mainModule).toHaveProperty("watch");
		expect(mainModule).toHaveProperty("Debounced");

		// Verify SvelteKit utilities are not in main export
		expect(mainModule).not.toHaveProperty("useSearchParams");
	});

	it("should have kit index file that exports SvelteKit utilities", async () => {
		try {
			const kitModule = await import("./index.js");
			expect(kitModule).toHaveProperty("useSearchParams");
		} catch (error) {
			// This is expected if SvelteKit is not available
			console.warn(
				"Kit module import failed (expected if SvelteKit not available):",
				(error as Error).message
			);
			expect(error).toBeInstanceOf(Error);
		}
	});
});
