import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import { IsIdle } from "./IsIdle.svelte.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

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

	testWithEffect("Initially set to false", async () => {
		const idleState = new IsIdle();
		expect(idleState.current).toBe(false);
	});

	testWithEffect("IsIdle is set to true when arg is passed in", async () => {
		const idleState = new IsIdle(300);
		setTimeout(async () => {
			expect(idleState.current).toBe(true);
		}, 302);

		vi.advanceTimersByTime(301);
	});

	testWithEffect("IsIdle is set to false on click event", async () => {
		const idleState = new IsIdle(300);
		setTimeout(async () => {
			expect(idleState.current).toBe(true);
			const input = document.createElement("input");
			document.body.appendChild(input);
			input.click();
			expect(idleState.current).toBe(false);
		}, 302);

		vi.advanceTimersByTime(301);
	});

  testWithEffect('test', async () => {
    const idleState = new IsIdle(300);

    vitestSetTimeoutWrapper(() => {
			expect(idleState.current).toBe(true);
			const input = document.createElement("input");
			document.body.appendChild(input);
			input.click();
			expect(idleState.current).toBe(false);
    }, 300)
  })
});
