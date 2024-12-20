import { sleep } from "$lib/internal/utils/sleep.js";
import { fireEvent } from "@testing-library/svelte";
import { flushSync } from "svelte";
import { test, vi } from "vitest";

export function testWithEffect(name: string, fn: () => void | Promise<void>) {
	test(name, async () => {
		let promise: void | Promise<void>;
		const cleanup = $effect.root(() => {
			promise = fn();
		});

		try {
			await promise!;
		} finally {
			cleanup();
		}
	});
}

export function vitestSetTimeoutWrapper(fn: () => void, timeout: number) {
	setTimeout(async () => {
		fn();
	}, timeout + 1);

	vi.advanceTimersByTime(timeout);
}

export function focus(node: HTMLElement | null | undefined) {
	if (node) {
		flushSync(() => node.focus());
	}
}

export async function fireFocus(node: HTMLElement | null | undefined) {
	if (node) {
		await fireEvent.focus(node);
	}
}

export async function setFocusAndWait(element: HTMLElement | null | undefined) {
	if (!element) return;
	element.focus();
	// Dispatch focusin/focusout events since JSDOM doesn't do this automatically
	element.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
	// Allow effects to process
	await sleep();
	// Wait for next animation frame
	await new Promise((resolve) => requestAnimationFrame(resolve));
}
