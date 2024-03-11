import { onDestroy } from "svelte";

/**
 * Safely calls `onDestroy` and catches any errors that occur.
 */
export function safeOnDestroy(fn: (...args: unknown[]) => unknown) {
	try {
		onDestroy(fn);
	} catch {
		return fn();
	}
}
