import { describe, expect, vi } from "vitest";
import { Interval } from "./interval.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

describe("Interval", () => {
	testWithEffect("Increments counter at specified interval", async () => {
		const interval = new Interval(100);

		expect(interval.counter).toBe(0);

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(interval.counter).toBe(1);

		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(interval.counter).toBe(2);

		interval.pause();
	});

	testWithEffect("Does not start immediately when immediate is false", async () => {
		const interval = new Interval(100, { immediate: false });

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(interval.counter).toBe(0);

		interval.resume();
		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(interval.counter).toBe(1);

		interval.pause();
	});

	testWithEffect("Pause stops the interval", async () => {
		const interval = new Interval(100);

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(interval.counter).toBe(1);

		interval.pause();
		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(interval.counter).toBe(1);
	});

	testWithEffect("Resume restarts the interval", async () => {
		const interval = new Interval(100);

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(interval.counter).toBe(1);

		interval.pause();
		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(interval.counter).toBe(1);

		interval.resume();
		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(interval.counter).toBe(2);

		interval.pause();
	});

	testWithEffect("Reset sets counter to 0", async () => {
		const interval = new Interval(100);

		await new Promise((resolve) => setTimeout(resolve, 250));
		expect(interval.counter).toBeGreaterThan(0);

		interval.reset();
		expect(interval.counter).toBe(0);

		interval.pause();
	});

	testWithEffect("Callback is called with counter value", async () => {
		const callback = vi.fn();
		const interval = new Interval(100, { callback });

		expect(callback).not.toHaveBeenCalled();

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(1);

		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(callback).toHaveBeenCalledTimes(2);
		expect(callback).toHaveBeenCalledWith(2);

		interval.pause();
	});

	testWithEffect("isActive reflects interval state", async () => {
		const interval = new Interval(100, { immediate: false });

		expect(interval.isActive).toBe(false);

		interval.resume();
		expect(interval.isActive).toBe(true);

		interval.pause();
		expect(interval.isActive).toBe(false);
	});

	testWithEffect("Resume does nothing if already active", async () => {
		const interval = new Interval(100);

		expect(interval.isActive).toBe(true);

		await new Promise((resolve) => setTimeout(resolve, 50));
		interval.resume(); // Should do nothing since already active

		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(interval.counter).toBe(1);

		interval.pause();
	});

	testWithEffect("Pause does nothing if already paused", async () => {
		const interval = new Interval(100, { immediate: false });

		expect(interval.isActive).toBe(false);
		interval.pause(); // Should do nothing since already paused
		expect(interval.isActive).toBe(false);
	});

	testWithEffect("Works with reactive interval getter", async () => {
		let intervalValue = $state(100);
		const interval = new Interval(() => intervalValue);

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(interval.counter).toBe(1);

		// Changing the interval value doesn't automatically restart
		// Need to pause/resume to pick up new interval value
		intervalValue = 200;
		interval.pause();
		interval.resume();

		await new Promise((resolve) => setTimeout(resolve, 150));
		// Should not have incremented yet with the new longer interval
		expect(interval.counter).toBe(1);

		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(interval.counter).toBe(2);

		interval.pause();
	});

	testWithEffect("Cleans up on effect disposal", async () => {
		let interval: Interval;
		let disposed = false;

		const dispose = $effect.root(() => {
			interval = new Interval(100);
			return () => {
				disposed = true;
			};
		});

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(interval!.counter).toBe(1);

		dispose();
		expect(disposed).toBe(true);

		await new Promise((resolve) => setTimeout(resolve, 300));
		expect(interval!.counter).toBe(1); // Should not increase after disposal
	});

	testWithEffect("Default interval is 1000ms", async () => {
		const interval = new Interval();

		expect(interval.counter).toBe(0);

		// Should not increment in 500ms with default 1000ms interval
		await new Promise((resolve) => setTimeout(resolve, 500));
		expect(interval.counter).toBe(0);

		interval.pause();
	});
});
