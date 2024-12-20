import { describe, expect } from "vitest";
import { focus, testWithEffect } from "$lib/test/util.svelte.js";
import { IsFocusWithin } from "./IsFocusWithin.svelte.js";
import { sleep } from "$lib/internal/utils/sleep.js";

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

	testWithEffect("should be false on initial render", async () => {
		const isFocusWithin = new IsFocusWithin(() => container);
		expect(isFocusWithin.current).toBe(false);
	});

	testWithEffect("should be true when child element is focused", async () => {
		const isFocusWithin = new IsFocusWithin(() => container);
		expect(isFocusWithin.current).toBe(false);
		focus(input);
		await sleep();
		expect(isFocusWithin.current).toBe(true);
	});

	testWithEffect("should be true when any child of the target is focused", async () => {
		const isFocusWithin = new IsFocusWithin(() => container);
		expect(isFocusWithin.current).toBe(false);
		focus(input);
		await sleep();
		expect(isFocusWithin.current).toBe(true);
		focus(input2);
		await sleep();
		expect(isFocusWithin.current).toBe(true);
	});

	testWithEffect("should be false when focus leaves the target", async () => {
		const isFocusWithin = new IsFocusWithin(() => container);
		expect(isFocusWithin.current).toBe(false);
		focus(input);
		await sleep();
		expect(isFocusWithin.current).toBe(true);
		focus(outsideInput);
		await sleep();
		expect(isFocusWithin.current).toBe(false);
	});

	testWithEffect("shadow dom - should be false on initial render", () => {
		const focusWithin = new IsFocusWithin(() => shadowContainer, { document: shadowRoot });
		expect(focusWithin.current).toBe(false);
	});
	testWithEffect("shadow dom - should be true when shadow child element is focused", async () => {
		const focusWithin = new IsFocusWithin(() => shadowContainer, { document: shadowRoot });
		expect(focusWithin.current).toBe(false);
		focus(shadowInput);
		await sleep();
		expect(focusWithin.current).toBe(true);
	});

	testWithEffect(
		"shadow dom - should be true when any shadow child of the target is focused",
		async () => {
			const focusWithin = new IsFocusWithin(() => shadowContainer, { document: shadowRoot });
			expect(focusWithin.current).toBe(false);
			focus(shadowInput);
			await sleep();
			expect(focusWithin.current).toBe(true);
			focus(shadowInput2);
			await sleep();
			expect(focusWithin.current).toBe(true);
		}
	);

	testWithEffect("shadow dom - should be false when focus leaves the shadow target", async () => {
		const focusWithin = new IsFocusWithin(() => shadowContainer, { document: shadowRoot });
		expect(focusWithin.current).toBe(false);
		focus(shadowInput);
		await sleep();
		expect(focusWithin.current).toBe(true);
		focus(outsideInput);
		await sleep();
		expect(focusWithin.current).toBe(false);
	});

	testWithEffect("shadow dom - should be false when focus moves to light DOM", async () => {
		const focusWithin = new IsFocusWithin(() => shadowContainer, { document: shadowRoot });
		expect(focusWithin.current).toBe(false);
		focus(shadowInput);
		await sleep();
		expect(focusWithin.current).toBe(true);
		focus(input);
		await sleep();
		expect(focusWithin.current).toBe(false);
	});
});
