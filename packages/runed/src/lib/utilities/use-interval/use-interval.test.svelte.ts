import { describe, expect, vi } from "vitest";
import { useInterval } from "./use-interval.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

describe("useInterval", () => {
	testWithEffect("Calls callback at specified interval", async () => {
		const callback = vi.fn();
		const { pause } = useInterval(callback, 100);

		expect(callback).not.toHaveBeenCalled();

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).toHaveBeenCalledTimes(1);

		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(callback).toHaveBeenCalledTimes(2);

		pause();
	});

	testWithEffect("Does not start immediately when immediate is false", async () => {
		const callback = vi.fn();
		const { resume, pause } = useInterval(callback, 100, { immediate: false });

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).not.toHaveBeenCalled();

		resume();
		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).toHaveBeenCalledTimes(1);

		pause();
	});

	testWithEffect("Pause stops the interval", async () => {
		const callback = vi.fn();
		const { pause } = useInterval(callback, 100);

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).toHaveBeenCalledTimes(1);

		pause();
		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).toHaveBeenCalledTimes(1);
	});

	testWithEffect("Resume restarts the interval", async () => {
		const callback = vi.fn();
		const { pause, resume } = useInterval(callback, 100);

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
		const { pause, resume } = useInterval(callback, 100, {
			immediate: false,
			immediateCallback: true,
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
		const { resume, pause } = useInterval(callback, 100);

		await new Promise((resolve) => setTimeout(resolve, 50));
		resume(); // Should do nothing since already active

		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(callback).toHaveBeenCalledTimes(1);

		pause();
	});

	testWithEffect("Cleans up on effect disposal", async () => {
		const callback = vi.fn();
		let disposed = false;

		const dispose = $effect.root(() => {
			useInterval(callback, 100);
			return () => {
				disposed = true;
			};
		});

		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(callback).toHaveBeenCalledTimes(1);

		dispose();
		expect(disposed).toBe(true);

		await new Promise((resolve) => setTimeout(resolve, 300));
		expect(callback).toHaveBeenCalledTimes(1); // Should not increase after disposal
	});
});
