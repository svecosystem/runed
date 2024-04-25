import { describe, expect, expectTypeOf, test } from "vitest";
import { type ReadableBox, type WritableBox, box } from "./box.svelte.js";

describe("box", () => {
	test("box with initial value should be settable", () => {
		const count = box(0);
		expect(count.value).toBe(0);
		count.value = 1;
		expect(count.value).toBe(1);
	});
});

describe("box.from", () => {
	test("box of writable box should be settable", () => {
		const count = box.from(box(0));
		expect(count.value).toBe(0);
		count.value = 1;
		expect(count.value).toBe(1);
	});

	test("box of readable box should not be settable", () => {
		const count = box.from(box.with(() => 0));
		expect(count.value).toBe(0);
		// @ts-expect-error -- we're testing that the setter is not run
		expect(() => (count.value = 1)).toThrow();
	});

	test("can set box of box or value", () => {
		const count = 0 as number | WritableBox<number>;
		const reCount = box.from(count);
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
		const count = box.from(() => 0);
		expect(box.isWritableBox(count)).toBe(false);
	});
});

describe("box.flatten", () => {
	test("flattens an object of boxes", () => {
		const count = box(0);
		const double = box.with(() => count.value * 2);
		function increment() {
			count.value++;
		}
		const flat = box.flatten({ count, double, increment });

		expect(flat.count).toBe(0);
		expect(flat.double).toBe(0);

		count.value = 1;
		expect(flat.count).toBe(1);
		expect(flat.double).toBe(2);

		flat.count = 2;
		expect(count.value).toBe(2);
		expect(flat.count).toBe(2);
		expect(double.value).toBe(4);
		expect(flat.double).toBe(4);

		// @ts-expect-error -- we're testing that the setter is not run
		expect(() => (flat.double = 3)).toThrow();

		flat.increment();
		expect(count.value).toBe(3);
		expect(double.value).toBe(6);
		expect(flat.count).toBe(3);
		expect(flat.double).toBe(6);
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

	test("box from writable box", () => {
		const count = box.from(box(0));
		expectTypeOf(count).toMatchTypeOf<WritableBox<number>>();
	});

	test("box from readable box", () => {
		const count = box.from(box.with(() => 0));
		expectTypeOf(count).toMatchTypeOf<ReadableBox<number>>();
		expectTypeOf(count).not.toMatchTypeOf<WritableBox<number>>();
	});

	test("box from box or value", () => {
		const count = 0 as number | ReadableBox<number>;
		const count2 = box.from(count);
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

	test("box.readonly should return a non-settable box", () => {
		const count = box(0);
		const readonlyCount = box.readonly(count);
		expectTypeOf(readonlyCount).toMatchTypeOf<ReadableBox<number>>();
		expectTypeOf(readonlyCount).not.toMatchTypeOf<WritableBox<number>>();
	});
});

describe("box.readonly", () => {
	test("box.readonly returns a non-settable box", () => {
		const count = box(0);
		const readonlyCount = box.readonly(count);

		function setReadOnlyCount() {
			// eslint-disable-next-line ts/no-explicit-any
			(readonlyCount as any).value = 1;
		}

		expect(setReadOnlyCount).toThrow();
	});
});
