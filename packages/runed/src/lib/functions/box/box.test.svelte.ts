import { describe, expect, expectTypeOf, test } from "vitest";
import { type ReadableBox, type WritableBox, box } from "./box.svelte.js";

describe("box", () => {
	test("box with initial value should be settable", () => {
		const count = box(0);
		expect(count.value).toBe(0);
		count.value = 1;
		expect(count.value).toBe(1);
	});

	test("box setter should run setter when setting value", () => {
		const double = box(0, (c) => c * 2);
		expect(double.value).toBe(0);
		double.value = 1;
		expect(double.value).toBe(2);
	});

	test("box of writable box should be settable", () => {
		const count = box(box(0));
		expect(count.value).toBe(0);
		count.value = 1;
		expect(count.value).toBe(1);
	});

	test("box of readable box should not be settable", () => {
		const count = box(box.with(() => 0));
		expect(count.value).toBe(0);
		// @ts-expect-error -- we're testing that the setter is not run
		expect(() => (count.value = 1)).toThrow();
	});

	test("can set box of box or value", () => {
		const count = 0 as number | WritableBox<number>;
		const reCount = box(count);
		expect(reCount.value).toBe(0);
		reCount.value = 1;
		expect(reCount.value).toBe(1);
	});
});

describe("box.with", () => {
	test("box with getter only should return value and not be settable", () => {
		const count = box.with(() => 0);
		expect(count.value).toBe(0);
		// @ts-expect-error -- we're testing that the setter is not run
		expect(() => (count.value = 1)).toThrow();
	});

	test("box with state getter should be reactive", () => {
		let value = $state(0);
		const count = box.with(() => value);
		expect(count.value).toBe(0);
		value++;
		expect(count.value).toBe(1);
	});

	test("box with getter and setter should be reactive", () => {
		let value = $state(0);
		const double = box.with(
			() => value,
			(v) => (value = v * 2)
		);
		expect(double.value).toBe(0);
		double.value = 1;
		expect(double.value).toBe(2);
		expect(value).toBe(2);
	});
});

describe("box.isBox", () => {
	test("box should be a box", () => {
		const count = box(0);
		expect(box.isBox(count)).toBe(true);
	});
});

describe("box.isWritableBox", () => {
	test("writable box should be a writable box", () => {
		const count = box(0);
		expect(box.isWritableBox(count)).toBe(true);
	});

	test("readable box should not be a writable box", () => {
		const count = box.with(() => 0);
		expect(box.isWritableBox(count)).toBe(false);
	});
});

describe("box types", () => {
	test("box without initial value", () => {
		const count = box<number>();
		expectTypeOf(count).toMatchTypeOf<WritableBox<number | undefined>>();
		expectTypeOf(count).toMatchTypeOf<ReadableBox<number | undefined>>();
	});

	test("box with initial value", () => {
		const count = box(0);
		expectTypeOf(count).toMatchTypeOf<WritableBox<number>>();
		expectTypeOf(count).toMatchTypeOf<ReadableBox<number>>();
	});

	test("box of writable box", () => {
		const count = box(box(0));
		expectTypeOf(count).toMatchTypeOf<WritableBox<number>>();
	});

	test("box of readable box", () => {
		const count = box(box.with(() => 0));
		expectTypeOf(count).toMatchTypeOf<ReadableBox<number>>();
		expectTypeOf(count).not.toMatchTypeOf<WritableBox<number>>();
	});

	test("box of box or value", () => {
		const count = 0 as number | ReadableBox<number>;
		const count2 = box(count);
		expectTypeOf(count2).toMatchTypeOf<ReadableBox<number>>();
	});

	test("box.isWritableBox = true should allow box to be settable", () => {
		const count = box(0) as WritableBox<number> | ReadableBox<number>;
		expectTypeOf(count).toMatchTypeOf<ReadableBox<number>>();
		expect(box.isWritableBox(count)).toBe(true);

		if (box.isWritableBox(count)) {
			expectTypeOf(count).toMatchTypeOf<WritableBox<number>>();
		}
	});
});
