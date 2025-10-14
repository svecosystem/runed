import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import { IsIdle } from "./is-idle.svelte.js";
import { testWithEffect, vitestSetTimeoutWrapper } from "$lib/test/util.svelte.js";
import { flushSync } from "svelte";

describe("IsIdle", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.clearAllTimers();
	});

	const DEFAULT_IDLE_TIME = 60_000;
	describe("Default behaviors", () => {
		testWithEffect("Initially set to false", async () => {
			const idleState = new IsIdle();
			expect(idleState.current).toBe(false);
		});

		testWithEffect("IsIdle is set to true when no activity occurs", async () => {
			const idleState = new IsIdle();
			flushSync();
			vi.advanceTimersByTime(DEFAULT_IDLE_TIME + 1);
			expect(idleState.current).toBe(true);
		});

		testWithEffect("IsIdle is set to false on click event", async () => {
			const idleState = new IsIdle();

			flushSync();
			vi.advanceTimersByTime(DEFAULT_IDLE_TIME + 1);
			const input = document.createElement("input");
			document.body.appendChild(input);
			try {
				expect(idleState.current).toBe(true);
				input.click();
				expect(idleState.current).toBe(false);
			} finally {
				input.remove();
			}
		});
	});

	describe("lastActive", () => {
		testWithEffect("set to last active time", () => {
			const idleState = new IsIdle();
			flushSync();
			const lastActive = idleState.lastActive;
			vi.advanceTimersByTime(200);
			window.dispatchEvent(new Event("click"));
			expect(idleState.lastActive).toBeGreaterThan(lastActive);
		});

		testWithEffect("updates when trackLastActive is true (default)", () => {
			const idleState = new IsIdle({ trackLastActive: true });
			flushSync();
			const initialLastActive = idleState.lastActive;

			vi.advanceTimersByTime(500);
			window.dispatchEvent(new Event("click"));

			expect(idleState.lastActive).toBeGreaterThan(initialLastActive);

			const secondLastActive = idleState.lastActive;
			vi.advanceTimersByTime(500);
			window.dispatchEvent(new Event("mousemove"));

			expect(idleState.lastActive).toBeGreaterThan(secondLastActive);
		});

		testWithEffect("does not update when trackLastActive is false", () => {
			const idleState = new IsIdle({ trackLastActive: false });
			flushSync();
			const initialLastActive = idleState.lastActive;

			vi.advanceTimersByTime(500);
			window.dispatchEvent(new Event("click"));

			expect(idleState.lastActive).toBe(initialLastActive);

			vi.advanceTimersByTime(500);
			window.dispatchEvent(new Event("mousemove"));

			expect(idleState.lastActive).toBe(initialLastActive);
		});
	});

	describe("Args", () => {
		testWithEffect("IsIdle timer arg", async () => {
			const idleState = new IsIdle({ timeout: 300 });
			vitestSetTimeoutWrapper(() => {
				expect(idleState.current).toBe(false);
			}, 200);
			vitestSetTimeoutWrapper(() => {
				expect(idleState.current).toBe(true);
			}, 300);
		});

		testWithEffect("Initial state option gets overwritten when passed in", async () => {
			const idleState = new IsIdle({ initialState: true });
			expect(idleState.current).toBe(true);
		});

		testWithEffect("Events args work gets overwritten when passed in", () => {
			const idleState = new IsIdle({ events: ["keypress"] });
			flushSync();

			const input = document.createElement("input");
			document.body.appendChild(input);
			vi.advanceTimersByTime(DEFAULT_IDLE_TIME + 1);
			try {
				input.click();
				expect(idleState.current).toBe(true);
			} finally {
				input.remove();
			}
		});
	});

	describe("detectVisibilityChanges", () => {
		testWithEffect("causes activity", () => {
			const idleState = new IsIdle({
				detectVisibilityChanges: true,
			});

			flushSync();
			vi.advanceTimersByTime(DEFAULT_IDLE_TIME + 1);
			expect(idleState.current).toBe(true);

			document.dispatchEvent(new Event("visibilitychange"));
			expect(idleState.current).toBe(false);
		});
	});
});
