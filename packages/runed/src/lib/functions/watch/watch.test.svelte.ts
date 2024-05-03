import { describe, expect, vi } from "vitest";
import { box } from "../box/box.svelte.js";
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

	testWithEffect("watchers track both $state and boxes", () => {
		let count = $state(0);
		const name = box("Abdel");

		watch([() => count, name], ([count, name], [prevCount, prevName]) => {
			expect(count).toBe(0);
			expect(prevCount).toBe(undefined);
			expect(name).toBe("Abdel");
			expect(prevName).toBe(undefined);
		});
	});

	testWithEffect(
		"lazy watchers correctly pass the initial values as the previous values",
		async () => {
			let count = $state(0);
			const name = box("Abdel");

			watch(
				() => count,
				(count, prevCount) => {
					expect(count).toBe(1);
					expect(prevCount).toBe(0);
				},
				{ lazy: true }
			);

			watch(
				name,
				(name, prevName) => {
					expect(name).toBe("Thomas");
					expect(prevName).toBe("Abdel");
				},
				{ lazy: true }
			);

			watch(
				[() => count, name],
				([count, name], [prevCount, prevName]) => {
					expect(count).toBe(1);
					expect(prevCount).toBe(0);
					expect(name).toBe("Thomas");
					expect(prevName).toBe("Abdel");
				},
				{ lazy: true }
			);

			// Give the watchers a chance to run and determine their dependencies.
			await sleep(0);

			count = 1;
			name.value = "Thomas";
		}
	);

	testWithEffect("watchers with `{ once: true }` only run once", async () => {
		const count = box(0);

		let runs = 0;
		watch(
			count,
			() => {
				runs++;
			},
			{ once: true }
		);

		await vi.waitFor(() => {
			expect(runs).toBe(1);
		});

		count.value++;

		// Give the watcher a chance to rerun.
		await sleep(0);

		expect(runs).toBe(1);
	});

	testWithEffect("watchers with an array getter returns `undefined` as the previous value", () => {
		watch(
			() => [1, 2, 3],
			(_, previous) => {
				expect(previous).toBe(undefined);
			}
		);
	});
});
