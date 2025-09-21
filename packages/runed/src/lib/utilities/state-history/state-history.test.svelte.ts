import { describe, expect } from "vitest";
import { testWithEffect } from "$lib/test/util.svelte.js";
import { StateHistory } from "./state-history.svelte.js";
import { flushSync } from "svelte";

describe(StateHistory, () => {
	testWithEffect("should track value change", () => {
		let value = $state(0);
		const history = new StateHistory(
			() => value,
			(v) => {
				value = v;
			}
		);
		flushSync();

		value = 1;
		flushSync();

		expect(history.log).toEqual([
			{ snapshot: 0, timestamp: expect.any(Number) },
			{ snapshot: 1, timestamp: expect.any(Number) },
		]);
	});

	testWithEffect("should track multiple value changes", () => {
		let value = $state(0);
		const history = new StateHistory(
			() => value,
			(v) => {
				value = v;
			}
		);

		flushSync();
		value = 1;
		flushSync();
		value = 2;
		flushSync();

		expect(history.log).toEqual([
			{ snapshot: 0, timestamp: expect.any(Number) },
			{ snapshot: 1, timestamp: expect.any(Number) },
			{ snapshot: 2, timestamp: expect.any(Number) },
		]);
	});

	testWithEffect("should respect capacity", () => {
		let value = $state(0);
		const history = new StateHistory(
			() => value,
			(v) => {
				value = v;
			},
			{ capacity: 2 }
		);

		flushSync();
		value = 1;
		flushSync();
		value = 2;
		flushSync();
		value = 3;
		flushSync();

		expect(history.log).toEqual([
			{ snapshot: 2, timestamp: expect.any(Number) },
			{ snapshot: 3, timestamp: expect.any(Number) },
		]);
	});

	testWithEffect("should react to capacity changes", () => {
		let value = $state(0);
		let capacity = $state(2);
		const history = new StateHistory(
			() => value,
			(v) => {
				value = v;
			},
			{ capacity: () => capacity }
		);

		flushSync();
		value = 1;
		flushSync();
		value = 2;
		flushSync();
		capacity = 1;
		flushSync();

		expect(history.log).toEqual([{ snapshot: 2, timestamp: expect.any(Number) }]);
	});

	testWithEffect("can undo changes", () => {
		let value = $state(0);
		const history = new StateHistory(
			() => value,
			(v) => {
				value = v;
			}
		);

		flushSync();
		value = 1;
		flushSync();
		value = 2;
		flushSync();

		history.undo();
		flushSync();

		expect(value).toBe(1);
		expect(history.log).toEqual([
			{ snapshot: 0, timestamp: expect.any(Number) },
			{ snapshot: 1, timestamp: expect.any(Number) },
		]);
	});

	testWithEffect("can undo multiple times", () => {
		let value = $state(0);
		const history = new StateHistory(
			() => value,
			(v) => {
				value = v;
			}
		);

		flushSync();
		value = 1;
		flushSync();
		value = 2;
		flushSync();
		value = 3;
		flushSync();

		history.undo();
		flushSync();
		history.undo();
		flushSync();

		expect(value).toBe(1);
		expect(history.log).toEqual([
			{ snapshot: 0, timestamp: expect.any(Number) },
			{ snapshot: 1, timestamp: expect.any(Number) },
		]);
	});

	testWithEffect("can redo changes", () => {
		let value = $state(0);
		const history = new StateHistory(
			() => value,
			(v) => {
				value = v;
			}
		);

		flushSync();
		value = 1;
		flushSync();
		value = 2;
		flushSync();

		history.undo();
		flushSync();
		history.redo();
		flushSync();

		expect(value).toBe(2);
		expect(history.log).toEqual([
			{ snapshot: 0, timestamp: expect.any(Number) },
			{ snapshot: 1, timestamp: expect.any(Number) },
			{ snapshot: 2, timestamp: expect.any(Number) },
		]);
	});

	testWithEffect("undo with no stack does nothing", () => {
		let value = $state(0);
		const history = new StateHistory(
			() => value,
			(v) => {
				value = v;
			}
		);

		flushSync();
		history.undo();
		flushSync();

		expect(value).toBe(0);
		expect(history.log).toEqual([{ snapshot: 0, timestamp: expect.any(Number) }]);
	});

	testWithEffect("redo with no stack does nothing", () => {
		let value = $state(0);
		const history = new StateHistory(
			() => value,
			(v) => {
				value = v;
			}
		);

		flushSync();
		history.redo();
		flushSync();

		expect(value).toBe(0);
		expect(history.log).toEqual([{ snapshot: 0, timestamp: expect.any(Number) }]);
	});

	testWithEffect("clear resets history and redo stack", () => {
		let value = $state(0);
		const history = new StateHistory(
			() => value,
			(v) => {
				value = v;
			}
		);

		flushSync();
		value = 1;
		flushSync();
		value = 2;
		flushSync();

		history.undo();
		flushSync();

		expect(history.log.length).toBe(2);
		expect(history.canRedo).toBe(true);
		expect(history.canUndo).toBe(true);

		history.clear();

		expect(history.log).toEqual([]);
		expect(history.canRedo).toBe(false);
		expect(history.canUndo).toBe(false);
	});
});
