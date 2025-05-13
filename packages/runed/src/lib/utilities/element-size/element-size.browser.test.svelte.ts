import { testWithEffect } from "$lib/test/util.svelte.js";
import { describe, expect, beforeEach, afterEach } from "vitest";
import { ElementSize } from "./index.js";

const waitForFrame = () =>
	new Promise<void>((resolve) => {
		window.requestAnimationFrame(() => {
			resolve();
		});
	});

describe(ElementSize, () => {
	let node: HTMLElement;

	beforeEach(() => {
		node = document.createElement("div");
		node.style.width = "0px";
		node.style.height = "0px";
		document.body.appendChild(node);
	});

	afterEach(() => {
		node.remove();
	});

	describe("constructor options", () => {
		testWithEffect("handles undefined window", () => {
			const instance = new ElementSize(node, { window: undefined });
			expect(instance.current).toEqual({
				width: 0,
				height: 0,
			});
		});

		testWithEffect("initialises state", () => {
			const instance = new ElementSize(node);
			expect(instance.current).toEqual({
				width: 0,
				height: 0,
			});
			expect(instance.width).toBe(0);
			expect(instance.height).toBe(0);
		});
	});

	testWithEffect("updates on resize", async () => {
		const instance = new ElementSize(node);
		// once for the class to setup
		await waitForFrame();
		node.style.width = "100px";
		node.style.height = "50px";
		// once for the observer to trigger
		await waitForFrame();
		expect(instance.current).toEqual({
			width: 100,
			height: 50,
		});
	});

	testWithEffect("uses border-box by default", async () => {
		const instance = new ElementSize(node);
		// once for the class to setup
		await waitForFrame();
		node.style.width = "100px";
		node.style.height = "50px";
		node.style.border = "10px solid";
		// once for the observer to trigger
		await waitForFrame();
		expect(instance.current).toEqual({
			width: 120,
			height: 70,
		});
	});

	testWithEffect("content-box applies correctly", async () => {
		const instance = new ElementSize(node, { box: "content-box" });
		// once for the class to setup
		await waitForFrame();
		node.style.width = "100px";
		node.style.height = "50px";
		node.style.border = "10px solid";
		// once for the observer to trigger
		await waitForFrame();
		expect(instance.current).toEqual({
			width: 100,
			height: 50,
		});
	});

	testWithEffect("resize on one axis", async () => {
		const instance = new ElementSize(node);
		// once for the class to setup
		await waitForFrame();
		node.style.height = "50px";
		// once for the observer to trigger
		await waitForFrame();
		expect(instance.current).toEqual({
			width: 0,
			height: 50,
		});
		node.style.width = "200px";
		// once for the observer to trigger
		await waitForFrame();
		expect(instance.current).toEqual({
			width: 200,
			height: 50,
		});
	});
});
