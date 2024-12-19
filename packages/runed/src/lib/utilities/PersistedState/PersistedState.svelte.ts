import { on } from "svelte/events";
import { createSubscriber } from "svelte/reactivity";

type Serializer<T> = {
	serialize: (value: T) => string;
	deserialize: (value: string) => T;
};

type StorageType = "local" | "session";

function getStorage(storageType: StorageType): Storage {
	switch (storageType) {
		case "local":
			return localStorage;
		case "session":
			return sessionStorage;
	}
}

type PersistedStateOptions<T> = {
	/** The storage type to use. Defaults to `local`. */
	storage?: StorageType;
	/** The serializer to use. Defaults to `JSON.stringify` and `JSON.parse`. */
	serializer?: Serializer<T>;
	/** Whether to sync with the state changes from other tabs. Defaults to `true`. */
	syncTabs?: boolean;
};

/**
 * Creates reactive state that is persisted and synchronized across browser sessions and tabs using Web Storage.
 * @param key The unique key used to store the state in the storage.
 * @param initialValue The initial value of the state if not already present in the storage.
 * @param options Configuration options including storage type, serializer for complex data types, and whether to sync state changes across tabs.
 *
 * @see {@link https://runed.dev/docs/utilities/persisted-state}
 */
export class PersistedState<T> {
	#current: T = $state()!;
	#key: string;
	#serializer: Serializer<T>;
	#storage?: Storage;
	#subscribe?: VoidFunction;

	constructor(key: string, initialValue: T, options: PersistedStateOptions<T> = {}) {
		const {
			storage: storageType = "local",
			serializer = { serialize: JSON.stringify, deserialize: JSON.parse },
			syncTabs = true,
		} = options;

		this.#current = initialValue;
		this.#key = key;
		this.#serializer = serializer;

		if (typeof window === "undefined") return;

		const storage = getStorage(storageType);
		this.#storage = storage;

		const existingValue = storage.getItem(key);
		if (existingValue !== null) {
			this.#deserialize(existingValue);
		}

		if (syncTabs && storageType === "local") {
			this.#subscribe = createSubscriber(() => {
				return on(window, "storage", this.#handleStorageEvent);
			});
		}
	}

	get current(): T {
		this.#subscribe?.();
		return this.#current;
	}

	set current(newValue: T) {
		this.#current = newValue;
		this.#serialize(newValue);
	}

	#handleStorageEvent = (event: StorageEvent): void => {
		if (event.key !== this.#key || event.newValue === null) return;

		this.#deserialize(event.newValue);
	};

	#deserialize(value: string): void {
		try {
			this.#current = this.#serializer.deserialize(value);
		} catch (error) {
			console.error(`Error when parsing "${value}" from persisted store "${this.#key}"`, error);
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
