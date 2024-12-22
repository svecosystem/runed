import { effectRootScope } from "$lib/test/util.svelte.js";
import { describe, expect } from "vitest";
import { activeElement } from "./index.js";

describe("activeElement", () => {
	it("initializes with `document.activeElement`", () => {
		expect(activeElement.current).toBe(document.activeElement);
	});

	it("updates accordingly when `document.activeElement` element changes", () => {
		effectRootScope(() => {
			const current = $derived(activeElement.current);
			expect(current).toBe(document.activeElement);

			const input = document.createElement("input");
			document.body.appendChild(input);
			input.focus();
			expect(current).toBe(input);

			input.blur();
			expect(current).toBe(document.body);
		});
	});
});
