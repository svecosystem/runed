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

function proxy<T>(
	value: unknown,
	root: T | undefined,
	proxies: WeakMap<WeakKey, unknown>,
	subscribe: VoidFunction | undefined,
	update: VoidFunction | undefined,
	serialize: (root?: T | undefined) => void
): T {
	if (value === null || typeof value !== "object") {
		return value as T;
	}
	const proto = Object.getPrototypeOf(value);
	if (proto !== null && proto !== Object.prototype && !Array.isArray(value)) {
		return value as T;
	}
	let p = proxies.get(value);
	if (!p) {
		p = new Proxy(value, {
			get: (target, property) => {
				subscribe?.();
				return proxy(Reflect.get(target, property), root, proxies, subscribe, update, serialize);
			},
			set: (target, property, value) => {
				update?.();
				Reflect.set(target, property, value);
				serialize(root);
				return true;
			},
		});
		proxies.set(value, p);
	}
	return p as T;
}

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
	#update: VoidFunction | undefined;
	#proxies = new WeakMap();

	constructor(key: string, initialValue: T, options: PersistedStateOptions<T> = {}) {
		const {
			storage: storageType = "local",
			serializer = { serialize: JSON.stringify, deserialize: JSON.parse },
			syncTabs = true,
		} = options;
		const window = "window" in options ? options.window : defaultWindow; // window is not mockable to be undefined without this, because JavaScript will fill undefined with `= default`

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
			this.#subscribe = createSubscriber((update) => {
				this.#update = update;
				const cleanup = on(window, "storage", this.#handleStorageEvent);
				return () => {
					cleanup();
					this.#update = undefined;
				};
			});
		}
	}

	get current(): T {
		this.#subscribe?.();

		const storageItem = this.#storage?.getItem(this.#key);
		const root = storageItem ? this.#deserialize(storageItem) : this.#current;
		return proxy(
			root,
			root,
			this.#proxies,
			this.#subscribe?.bind(this),
			this.#update?.bind(this),
			this.#serialize.bind(this)
		);
	}

	set current(newValue: T) {
		this.#serialize(newValue);
		this.#update?.();
	}

	#handleStorageEvent = (event: StorageEvent): void => {
		if (event.key !== this.#key || event.newValue === null) return;
		this.#current = this.#deserialize(event.newValue);
		this.#update?.();
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
