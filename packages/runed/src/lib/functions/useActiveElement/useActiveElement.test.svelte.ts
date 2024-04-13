import { describe, expect, it } from "vitest";
import { tick } from "svelte";
import { useActiveElement } from "./index.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

describe("useActiveElement", () => {
	testWithEffect("initializes with `document.activeElement`", () => {
		const activeElement = useActiveElement();
		expect(activeElement.value).toBe(document.activeElement);
	});
	testWithEffect(
		"updates accordingly when `document.activeElement` element changes",
		async () => {
			const input = document.createElement("input");
			document.body.appendChild(input);
			input.focus();

			const activeElement = useActiveElement();
			await tick();
			expect(document.activeElement).toBe(input);
			expect(activeElement.value).toBe(input);
		}
	);
});
