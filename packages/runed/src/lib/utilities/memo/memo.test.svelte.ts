import { describe, expect } from "vitest";
import { memo } from "./memo.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";
import { sleep } from "$lib/internal/utils/sleep.js";

describe("memo", () => {
	testWithEffect("recomputes when a tracked source changes", async () => {
		let count = $state(2);
		const doubled = memo(
			() => count,
			() => count * 2
		);

		expect(doubled.current).toBe(4);

		count = 5;
		await sleep(0);
		expect(doubled.current).toBe(10);
	});

	testWithEffect("does not recompute when an untracked source changes", async () => {
		let tracked = $state(1);
		let untracked = $state(100);
		let runs = 0;

		const value = memo(
			() => tracked,
			() => {
				runs++;
				// reading `untracked` here must NOT register as a dependency
				return tracked + untracked;
			}
		);

		expect(value.current).toBe(101);
		expect(runs).toBe(1);

		untracked = 200;
		await sleep(0);
		expect(value.current).toBe(101);
		expect(runs).toBe(1);

		tracked = 2;
		await sleep(0);
		expect(value.current).toBe(202);
		expect(runs).toBe(2);
	});

	testWithEffect("supports an array of sources", async () => {
		let a = $state(1);
		let b = $state(2);

		const sum = memo(
			[() => a, () => b],
			() => a + b
		);

		expect(sum.current).toBe(3);

		a = 10;
		await sleep(0);
		expect(sum.current).toBe(12);

		b = 20;
		await sleep(0);
		expect(sum.current).toBe(30);
	});

	testWithEffect("only the listed sources trigger recomputation", async () => {
		let tracked = $state(1);
		let alsoRead = $state(10);
		let runs = 0;

		const value = memo(
			() => tracked,
			() => {
				runs++;
				return tracked + alsoRead;
			}
		);

		expect(value.current).toBe(11);
		expect(runs).toBe(1);

		// Changing a value that's read inside the compute body but not declared
		// as a source should not cause a recomputation.
		alsoRead = 20;
		await sleep(0);
		expect(value.current).toBe(11);
		expect(runs).toBe(1);

		// Changing the declared source should cause a recomputation, and it will
		// pick up the latest value of the un-tracked read as well.
		tracked = 2;
		await sleep(0);
		expect(value.current).toBe(22);
		expect(runs).toBe(2);
	});
});
