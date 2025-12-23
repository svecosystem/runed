import { describe, vi } from "vitest";
import { LazyState } from "./lazy-state.svelte.js";

describe("LazyState", () => {
	it("calls the factory only when `current` is first accessed", () => {
		const factory = vi.fn(() => 0);
		const counter = new LazyState(factory);
		expect(counter.initialized).toBe(false);
		expect(factory).toHaveBeenCalledTimes(0);

		expect(counter.current).toBe(0);
		expect(counter.initialized).toBe(true);
		expect(factory).toHaveBeenCalledTimes(1);

		expect(counter.current).toBe(0);
		expect(counter.initialized).toBe(true);
		expect(factory).toHaveBeenCalledTimes(1);
	});

	it("does not call the factory when `current` is set", () => {
		const factory = vi.fn(() => 0);
		const counter = new LazyState(factory);
		counter.current = 1;
		expect(counter.current).toBe(1);
		expect(counter.initialized).toBe(true);
		expect(factory).toHaveBeenCalledTimes(0);
	});

	it("is reactive", () => {
		const counter = new LazyState(() => 1);
		const doubled = $derived(counter.current * 2);
		const message = $derived(counter.initialized ? "initialized" : "not initialized");
		expect(message).toBe("not initialized");

		expect(doubled).toBe(2);
		expect(message).toBe("initialized");

		counter.current = 2;
		expect(doubled).toBe(4);
		expect(message).toBe("initialized");
	});
});
