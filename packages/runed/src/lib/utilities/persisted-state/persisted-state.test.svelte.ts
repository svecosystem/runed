import { describe, expect } from "vitest";

import { testWithEffect } from "$lib/test/util.svelte.js";
import { PersistedState } from "./persisted-state.svelte.js";

const key = "test-key";
const initialValue = "test-value";
const existingValue = "test-existing-value";
const newValue = "test-new-value";

vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
	console.log("args:", args);
	const m = `console.error was called with args ${args.concat(", ")}`;
	console.log(m);
	throw new Error(m);
});

describe("PersistedState", async () => {
	beforeEach(() => {
		localStorage.clear();
		sessionStorage.clear();
	});

	testWithEffect("it does not console.error if window is not defined", () => {
		const persistedState = new PersistedState(key, initialValue, {
			window: undefined,
		});
		expect(persistedState.current).toBe(initialValue);
	});

	describe("localStorage", () => {
		testWithEffect("uses initial value if no persisted value is found", () => {
			const persistedState = new PersistedState(key, initialValue);
			expect(persistedState.current).toBe(initialValue);
		});

		testWithEffect("uses persisted value if it is found", () => {
			localStorage.setItem(key, JSON.stringify(existingValue));
			const persistedState = new PersistedState(key, initialValue);
			expect(persistedState.current).toBe(existingValue);
		});

		testWithEffect("updates localStorage when current value changes", () => {
			const persistedState = new PersistedState(key, initialValue);
			expect(persistedState.current).toBe(initialValue);

			persistedState.current = newValue;
			expect(persistedState.current).toBe(newValue);
			expect(localStorage.getItem(key)).toBe(JSON.stringify(newValue));
		});

		testWithEffect("updates localStorage when a nested property in current value changes", () => {
			const propValue = "test";
			const initialValue = { prop: { nested: propValue } };
			const newPropValue = "new test";
			const newValue = { prop: { nested: newPropValue } };
			const persistedState = new PersistedState(key, initialValue);
			expect(persistedState.current).toEqual(initialValue);

			persistedState.current.prop.nested = newPropValue;
			expect(persistedState.current).toEqual(newValue);
			expect(localStorage.getItem(key)).toBe(JSON.stringify(newValue));
		});

		testWithEffect("updates current value when localStorage changes", () => {
			const propValue = "test";
			const initialValue = { prop: { nested: propValue } };
			const newPropValue = "new test";
			const newValue = { prop: { nested: newPropValue } };
			const persistedState = new PersistedState(key, initialValue);
			expect(persistedState.current).toEqual(initialValue);
			localStorage.setItem(key, JSON.stringify(newValue));
			expect(persistedState.current).toEqual(newValue);
		});
	});

	describe("sessionStorage", () => {
		testWithEffect("uses initial value if no persisted value is found", () => {
			const persistedState = new PersistedState(key, initialValue, {
				storage: "session",
			});
			expect(persistedState.current).toBe(initialValue);
		});

		testWithEffect("uses persisted value if it is found", () => {
			sessionStorage.setItem(key, JSON.stringify(existingValue));
			const persistedState = new PersistedState(key, initialValue, {
				storage: "session",
			});
			expect(persistedState.current).toBe(existingValue);
		});

		testWithEffect("updates sessionStorage when current value changes", () => {
			const persistedState = new PersistedState(key, initialValue, {
				storage: "session",
			});
			expect(persistedState.current).toBe(initialValue);

			persistedState.current = newValue;
			expect(persistedState.current).toBe(newValue);
			expect(sessionStorage.getItem(key)).toBe(JSON.stringify(newValue));
		});
	});

	describe("serializer", () => {
		testWithEffect("uses provided serializer", () => {
			const iso2024JanFirst = "2024-01-01T00:00:00.000Z";
			const date2024JanFirst = new Date(iso2024JanFirst);
			localStorage.setItem(key, iso2024JanFirst);
			const serializer = {
				serialize: (value: Date) => value.toISOString(),
				deserialize: (value: string) => new Date(value),
			};
			const persistedState = new PersistedState(key, new Date(), {
				serializer,
			});
			expect(persistedState.current).toEqual(date2024JanFirst);

			const iso2024FebFirst = "2024-02-01T00:00:00.000Z";
			const date2024FebFirst = new Date(iso2024FebFirst);
			persistedState.current = date2024FebFirst;
			expect(persistedState.current).toEqual(date2024FebFirst);
			expect(localStorage.getItem(key)).toBe(iso2024FebFirst);
		});

		testWithEffect("can serialize complex objects (Set)", () => {
			const initialSet = new Set([1, 2, 3]);
			const serializer = {
				serialize: (value: Set<number>) => JSON.stringify(Array.from(value)),
				deserialize: (value: string) => new Set<number>(JSON.parse(value)),
			};
			const persistedState = new PersistedState(key, initialSet, {
				serializer,
			});
			expect(persistedState.current).toEqual(initialSet);
			const newSet = new Set([4, 5, 6]);
			persistedState.current = newSet;
			expect(persistedState.current).toEqual(newSet);
			expect(localStorage.getItem(key)).toBe(serializer.serialize(newSet));
		});
	});

	describe("syncTabs", () => {
		testWithEffect("updates persisted value when local storage changes independently", () => {
			$effect(() => {
				const persistedState = new PersistedState(key, initialValue);
				expect(persistedState.current).toBe(initialValue);

				localStorage.setItem(key, JSON.stringify(newValue));
				window.dispatchEvent(
					new StorageEvent("storage", {
						key,
						oldValue: null,
						newValue: JSON.stringify(newValue),
					})
				);
				expect(persistedState.current).toBe(newValue);
			});
		});

		testWithEffect(
			"does not update persisted value when local storage changes independently if syncTabs is false",
			() => {
				$effect(() => {
					const persistedState = new PersistedState(key, initialValue, {
						syncTabs: false,
					});
					expect(persistedState.current).toBe(initialValue);

					localStorage.setItem(key, JSON.stringify(newValue));
					window.dispatchEvent(
						new StorageEvent("storage", {
							key,
							oldValue: null,
							newValue: JSON.stringify(newValue),
						})
					);
					expect(persistedState.current).toBe(initialValue);
				});
			}
		);

		testWithEffect("does not handle the storage event when 'session' storage is used", () => {
			$effect(() => {
				const persistedState = new PersistedState(key, initialValue, {
					storage: "session",
				});
				expect(persistedState.current).toBe(initialValue);

				sessionStorage.setItem(key, JSON.stringify(newValue));
				window.dispatchEvent(
					new StorageEvent("storage", {
						key,
						oldValue: null,
						newValue: JSON.stringify(newValue),
					})
				);
				expect(persistedState.current).toBe(initialValue);
			});
		});
	});

	testWithEffect("makes plain objects reactive", () => {
		const initialValue = { prop: "value" };
		const persistedState = new PersistedState(key, initialValue);
		expect(persistedState.current).toEqual(initialValue);

		persistedState.current.prop = "new value";
		expect(persistedState.current.prop).toBe("new value");
		expect(localStorage.getItem(key)).toBe(JSON.stringify({ prop: "new value" }));
	});

	testWithEffect("makes complex sub-objects reactive", () => {
		const initialValue = {
			foo: {
				prop: 303,
			},
		};
		const persistedState = new PersistedState(key, initialValue);
		expect(persistedState.current).toEqual(initialValue);

		persistedState.current.foo.prop = 808;
		expect(persistedState.current.foo.prop).toBe(808);
		expect(localStorage.getItem(key)).toBe(JSON.stringify({ foo: { prop: 808 } }));
	});

	testWithEffect("does not make complex sub-objects reactive", () => {
		const testClass = class {
			prop = 303;
		};
		const initialValue = {
			foo: new testClass(),
		};
		const serializer = {
			serialize: (value: typeof initialValue) => {
				const toSerialize = {
					foo: {
						prop: value.foo.prop,
					},
				};
				return JSON.stringify(toSerialize);
			},
			deserialize: (value: string) => {
				const parsed = JSON.parse(value);
				const result = {
					foo: new testClass(),
				};
				result.foo.prop = parsed.foo.prop;
				return result;
			},
		};
		const persistedState = new PersistedState(key, initialValue, {
			serializer,
		});
		expect(persistedState.current).toEqual(initialValue);

		persistedState.current.foo.prop = 808;
		expect(persistedState.current.foo.prop).toBe(303);
		expect(localStorage.getItem(key)).toBe(JSON.stringify({ foo: { prop: 303 } }));
	});
});
