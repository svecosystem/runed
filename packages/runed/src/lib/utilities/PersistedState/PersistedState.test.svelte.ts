import { describe, expect } from "vitest";

import { Persisted, WebStorageAdapter } from "./index.js";
import { testWithEffect } from "$lib/test/util.svelte.js";

const key = "test-key";
const initialValue = "test-value";
const existingValue = "existing-value";

describe("PersistedState", () => {
	beforeEach(() => {
		localStorage.clear();
		sessionStorage.clear();
	});

	describe("localStorage", () => {
		testWithEffect("uses initial value if no persisted value is found", () => {
			const persistedState = new Persisted(key, initialValue);
			expect(persistedState.current).toBe(initialValue);
		});

		testWithEffect("uses persisted value if it is found", async () => {
			localStorage.setItem(key, JSON.stringify(existingValue));
			const persistedState = new Persisted(key, initialValue);
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(persistedState.current).toBe(existingValue);
		});

		testWithEffect("updates localStorage when current value changes", async () => {
			const persistedState = new Persisted(key, initialValue);
			expect(persistedState.current).toBe(initialValue);
			persistedState.current = "new-value";
			expect(persistedState.current).toBe("new-value");
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(localStorage.getItem(key)).toBe(JSON.stringify("new-value"));
		});
	});

	describe("sessionStorage", () => {
		testWithEffect("uses initial value if no persisted value is found", () => {
			const persistedState = new Persisted(key, initialValue, { storage: "session" });
			expect(persistedState.current).toBe(initialValue);
		});

		testWithEffect("uses persisted value if it is found", async () => {
			sessionStorage.setItem(key, JSON.stringify(existingValue));
			const persistedState = new Persisted(key, initialValue, { storage: "session" });
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(persistedState.current).toBe(existingValue);
		});

		testWithEffect("updates sessionStorage when current value changes", async () => {
			const persistedState = new Persisted(key, initialValue, { storage: "session" });
			expect(persistedState.current).toBe(initialValue);
			persistedState.current = "new-value";
			expect(persistedState.current).toBe("new-value");
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(sessionStorage.getItem(key)).toBe(JSON.stringify("new-value"));
		});
	});

	describe("serializer", () => {
		testWithEffect("uses provided serializer", async () => {
			const isoDate = "2024-01-01T00:00:00.000Z";
			const date = new Date(isoDate);

			const serializer = {
				serialize: (value: Date) => {
					return value.toISOString();
				},
				deserialize: (value: string) => {
					return new Date(value);
				},
			};
			const persistedState = new Persisted(key, date, {
				storage: new WebStorageAdapter({
					storage: localStorage,
					serializer,
				}),
			});
			// persistedState.current = date;
			// await new Promise((resolve) => setTimeout(resolve, 50));
			expect(persistedState.current).toBe(date);
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(persistedState.current).toBe(date);
			expect(localStorage.getItem(key)).toBe(isoDate);
		});
	});

	describe.skip("syncTabs", () => {
		testWithEffect("updates persisted value when local storage changes independently", async () => {
			// TODO: figure out why this test is failing even though it works in the browser. maybe jsdom doesn't emit storage events?
			// expect(true).toBe(true);
			// const persistedState = new PersistedState(key, initialValue);
			// localStorage.setItem(key, JSON.stringify("new-value"));
			// await new Promise((resolve) => setTimeout(resolve, 0));
			// expect(persistedState.current).toBe("new-value");
		});

		// TODO: this test passes, but likely only because the storage event is not being emitted either way from jsdom
		testWithEffect(
			"does not update persisted value when local storage changes independently if syncTabs is false",
			async () => {
				const persistedState = new Persisted(key, initialValue, { syncChanges: false });
				localStorage.setItem(key, JSON.stringify("new-value"));
				await new Promise((resolve) => setTimeout(resolve, 0));
				expect(persistedState.current).toBe(initialValue);
			}
		);
	});
});
