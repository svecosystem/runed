import { describe, expect, vi } from "vitest";
import { watch } from "./watch.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";
import { sleep } from "$lib/internal/utils/sleep.js";

describe("watch", () => {
	testWithEffect("watchers only track their dependencies", async () => {
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

		count++;
		await vi.waitFor(() => {
			expect(runs).toBe(2);
		});
	});

	testWithEffect("watchers initially pass `undefined` as the previous value", () => {
		const count = $state(0);

		watch(
			() => count,
			(count, prevCount) => {
				expect(count).toBe(0);
				expect(prevCount).toBe(undefined);
			}
		);
	});

	testWithEffect(
		"watchers with an array initially pass an empty array as the previous value",
		() => {
			const count = $state(1);
			const doubled = $derived(count * 2);

			watch(
				() => [count, doubled],
				([count, doubled], [prevCount, prevDoubled]) => {
					expect(count).toBe(1);
					expect(prevCount).toBe(undefined);

					expect(doubled).toBe(2);
					expect(prevDoubled).toBe(undefined);
				}
			);
		}
	);

	testWithEffect(
		"lazy watchers correctly pass the initial value as the previous value",
		async () => {
			const count = $state(0);

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
		let count = $state(0);

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
