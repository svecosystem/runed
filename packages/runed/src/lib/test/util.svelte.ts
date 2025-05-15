import { test, vi } from "vitest";

export function testWithEffect(name: string, fn: () => void | Promise<void>): void {
	test(name, () => effectRootScope(fn));
}

export function effectRootScope(fn: () => void | Promise<void>): void | Promise<void> {
	let promise!: void | Promise<void>;
	const cleanup = $effect.root(() => {
		promise = fn();
	});

	if (promise instanceof Promise) {
		return promise.finally(cleanup);
	} else {
		cleanup();
	}
}

export function vitestSetTimeoutWrapper(fn: () => void, timeout: number): void {
	setTimeout(() => {
		fn();
	}, timeout);

	vi.advanceTimersByTime(timeout);
}
