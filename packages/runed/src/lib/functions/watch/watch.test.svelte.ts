import { describe, expect, vi } from "vitest";
import { watch } from "./watch.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";
import { sleep } from "$lib/internal/utils/sleep.js";

describe("watch", () => {
	testWithEffect("watchers only tracks their dependencies", async () => {
		let count = $state(0);
		let runs = $state(0);

		watch(
			() => count,
			() => {
				runs = runs + 1;
			}
		);

		// Watchers run immediately by default
		await vi.waitFor(() => {
			expect(runs).toBe(1);
		});

		count = 1;
		await vi.waitFor(() => {
			expect(runs).toBe(2);
		});
	});

	testWithEffect("watchers track getters", () => {
		let count = $state(0);

		watch([() => count], ([count], [prevCount]) => {
			expect(count).toBe(0);
			expect(prevCount).toBe(undefined);
		});
	});

	testWithEffect(
		"lazy watchers correctly pass the initial values as the previous values",
		async () => {
			let count = $state(0);

			watch(
				() => count,
				(count, prevCount) => {
					expect(count).toBe(1);
					expect(prevCount).toBe(0);
				},
				{ lazy: true }
			);
		}

	);

	testWithEffect("watchers with `{ once: true }` only run once", async () => {
		let count = $state(0)

		let runs = 0;
		watch(
			() => count,
			() => {
				runs++;
			},
			{ once: true }
		);

		await vi.waitFor(() => {
			expect(runs).toBe(1);
		});

		count++;

		// Give the watcher a chance to rerun.
		await sleep(0);

		expect(runs).toBe(1);
	});
});
