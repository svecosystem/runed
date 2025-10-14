import { describe, expect, vi } from "vitest";
import { useInterval } from "./use-interval.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

describe("useInterval", () => {
	testWithEffect("Calls callback at specified interval", async () => {
		const callback = vi.fn();
		const { pause } = useInterval(100, { callback });

		expect(callback).not.toHaveBeenCalled();

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(1);

		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(callback).toHaveBeenCalledTimes(2);
		expect(callback).toHaveBeenCalledWith(2);

		pause();
	});

	testWithEffect("Does not start immediately when immediate is false", async () => {
		const callback = vi.fn();
		const { resume, pause } = useInterval(100, { immediate: false, callback });

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).not.toHaveBeenCalled();

		resume();
		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).toHaveBeenCalledTimes(1);

		pause();
	});

	testWithEffect("Pause stops the interval", async () => {
		const callback = vi.fn();
		const { pause } = useInterval(100, { callback });

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).toHaveBeenCalledTimes(1);

		pause();
		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).toHaveBeenCalledTimes(1);
	});

	testWithEffect("Resume restarts the interval", async () => {
		const callback = vi.fn();
		const { pause, resume } = useInterval(100, { callback });

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).toHaveBeenCalledTimes(1);

		pause();
		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).toHaveBeenCalledTimes(1);

		resume();
		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).toHaveBeenCalledTimes(2);

		pause();
	});

	testWithEffect("immediateCallback executes callback on resume", async () => {
		const callback = vi.fn();
		const { pause, resume } = useInterval(100, {
			immediate: false,
			immediateCallback: true,
			callback,
		});

		expect(callback).not.toHaveBeenCalled();

		resume();
		expect(callback).toHaveBeenCalledTimes(1);

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).toHaveBeenCalledTimes(2);

		pause();
	});

	testWithEffect("Resume does nothing if already active", async () => {
		const callback = vi.fn();
		const { resume, pause } = useInterval(100, { callback });

		await new Promise((resolve) => setTimeout(resolve, 50));
		resume();

		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(callback).toHaveBeenCalledTimes(1);

		pause();
	});

	testWithEffect("Cleans up on effect disposal", async () => {
		const callback = vi.fn();
		let disposed = false;

		const dispose = $effect.root(() => {
			useInterval(100, { callback });
			return () => {
				disposed = true;
			};
		});

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).toHaveBeenCalledTimes(1);

		dispose();
		expect(disposed).toBe(true);

		await new Promise((resolve) => setTimeout(resolve, 300));
		expect(callback).toHaveBeenCalledTimes(1);
	});

	testWithEffect("Increments counter on each tick", async () => {
		const result = useInterval(100);

		expect(result.counter).toBe(0);

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(result.counter).toBe(1);

		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(result.counter).toBe(2);

		result.pause();
	});

	testWithEffect("Reset sets counter back to 0", async () => {
		const result = useInterval(100);

		await new Promise((resolve) => setTimeout(resolve, 250));
		expect(result.counter).toBe(2);

		result.reset();
		expect(result.counter).toBe(0);

		result.pause();
	});

	testWithEffect("Reacts to interval changes", async () => {
		const callback = vi.fn();
		let intervalValue = $state(100);
		const result = useInterval(() => intervalValue, { callback });

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).toHaveBeenCalledTimes(1);

		intervalValue = 50;
		await new Promise((resolve) => setTimeout(resolve, 10));

		await new Promise((resolve) => setTimeout(resolve, 60));
		expect(callback).toHaveBeenCalledTimes(2);

		result.pause();
	});
});
