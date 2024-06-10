import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { IsIdle } from "./IsIdle.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

// ? should this go in the test utils file? Any other tests that would need this?
function vitestSetTimeoutWrapper(fn: () => void, timeout: number) {
	setTimeout(async () => {
		fn();
	}, timeout + 1);

	vi.advanceTimersByTime(timeout);
}

describe("IsIdle", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.clearAllTimers();
	});

	describe("Default behaviors", () => {
		testWithEffect("Initially set to false", async () => {
			const idleState = new IsIdle();
			expect(idleState.current).toBe(false);
		});

		testWithEffect("IsIdle is set to true when no activity occurs", async () => {
			const DEFAULT_IDLE_TIME = 500;
			const idleState = new IsIdle();

			vitestSetTimeoutWrapper(() => {
				expect(idleState.current).toBe(true);
			}, DEFAULT_IDLE_TIME);
		});

		testWithEffect("IsIdle is set to false on click event", async () => {
			const idleState = new IsIdle(300);

			vitestSetTimeoutWrapper(() => {
				expect(idleState.current).toBe(true);
				const input = document.createElement("input");
				document.body.appendChild(input);
				input.click();
				expect(idleState.current).toBe(false);
			}, 300);
		});
	});

	describe("Args", () => {
		testWithEffect("IsIdle timer arg", async () => {
			const idleState = new IsIdle(300);
			vitestSetTimeoutWrapper(() => {
				expect(idleState.current).toBe(false);
			}, 250);
			vitestSetTimeoutWrapper(() => {
				expect(idleState.current).toBe(true);
			}, 300);
		});
		describe("Default args don't get overwritten when other args are passed in", () => {
			test.todo("Initial state option get overwritten when passed in");
			test.todo("Initial state option get overwritten when passed in");
		});
	});
});
