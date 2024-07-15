import { untrack } from "svelte";
import { addEventListener } from "$lib/internal/utils/event.js";

type Serializer<T> = {
	serialize: (value: T) => string;
	deserialize: (value: string) => T;
};

interface StorageAdapter {
	getItem: (key: string) => Promise<string | null>;
	setItem: (key: string, value: string) => Promise<void>;
	subscribe?: (callback: (key: string, newValue: string | null) => void) => () => void;
}

class BrowserStorageAdapter implements StorageAdapter {
	#storage: Storage;

	constructor(storage: Storage) {
		this.#storage = storage;
	}

	async getItem(key: string): Promise<string | null> {
		return this.#storage.getItem(key);
	}

	async setItem(key: string, value: string): Promise<void> {
		this.#storage.setItem(key, value);
	}

	subscribe(callback: (key: string, newValue: string | null) => void): () => void {
		const listener = (event: StorageEvent) => {
			if (event.key === null) {
				return;
			}

			callback(event.key, event.newValue);
		};

		const unsubscribe = addEventListener(window, "storage", listener.bind(this));

		return () => {
			unsubscribe();
		};
	}
}

type GetValueFromStorageResult<T> =
	| {
			found: true;
			value: T;
	  }
	| {
			found: false;
			value: null;
	  };

async function getValueFromStorage<T>({
	key,
	storage,
	serializer,
}: {
	key: string;
	storage: StorageAdapter;
	serializer: Serializer<T>;
}): Promise<GetValueFromStorageResult<T>> {
	if (!storage) {
		return { found: false, value: null };
	}

	const value = await storage.getItem(key);
	if (value === null) {
		return { found: false, value: null };
	}

	try {
		return {
			found: true,
			value: serializer.deserialize(value),
		};
	} catch (e) {
		console.error(`Error when parsing ${value} from persisted store "${key}"`, e);
		return {
			found: false,
			value: null,
		};
	}
}

async function setValueToStorage<T>({
	key,
	value,
	storage,
	serializer,
}: {
	key: string;
	value: T;
	storage: StorageAdapter | null;
	serializer: Serializer<T>;
}) {
	if (!storage) {
		return;
	}

	try {
		await storage.setItem(key, serializer.serialize(value));
	} catch (e) {
		console.error(
			`Error when writing value from persisted store "${key}" to ${storage.constructor.name}`,
			e
		);
	}
}

// type StorageType = "local" | "session";

// function getStorage(storageType: StorageType): Storage | null {
// 	if (typeof window === "undefined") {
// 		return null;
// 	}

// 	const storageByStorageType = {
// 		local: localStorage,
// 		session: sessionStorage,
// 	} satisfies Record<StorageType, Storage>;

// 	return storageByStorageType[storageType];
// }

// type PersistedStateOptions<T> = {
// 	/** The storage type to use. Defaults to `local`. */
// 	storage?: StorageType;
// 	/** The serializer to use. Defaults to `JSON.stringify` and `JSON.parse`. */
// 	serializer?: Serializer<T>;
// 	/** Whether to sync with the state changes from other tabs. Defaults to `true`. */
// 	syncTabs?: boolean;
// };

// /**
//  * Creates reactive state that is persisted and synchronized across browser sessions and tabs using Web Storage.
//  * @param key The unique key used to store the state in the storage.
//  * @param initialValue The initial value of the state if not already present in the storage.
//  * @param options Configuration options including storage type, serializer for complex data types, and whether to sync state changes across tabs.
//  *
//  * @see {@link https://runed.dev/docs/utilities/persisted-state}
//  */
// export class Persisted<T> {
// 	#current = $state() as T;
// 	#key: string;
// 	#storage: Storage | null;
// 	#serializer: Serializer<T>;

// 	constructor(key: string, initialValue: T, options: PersistedStateOptions<T> = {}) {
// 		const {
// 			storage: storageType = "local",
// 			serializer = { serialize: JSON.stringify, deserialize: JSON.parse },
// 			syncTabs = true,
// 		} = options;

// 		this.#key = key;
// 		this.#storage = getStorage(storageType);
// 		this.#serializer = serializer;

// 		const valueFromStorage = getValueFromStorage({
// 			key: this.#key,
// 			storage: this.#storage,
// 			serializer: this.#serializer,
// 		});

// 		this.#current = valueFromStorage.found ? valueFromStorage.value : initialValue;

// 		$effect(() => {
// 			setValueToStorage({
// 				key: this.#key,
// 				value: this.#current,
// 				storage: this.#storage,
// 				serializer: this.#serializer,
// 			});
// 		});

// 		$effect(() => {
// 			if (!syncTabs) {
// 				return;
// 			}

// 			return addEventListener(window, "storage", this.#handleStorageEvent.bind(this));
// 		});
// 	}

// 	#handleStorageEvent(event: StorageEvent) {
// 		if (event.key !== this.#key || !this.#storage) {
// 			return;
// 		}

// 		const valueFromStorage = getValueFromStorage({
// 			key: this.#key,
// 			storage: this.#storage,
// 			serializer: this.#serializer,
// 		});

// 		if (valueFromStorage.found) {
// 			this.#current = valueFromStorage.value;
// 		}
// 	}

// 	get current(): T {
// 		return this.#current;
// 	}

// 	set current(newValue: T) {
// 		this.#current = newValue;
// 	}
// }

function getStorageAdapterForStorageType(storageType: StorageType): StorageAdapter | null {
	if (typeof window === "undefined") {
		return null;
	}

	const storageAdapterByStorageType = {
		local: new BrowserStorageAdapter(localStorage),
		session: new BrowserStorageAdapter(sessionStorage),
	};

	return storageAdapterByStorageType[storageType];
}

type StorageType = "local" | "session";

type PersistedStateOptions<T> = {
	/** The storage type to use. Defaults to `local`. */
	storage?: StorageType | StorageAdapter;
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
export class Persisted<T> {
	#current = $state() as T;
	#isInitialized = $state(false);
	#initialValue: T;
	#key: string;
	#storageAdapter: StorageAdapter | null;
	#serializer: Serializer<T>;

	constructor(key: string, initialValue: T, options: PersistedStateOptions<T> = {}) {
		const {
			storage = "local",
			serializer = { serialize: JSON.stringify, deserialize: JSON.parse },
			syncTabs = true,
		} = options;

		this.#key = key;
		this.#initialValue = initialValue;
		this.#storageAdapter =
			typeof storage === "string" ? getStorageAdapterForStorageType(storage) : storage;
		this.#serializer = serializer;

		$effect(() => {
			if (!this.#isInitialized) {
				return;
			}

			setValueToStorage({
				key: this.#key,
				value: this.#current,
				storage: this.#storageAdapter,
				serializer: this.#serializer,
			});
		});

		if (syncTabs) {
			$effect(() => {
				return untrack(() => {
					if (!this.#storageAdapter?.subscribe) {
						return;
					}

					const unsubscribe = this.#storageAdapter
						.subscribe(async (key, newValue) => {
							if (key === this.#key && newValue !== null) {
								this.#current = this.#serializer.deserialize(newValue);
							}
						})
						.bind(this);

					return unsubscribe;
				});
			});
		}

		this.init();
	}

	async init() {
		if (!this.#storageAdapter) {
			return;
		}

		const valueFromStorage = await getValueFromStorage({
			key: this.#key,
			storage: this.#storageAdapter,
			serializer: this.#serializer,
		});
		if (!valueFromStorage.found) {
			return;
		}

		this.#current = valueFromStorage.value;
		this.#isInitialized = true;
	}

	get current(): T {
		return this.#isInitialized ? this.#current : this.#initialValue;
	}

	set current(newValue: T) {
		this.#current = newValue;
		this.#isInitialized ||= true;
	}
}
