import { untrack } from "svelte";
import { addEventListener } from "$lib/internal/utils/event.js";

type Serializer<T> = {
	serialize: (value: T) => string;
	deserialize: (value: string) => T;
};

type GetItemResult<T> =
	| {
			found: false;
			value: null;
	  }
	| {
			found: true;
			value: T;
	  };

interface StorageAdapter<T> {
	getItem: (key: string) => Promise<GetItemResult<T>>;
	setItem: (key: string, value: T) => Promise<void>;
	subscribe?: (callback: (key: string, newValue: GetItemResult<T>) => void) => () => void;
}

export class WebStorageAdapter<T> implements StorageAdapter<T> {
	#storage: Storage;
	#serializer: Serializer<T>;

	constructor({
		storage,
		serializer = {
			serialize: JSON.stringify,
			deserialize: JSON.parse,
		},
	}: {
		storage: Storage;
		serializer?: Serializer<T>;
	}) {
		this.#storage = storage;
		this.#serializer = serializer;
	}

	async getItem(key: string): Promise<GetItemResult<T>> {
		const value = this.#storage.getItem(key);
		return value !== null
			? { found: true, value: this.#serializer.deserialize(value) }
			: { found: false, value: null };
	}

	async setItem(key: string, value: T): Promise<void> {
		const serializedValue = this.#serializer.serialize(value);
		this.#storage.setItem(key, serializedValue);
	}

	subscribe(callback: (key: string, newValue: GetItemResult<T>) => void): () => void {
		const listener = (event: StorageEvent) => {
			if (event.key === null) {
				return;
			}

			const result: GetItemResult<T> =
				event.newValue !== null
					? { found: true, value: this.#serializer.deserialize(event.newValue) }
					: { found: false, value: null };

			callback(event.key, result);
		};

		const unsubscribe = addEventListener(window, "storage", listener.bind(this));

		return () => {
			unsubscribe();
		};
	}
}

async function setValueToStorage<T>({
	key,
	value,
	storage,
}: {
	key: string;
	value: T;
	storage: StorageAdapter<T> | null;
}) {
	if (!storage) {
		return;
	}

	try {
		await storage.setItem(key, value);
	} catch (e) {
		console.error(
			`Error when writing value from persisted store "${key}" to ${storage.constructor.name}`,
			e
		);
	}
}

function getWebStorageAdapterForStorageType<T>(storageType: StorageType): StorageAdapter<T> | null {
	if (typeof window === "undefined") {
		return null;
	}

	const webStorageAdapterByStorageType = {
		local: new WebStorageAdapter<T>({ storage: localStorage }),
		session: new WebStorageAdapter<T>({ storage: sessionStorage }),
	};

	return webStorageAdapterByStorageType[storageType];
}

type StorageType = "local" | "session";

type PersistedStateOptions<T> = {
	/** The storage type to use. Defaults to `local`. */
	storage?: StorageType | StorageAdapter<T>;
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
	#storageAdapter: StorageAdapter<T> | null;

	constructor(key: string, initialValue: T, options: PersistedStateOptions<T> = {}) {
		const { storage = "local", syncTabs = true } = options;

		this.#key = key;
		this.#initialValue = initialValue;
		this.#storageAdapter =
			typeof storage === "string" ? getWebStorageAdapterForStorageType(storage) : storage;

		$effect(() => {
			if (!this.#isInitialized) {
				return;
			}

			setValueToStorage({
				key: this.#key,
				value: this.#current,
				storage: this.#storageAdapter,
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
							if (key !== this.#key || !newValue.found) {
								return;
							}

							this.#current = newValue.value;
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

		const valueFromStorage = await this.#storageAdapter.getItem(this.#key);
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
