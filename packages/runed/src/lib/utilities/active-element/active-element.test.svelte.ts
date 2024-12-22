import { effectRootScope } from "$lib/test/util.svelte.js";
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { ActiveElement, activeElement } from "./index.js";

describe("ActiveElement", () => {
	describe("constructor options", () => {
		it("handles undefined window", () => {
			const instance = new ActiveElement({ window: undefined });
			expect(instance.current).toBe(document.activeElement);
		});

		it("uses custom document when provided", () => {
			const mockDoc = {
				activeElement: document.createElement("div"),
			} as unknown as Document;

			const instance = new ActiveElement({
				window: window,
				document: mockDoc,
			});
			expect(instance.current).toBe(mockDoc.activeElement);
		});
	});

	describe("shadow DOM support", () => {
		let shadowHost: HTMLDivElement;
		let shadowRoot: ShadowRoot;
		let shadowInput: HTMLInputElement;

		beforeEach(() => {
			shadowHost = document.createElement("div");
			document.body.appendChild(shadowHost);
			shadowRoot = shadowHost.attachShadow({ mode: "open" });
			shadowInput = document.createElement("input");
			shadowRoot.appendChild(shadowInput);
		});

		afterEach(() => {
			shadowHost.remove();
		});

		it("tracks focus within shadow DOM when using shadow root", () => {
			const instance = new ActiveElement({
				window,
				document: shadowRoot,
			});

			effectRootScope(() => {
				shadowInput.focus();
				expect(instance.current).toBe(shadowInput);

				shadowInput.blur();
				expect(instance.current).toBe(null);
			});
		});

		it("tracks focus within shadow DOM using default document", () => {
			const instance = new ActiveElement({ window });
			effectRootScope(() => {
				shadowInput.focus();
				expect(instance.current).toBe(shadowInput);

				shadowInput.blur();
				expect(instance.current).toBe(document.body);
			});
		});

		it("tracks focus within nested shadow DOM", () => {
			// Create nested shadow DOM structure
			const nestedHost = document.createElement("div");
			shadowRoot.appendChild(nestedHost);
			const nestedShadowRoot = nestedHost.attachShadow({ mode: "open" });
			const nestedInput = document.createElement("input");
			nestedShadowRoot.appendChild(nestedInput);

			effectRootScope(() => {
				const instance = new ActiveElement({ window });

				// Test focus in first level shadow DOM
				shadowInput.focus();
				expect(instance.current).toBe(shadowInput);

				// Test focus in nested shadow DOM
				nestedInput.focus();
				expect(instance.current).toBe(nestedInput);

				// Test blur behavior
				nestedInput.blur();
				expect(instance.current).toBe(document.body);

				// Cleanup
				nestedHost.remove();
			});
		});
	});

	describe("multi-element focus handling", () => {
		let input1: HTMLInputElement;
		let input2: HTMLInputElement;

		beforeEach(() => {
			input1 = document.createElement("input");
			input2 = document.createElement("input");
			document.body.appendChild(input1);
			document.body.appendChild(input2);
		});

		afterEach(() => {
			input1.remove();
			input2.remove();
		});

		it("correctly tracks focus between multiple elements", () => {
			effectRootScope(() => {
				const current = $derived(activeElement.current);

				input1.focus();
				expect(current).toBe(input1);

				input2.focus();
				expect(current).toBe(input2);

				// Test tabbing behavior simulation
				input1.focus();
				expect(current).toBe(input1);
			});
		});

		it("handles rapid focus changes", () => {
			effectRootScope(() => {
				const current = $derived(activeElement.current);

				input1.focus();
				input2.focus();
				input1.focus();
				input2.focus();

				expect(current).toBe(input2);
			});
		});
	});
});
