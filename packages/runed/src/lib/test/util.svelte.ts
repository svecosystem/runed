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
