import { describe, vi } from "vitest";
import { Lazy } from "./Lazy.svelte.js";

describe("lazy", () => {
	it("calls the initialization function only when current is initially accessed", () => {
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

	it("does not call the initialization function when current is set", () => {
		const init = vi.fn(() => 0);
		const counter = new Lazy(init);

		counter.current = 1;
		expect(init).toHaveBeenCalledTimes(0);
		expect(counter.current).toBe(1);
	});
});
