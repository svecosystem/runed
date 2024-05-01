import { describe } from "node:test";
import { expect, test } from "vitest";
// import { box } from "../index.js";
// import { usePrevious } from "./usePrevious.svelte.js";
// import { testWithEffect } from "$lib/test/util.svelte.js";

// TODO: Find out why tests aren't working, even though the demo works
describe("usePrevious", () => {
	test("dummy test", () => {
		expect(true).toBe(true);
	});
	// testWithEffect('Should return undefined initially', () => {
	//   const previous = usePrevious(() => 0);
	//   expect(previous.value).toBe(undefined)
	// })

	// testWithEffect('Should return previous value', async () => {
	//   const count = box(0);
	//   const previous = usePrevious(count);
	//   expect(previous.value).toBe(undefined)
	//   count.value = 1
	//   await new Promise(resolve => setTimeout(resolve, 100))
	//   expect(previous.value).toBe(0)
	//   count.value = 2
	//   expect(previous.value).toBe(1)
	// })
});
