import { describe, test, vi } from "vitest";
import { Lazy } from "./Lazy.svelte.js";

describe("Lazy", () => {
	test("Lazy calls the initialization function only when current is initially accessed", () => {
		const init = vi.fn(() => 0);
		const counter = new Lazy(init);
		expect(init).toHaveBeenCalledTimes(0);

		counter.current;
		expect(init).toHaveBeenCalledTimes(1);
		expect(counter.current).toBe(0);

		counter.current;
		expect(init).toHaveBeenCalledTimes(1);
		expect(counter.current).toBe(0);
	});

	test("Lazy does not call the initialization function when current is set", () => {
		const init = vi.fn(() => 0);
		const counter = new Lazy(init);

		counter.current = 1;
		expect(init).toHaveBeenCalledTimes(0);
		expect(counter.current).toBe(1);
	});
});
