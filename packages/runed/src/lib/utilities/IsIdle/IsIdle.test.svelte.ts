import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IsIdle } from "./IsIdle.svelte.js";
import { testWithEffect, vitestSetTimeoutWrapper } from "$lib/test/util.svelte.js";

describe("IsIdle", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.clearAllTimers();
	});

	const DEFAULT_IDLE_TIME = 500;
	describe("Default behaviors", () => {
		testWithEffect("Initially set to false", async () => {
			const idleState = new IsIdle();
			expect(idleState.current).toBe(false);
		});

		testWithEffect("IsIdle is set to true when no activity occurs", async () => {
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
		testWithEffect("Initial state option gets overwritten when passed in", async () => {
			const idleState = new IsIdle(undefined, { initialState: true });
			expect(idleState.current).toBe(true);
		});
		it.skip("Events args work gets overwritten when passed in", async () => {
			const idleState = new IsIdle(undefined, { events: ["keypress"] });

			vitestSetTimeoutWrapper(() => {
				const input = document.createElement("input");
				document.body.appendChild(input);
				input.click();
				expect(idleState.current).toBe(true);
				// TODO: add jest-dom to handle events
			}, DEFAULT_IDLE_TIME);
		});
	});
});
