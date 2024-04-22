import { describe, expect, expectTypeOf, test } from "vitest";
import { type ReadonlyBox, readonlyBox } from "../readonlyBox/readonlyBox.svelte.js";
import { type Box, type ValueOrBox, box } from "./box.svelte.js";
import type { Getter } from "$lib/internal/types.js";

describe("box", () => {
	test("box with initial value should be settable", () => {
		const count = box(0);
		expect(count.value).toBe(0);
		count.value = 1;
		expect(count.value).toBe(1);
	});

	test("box with getter only should throw", () => {
		expect(() => box(() => 0)).toThrow();
	});

	test("box with initial value and setter should be settable", () => {
		const count = box(0, (c) => c);
		expect(count.value).toBe(0);
		count.value = 1;
		expect(count.value).toBe(1);
	});

	test("box with getter and setter should be settable", () => {
		let count = $state(0);
		const countBox = box(
			() => count,
			(c) => (count = c)
		);
		expect(countBox.value).toBe(0);
		countBox.value = 1;
		expect(countBox.value).toBe(1);
	});

	test("box of readonly box should throw", () => {
		expect(() => box(readonlyBox(() => 0))).toThrow();
	});

	test("box of box should be settable", () => {
		const count = box(box(0));
		expect(count.value).toBe(0);
		count.value = 1;
		expect(count.value).toBe(1);
	});
});

describe("box types", () => {
	test("box with initial value", () => {
		const count = box(0);
		expectTypeOf(count).toMatchTypeOf<Box<number>>();
		expectTypeOf(count).not.toMatchTypeOf<ReadonlyBox<number>>();
	});

	test("box with getter only", () => {
		const count = box(0 as unknown as Getter<number>);
		expectTypeOf(count).toMatchTypeOf<never>();
	});

	test("box with initial value and setter", () => {
		const count = box(0, (c) => c);
		expectTypeOf(count).toMatchTypeOf<Box<number>>();
		expectTypeOf(count).not.toMatchTypeOf<ReadonlyBox<number>>();
	});

	test("box with getter and setter", () => {
		let count = $state(0);
		const countBox = box(
			() => count,
			(c) => (count = c)
		);
		expectTypeOf(countBox).toMatchTypeOf<Box<number>>();
		expectTypeOf(countBox).not.toMatchTypeOf<ReadonlyBox<number>>();
	});

	test("box of readonly box", () => {
		const count = box(0 as unknown as ReadonlyBox<number>);
		expectTypeOf(count).toMatchTypeOf<never>();
	});

	test("box of box", () => {
		const count = box(box(0));
		expectTypeOf(count).toMatchTypeOf<Box<number>>();
		expectTypeOf(count).not.toMatchTypeOf<ReadonlyBox<number>>();
	});

	test("box of ValueOrBox", () => {
		const count = undefined as unknown as ValueOrBox<number>; // typing this as number casts it
		const readonlyCount = box(count);
		expectTypeOf(readonlyCount).toMatchTypeOf<Box<number>>;
	});
});
