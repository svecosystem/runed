import { describe, expect } from "vitest";
import { watch, watchOnce } from "./watch.svelte.js";
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
		await sleep(0);
		expect(runs).toBe(1);

		count++;
		await sleep(0);
		expect(runs).toBe(2);
	});

	testWithEffect("watchers initially pass `undefined` as the previous value", () => {
		return new Promise((resolve) => {
			const count = $state(0);

			watch(
				() => count,
				(count, prevCount) => {
					expect(count).toBe(0);
					expect(prevCount).toBe(undefined);
					resolve();
				}
			);
		});
	});

	testWithEffect(
		"watchers with an array of sources initially pass an empty array as the previous value",
		() => {
			return new Promise((resolve) => {
				const count = $state(1);
				const doubled = $derived(count * 2);

				watch([() => count, () => doubled], ([count, doubled], [prevCount, prevDoubled]) => {
					expect(count).toBe(1);
					expect(prevCount).toBe(undefined);
					expect(doubled).toBe(2);
					expect(prevDoubled).toBe(undefined);
					resolve();
				});
			});
		}
	);

	testWithEffect("lazy watchers pass the initial value as the previous value", () => {
		return new Promise((resolve) => {
			let count = $state(0);

			watch(
				() => count,
				(count, prevCount) => {
					expect(count).toBe(1);
					expect(prevCount).toBe(0);
					resolve();
				},
				{ lazy: true }
			);

			// Wait for the watcher's initial run to determine its dependencies.
			sleep(0).then(() => {
				count = 1;
			});
		});
	});

	testWithEffect("once watchers only run once", async () => {
		let count = $state(0);
		let runs = 0;

		watchOnce(
			() => count,
			() => {
				runs++;
			}
		);

		// Wait for the watcher's initial run to determine its dependencies.
		await sleep(0);

		count++;
		await sleep(0);
		expect(runs).toBe(1);

		count++;
		await sleep(0);
		expect(runs).toBe(1);
	});

	testWithEffect("once watchers pass the initial value as the previous value", () => {
		return new Promise((resolve) => {
			let count = $state(0);

			watchOnce(
				() => count,
				(count, prevCount) => {
					expect(count).toBe(1);
					expect(prevCount).toBe(0);
					resolve();
				}
			);

			// Wait for the watcher's initial run to determine its dependencies.
			sleep(0).then(() => {
				count = 1;
			});
		});
	});
});
