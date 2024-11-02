import { describe, expect, vi } from "vitest";
import { useDebounce } from "./useDebounce.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

describe("useDebounce", () => {
	testWithEffect("Function does not get called immediately", async () => {
		const fn = vi.fn();
		const debounced = useDebounce(fn, 100);

		expect(fn).not.toHaveBeenCalled();
		debounced();
		expect(fn).not.toHaveBeenCalled();
		await new Promise((resolve) => setTimeout(resolve, 200));

		expect(fn).toHaveBeenCalledTimes(1);
	});

	testWithEffect("Can cancel debounce fn", async () => {
		const fn = vi.fn();
		const debounced = useDebounce(fn, 100);

		expect(fn).not.toHaveBeenCalled();
		debounced().catch(() => {});
		expect(fn).not.toHaveBeenCalled();
		expect(debounced.pending).toBe(true);
		debounced.cancel();
		expect(debounced.pending).toBe(false);
		await new Promise((resolve) => setTimeout(resolve, 200));
		expect(fn).not.toHaveBeenCalled();
	});

	testWithEffect("No race contion with running callback", async () => {
		let calledNTimes = 0;

		const slowFunction = async () => {
			calledNTimes++;

			await new Promise((resolve) => setTimeout(resolve, 100));
		};
		const debounced = useDebounce(slowFunction, 100);

		expect(calledNTimes).toBe(0);
		debounced();
		expect(calledNTimes).toBe(0);
		expect(debounced.pending).toBe(true);

		await new Promise((resolve) => setTimeout(resolve, 110));
		expect(calledNTimes).toBe(1);
		expect(debounced.pending).toBe(false);
		debounced();
		expect(calledNTimes).toBe(1);
		expect(debounced.pending).toBe(true);

		await new Promise((resolve) => setTimeout(resolve, 110));
		expect(debounced.pending).toBe(false);
		expect(calledNTimes).toBe(2);
	});
});
