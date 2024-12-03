import { describe, expect } from "vitest";

import { delay, testWithEffect } from "$lib/test/util.svelte.js";
import { PersistedState } from "./index.js";

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
			const persistedState = new PersistedState(key, initialValue);
			expect(persistedState.current).toBe(initialValue);
		});

		testWithEffect("uses persisted value if it is found", async () => {
			localStorage.setItem(key, JSON.stringify(existingValue));
			const persistedState = new PersistedState(key, initialValue);
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(persistedState.current).toBe(existingValue);
		});

		testWithEffect("updates localStorage when current value changes", async () => {
			const persistedState = new PersistedState(key, initialValue);
			expect(persistedState.current).toBe(initialValue);
			persistedState.current = "new-value";
			expect(persistedState.current).toBe("new-value");
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(localStorage.getItem(key)).toBe(JSON.stringify("new-value"));
		});
	});

	describe("sessionStorage", () => {
		testWithEffect("uses initial value if no persisted value is found", () => {
			const persistedState = new PersistedState(key, initialValue, { storage: "session" });
			expect(persistedState.current).toBe(initialValue);
		});

		testWithEffect("uses persisted value if it is found", async () => {
			sessionStorage.setItem(key, JSON.stringify(existingValue));
			const persistedState = new PersistedState(key, initialValue, { storage: "session" });
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(persistedState.current).toBe(existingValue);
		});

		testWithEffect("updates sessionStorage when current value changes", async () => {
			const persistedState = new PersistedState(key, initialValue, { storage: "session" });
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
				serialize: (value: Date) => value.toISOString(),
				deserialize: (value: string) => new Date(value),
			};
			const persistedState = new PersistedState(key, date, { serializer });
			expect(persistedState.current).toBe(date);
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(persistedState.current).toBe(date);
			expect(localStorage.getItem(key)).toBe(isoDate);
		});
	});

	describe("syncTabs", () => {
		testWithEffect("updates persisted value when local storage changes independently", async () => {
			const persistedState = new PersistedState(key, initialValue);
			await delay();
			expect(persistedState.current).toBe(initialValue);
			const newValue = "new-value";
			localStorage.setItem(key, JSON.stringify(newValue));
			const event = new StorageEvent("storage", {
				key,
				oldValue: initialValue,
				newValue: JSON.stringify(newValue),
			});
			window.dispatchEvent(event);
			await delay();
			expect(persistedState.current).toBe(newValue);
		});

		testWithEffect(
			"does not update persisted value when local storage changes independently if syncTabs is false",
			async () => {
				const persistedState = new PersistedState(key, initialValue, { syncTabs: false });
				await delay();
				const newValue = "new-value";
				localStorage.setItem(key, JSON.stringify(newValue));
				const event = new StorageEvent("storage", {
					key,
					oldValue: initialValue,
					newValue: JSON.stringify(newValue),
				});
				window.dispatchEvent(event);
					await delay();
				expect(persistedState.current).toBe(initialValue);
			}
		);

		testWithEffect("does not handle the storage event when 'session' storage is used", async () => {
			const persistedState = new PersistedState(key, initialValue, { storage: "session" });
			await delay();
			const newValue = "new-value";
			localStorage.setItem(key, JSON.stringify(newValue));
			const event = new StorageEvent("storage", {
				key,
				oldValue: initialValue,
				newValue: JSON.stringify(newValue),
			});
			window.dispatchEvent(event);
			await delay();
			expect(persistedState.current).toBe(initialValue);
		});
	});
});
