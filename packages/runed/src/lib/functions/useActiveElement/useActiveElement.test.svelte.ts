import { describe, expect, it } from "vitest";
import { useActiveElement } from "./index.js";

describe("useActiveElement", () => {
	it("initializes with `document.activeElement`", () => {
		const cleanup = $effect.root(() => {
			const activeElement = useActiveElement();
			expect(activeElement.value).toBe(document.activeElement);
		});
		cleanup();
	});
	it("updates accordingly when `document.activeElement` element changes", () => {
		const input = document.createElement("input");
		const cleanup = $effect.root(() => {
			const activeElement = useActiveElement();
			expect(activeElement.value).toBe(document.activeElement);
			input.focus();
			requestAnimationFrame(() => {
				expect(document.activeElement).toBe(input);
				expect(activeElement.value).toBe(input);
			});
		});
		cleanup();
	});
});
