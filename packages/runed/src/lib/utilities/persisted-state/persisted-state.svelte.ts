import { defaultWindow, type ConfigurableWindow } from "$lib/internal/configurable-globals.js";
import { on } from "svelte/events";
import { createSubscriber } from "svelte/reactivity";

type Serializer<T> = {
	serialize: (value: T) => string;
	deserialize: (value: string) => T | undefined;
};

type StorageType = "local" | "session";

function getStorage(storageType: StorageType, window: Window & typeof globalThis): Storage {
	switch (storageType) {
		case "local":
			return window.localStorage;
		case "session":
			return window.sessionStorage;
	}
}

type PersistedStateOptions<T> = {
	/** The storage type to use. Defaults to `local`. */
	storage?: StorageType;
	/** The serializer to use. Defaults to `JSON.stringify` and `JSON.parse`. */
	serializer?: Serializer<T>;
	/** Whether to sync with the state changes from other tabs. Defaults to `true`. */
	syncTabs?: boolean;
} & ConfigurableWindow;

/**
 * Creates reactive state that is persisted and synchronized across browser sessions and tabs using Web Storage.
 * @param key The unique key used to store the state in the storage.
 * @param initialValue The initial value of the state if not already present in the storage.
 * @param options Configuration options including storage type, serializer for complex data types, and whether to sync state changes across tabs.
 *
 * @see {@link https://runed.dev/docs/utilities/persisted-state}
 */
export class PersistedState<T> {
	#current: T | undefined;
	#key: string;
	#serializer: Serializer<T>;
	#storage?: Storage;
	#subscribe?: VoidFunction;
	#version = $state(0);

	constructor(key: string, initialValue: T, options: PersistedStateOptions<T> = {}) {
		const {
			storage: storageType = "local",
			serializer = { serialize: JSON.stringify, deserialize: JSON.parse },
			syncTabs = true,
			window = defaultWindow,
		} = options;

		this.#current = initialValue;
		this.#key = key;
		this.#serializer = serializer;

		if (window === undefined) return;

		const storage = getStorage(storageType, window);
		this.#storage = storage;

		const existingValue = storage.getItem(key);
		if (existingValue !== null) {
			this.#current = this.#deserialize(existingValue);
		} else {
			this.#serialize(initialValue);
		}

		if (syncTabs && storageType === "local") {
			this.#subscribe = createSubscriber(() => {
				return on(window, "storage", this.#handleStorageEvent);
			});
		}
	}

	get current(): T {
		this.#subscribe?.();
		this.#version;
		const root = this.#deserialize(this.#storage?.getItem(this.#key) as string) ?? this.#current;
		const proxies = new WeakMap();
		const proxy = (value: unknown) => {
			if (value === null || value?.constructor.name === "Date" || typeof value !== "object") {
				return value;
			}
			let p = proxies.get(value);
			if (!p) {
				p = new Proxy(value, {
					get: (target, property) => {
						this.#version;
						return proxy(Reflect.get(target, property));
					},
					set: (target, property, value) => {
						this.#version += 1;
						Reflect.set(target, property, value);
						this.#serialize(root);
						return true;
					},
				});
				proxies.set(value, p);
			}
			return p;
		};
		return proxy(root);
	}

	set current(newValue: T) {
		this.#serialize(newValue);
		this.#version += 1;
	}

	#handleStorageEvent = (event: StorageEvent): void => {
		if (event.key !== this.#key || event.newValue === null) return;
		this.#current = this.#deserialize(event.newValue);
		this.#version += 1;
	};

	#deserialize(value: string): T | undefined {
		try {
			return this.#serializer.deserialize(value);
		} catch (error) {
			console.error(`Error when parsing "${value}" from persisted store "${this.#key}"`, error);
			return;
		}
	}

	#serialize(value: T | undefined): void {
		try {
			if (value != undefined) {
				this.#storage?.setItem(this.#key, this.#serializer.serialize(value));
			}
		} catch (error) {
			console.error(
				`Error when writing value from persisted store "${this.#key}" to ${this.#storage}`,
				error
			);
		}
	}
}
