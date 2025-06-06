import { defaultWindow, type ConfigurableWindow } from "$lib/internal/configurable-globals.js";
import { on } from "svelte/events";
import { createSubscriber } from "svelte/reactivity";

type Serializer<T> = {
	serialize: (value: T) => string;
	deserialize: (value: string) => T;
};

type StorageType = "local" | "session";

// use this on error instead of `undefined` to avoid false positives in the deserialization error check
const DESERIALIZATION_ERROR = Symbol("[persisted-state] deserialization error");
type DESERIALIZATION_ERROR = typeof DESERIALIZATION_ERROR;

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
	/** The serializer to use. Defaults to `JSON.stringify` and `JSON.parse` with slight modification. */
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
	#current: T;
	#key: string;
	#serializer: Serializer<T>;
	#storage?: Storage;
	#subscribe?: VoidFunction;
	#initialValue: T;
	#version = $state(0);

	constructor(key: string, initialValue: T, options: PersistedStateOptions<T> = {}) {
		const {
			storage: storageType = "local",
			serializer = { serialize: JSON.stringify, deserialize: (val) => {
				if (val === "undefined") return undefined; // JSON.parse can't parse "undefined", but JSON.stringify will serialize undefined to "undefined"
				return JSON.parse(val);
			} },
			syncTabs = true,
		} = options;
		const window = "window" in options ? options.window : defaultWindow; // window is not mockable to be undefined without this, because JavaScript will fill undefined with `= default`

		this.#initialValue = initialValue;
		this.#current = initialValue;
		this.#key = key;
		this.#serializer = serializer;

		if (window === undefined) return;

		const storage = getStorage(storageType, window);
		this.#storage = storage;

		const existingValue = storage.getItem(key);
		if (existingValue !== null) {
			const deserialized = this.#deserialize(existingValue);
			if (deserialized !== DESERIALIZATION_ERROR) {
				this.#current = deserialized;
			}
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

		const storageItem = this.#storage?.getItem(this.#key);
		let root = storageItem ? this.#deserialize(storageItem) : this.#current;
		if (root === DESERIALIZATION_ERROR) {
			root = this.#initialValue;
		}

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
		if (event.key !== this.#key) return;
		if (event.newValue === null) return; // maybe PersistedStorage.current should also be deleted?
		const newVal = this.#deserialize(event.newValue);
		if (newVal !== DESERIALIZATION_ERROR) {
			this.#current = newVal;
			this.#version += 1;
		}
	};

	#deserialize(value: string): T | DESERIALIZATION_ERROR {
		try {
			return this.#serializer.deserialize(value);
		} catch (error) {
			console.error(`Error when parsing "${value}" from persisted store "${this.#key}"`, error);
			return DESERIALIZATION_ERROR;
		}
	}

	#serialize(value: T): void {
		try {
			this.#storage?.setItem(this.#key, this.#serializer.serialize(value));
		} catch (error) {
			console.error(
				`Error when writing value from persisted store "${this.#key}" to ${this.#storage}`,
				error
			);
		}
	}
}
