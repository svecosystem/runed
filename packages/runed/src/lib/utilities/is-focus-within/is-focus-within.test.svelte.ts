import { effectRootScope } from "$lib/test/util.svelte.js";
import { describe, expect } from "vitest";
import { IsFocusWithin } from "./is-focus-within.svelte.js";

describe("IsFocusWithin", () => {
	let shadowHost: HTMLElement;
	let input: HTMLInputElement;
	let input2: HTMLInputElement;
	let container: HTMLElement;
	let shadowInput: HTMLInputElement;
	let shadowRoot: ShadowRoot;
	let shadowContainer: HTMLElement;
	let shadowInput2: HTMLInputElement;
	let outsideInput: HTMLInputElement;

	beforeEach(() => {
		shadowHost = document.createElement("div");
		shadowRoot = shadowHost.attachShadow({ mode: "open" });
		input = document.createElement("input");
		input2 = input.cloneNode() as HTMLInputElement;
		container = document.createElement("div");
		outsideInput = document.createElement("input");
		shadowInput = input.cloneNode() as HTMLInputElement;
		shadowInput2 = input2.cloneNode() as HTMLInputElement;
		shadowContainer = container.cloneNode() as HTMLElement;
		shadowContainer.appendChild(shadowInput);
		shadowContainer.appendChild(shadowInput2);
		shadowRoot.appendChild(shadowContainer);
		container.appendChild(input);
		container.appendChild(input2);
		document.body.appendChild(container);
		document.body.appendChild(shadowHost);
		document.body.appendChild(outsideInput);
	});

	afterEach(() => {
		shadowHost.remove();
		input.remove();
		input2.remove();
		container.remove();
		outsideInput.remove();
	});

	it("should be false on initial render", () => {
		const isFocusWithin = new IsFocusWithin(() => container);
		expect(isFocusWithin.current).toBe(false);
	});

	it("should be true when child element is focused", () => {
		effectRootScope(() => {
			const isFocusWithin = new IsFocusWithin(() => container);
			const current = $derived(isFocusWithin.current);
			expect(current).toBe(false);

			input.focus();
			expect(current).toBe(true);
		});
	});

	it("should be true when any child of the target is focused", () => {
		effectRootScope(() => {
			const isFocusWithin = new IsFocusWithin(() => container);
			const current = $derived(isFocusWithin.current);
			expect(current).toBe(false);

			input.focus();
			expect(current).toBe(true);

			input2.focus();
			expect(current).toBe(true);
		});
	});

	it("should be false when focus leaves the target", () => {
		effectRootScope(() => {
			const isFocusWithin = new IsFocusWithin(() => container);
			const current = $derived(isFocusWithin.current);
			expect(current).toBe(false);

			input.focus();
			expect(current).toBe(true);

			outsideInput.focus();
			expect(current).toBe(false);
		});
	});

	it("shadow dom - should be false on initial render", () => {
		const focusWithin = new IsFocusWithin(() => shadowContainer, {
			document: shadowRoot,
		});
		expect(focusWithin.current).toBe(false);
	});

	it("shadow dom - should be true when shadow child element is focused", () => {
		effectRootScope(() => {
			const isFocusWithin = new IsFocusWithin(() => shadowContainer, {
				document: shadowRoot,
			});
			const current = $derived(isFocusWithin.current);
			expect(current).toBe(false);

			shadowInput.focus();
			expect(current).toBe(true);
		});
	});

	it("shadow dom - should be true when any shadow child of the target is focused", () => {
		effectRootScope(() => {
			const isFocusWithin = new IsFocusWithin(() => shadowContainer, {
				document: shadowRoot,
			});
			const current = $derived(isFocusWithin.current);
			expect(current).toBe(false);

			shadowInput.focus();
			expect(current).toBe(true);

			shadowInput2.focus();
			expect(current).toBe(true);
		});
	});

	it("shadow dom - should be false when focus leaves the shadow target", () => {
		effectRootScope(() => {
			const isFocusWithin = new IsFocusWithin(() => shadowContainer, {
				document: shadowRoot,
			});
			const current = $derived(isFocusWithin.current);
			expect(current).toBe(false);

			shadowInput.focus();
			expect(current).toBe(true);

			outsideInput.focus();
			expect(current).toBe(false);
		});
	});

	it("shadow dom - should be false when focus moves to light DOM", () => {
		effectRootScope(() => {
			const isFocusWithin = new IsFocusWithin(() => shadowContainer, {
				document: shadowRoot,
			});
			const current = $derived(isFocusWithin.current);
			expect(current).toBe(false);

			shadowInput.focus();
			expect(current).toBe(true);

			input.focus();
			expect(current).toBe(false);
		});
	});
});
