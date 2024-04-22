import { describe, expect, expectTypeOf, test } from "vitest";
import { box } from "../box/index.js";
import { type ReadonlyBox, readonlyBox } from "./readonlyBox.svelte.js";


describe("readonlyBox", () => {
	test("readonlyBox with initial value should be gettable", () => {
		const count = readonlyBox(0);
		expect(count.value).toBe(0);
	})

	test("trying to set readonlyBox.value should throw", () => {
		const count = readonlyBox(0);
		expect(count.value).toBe(0);
		// @ts-expect-error - We're testing if this throws
		expect(() => count.value = 1).toThrow();
	})

	test("readonlyBox with getter gets updated when the fn returns a new value", () => {
		let count = $state(0);
		const countBox = readonlyBox(() => count);
		expect(countBox.value).toBe(0);
		count = 1;
		expect(countBox.value).toBe(1);
	})

	test("readonlyBox of box is synced, can't set readonly", () => {
		const count = box(0)
		const readonlyCount = readonlyBox(count);
		expect(readonlyCount.value).toBe(0);
		count.value = 1;
		expect(readonlyCount.value).toBe(1);
		// @ts-expect-error - We're testing if this throws
		expect(() => readonlyCount.value = 2).toThrow();
	})


	test("readonlyBox of readonlyBox is synced", () => {
		let count = $state(0);
		const readonlyCount = readonlyBox(() => count);
		const readonlyReadonlyCount = readonlyBox(readonlyCount);
		expect(readonlyReadonlyCount.value).toBe(0);
		count = 1;
		expect(readonlyCount.value).toBe(1);
		expect(readonlyReadonlyCount.value).toBe(1);
	})
})

describe("readonlyBox types", () => {
	test("readonlyBox with initial value", () => {
		const count = readonlyBox(0);
		expectTypeOf(count).toMatchTypeOf<ReadonlyBox<number>>();
	})

	test("readonlyBox with getter", () => {
		const count = readonlyBox(() => 0);
		expectTypeOf(count).toMatchTypeOf<ReadonlyBox<number>>();
	})

	test("readonlyBox of box", () => {
		const count = box(0);
		const readonlyCount = readonlyBox(count);
		expectTypeOf(readonlyCount).toMatchTypeOf<ReadonlyBox<number>>();
	})

	test("readonlyBox of readonlyBox", () => {
		const count = readonlyBox(0);
		const readonlyCount = readonlyBox(count);
		expectTypeOf(readonlyCount).toMatchTypeOf<ReadonlyBox<number>>();
	})
})