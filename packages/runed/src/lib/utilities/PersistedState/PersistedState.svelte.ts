import { addEventListener } from "$lib/internal/utils/event.js";
import { createSubscriber } from "svelte/reactivity";

type Serializer<T> = {
	serialize: (value: T) => string;
	deserialize: (value: string) => T;
};

type GetValueFromStorageResult<T> =
	| {
			found: true;
			value: T;
	  }
	| {
			found: false;
			value: null;
	  };
function getValueFromStorage<T>({
	key,
	storage,
	serializer,
}: {
	key: string;
	storage: Storage | null;
	serializer: Serializer<T>;
}): GetValueFromStorageResult<T> {
	if (!storage) return { found: false, value: null };

	const value = storage.getItem(key);

	if (value === null) return { found: false, value: null };

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

function setValueToStorage<T>({
	key,
	value,
	storage,
	serializer,
}: {
	key: string;
	value: T;
	storage: Storage | null;
	serializer: Serializer<T>;
}) {
	if (!storage) return;

	try {
		storage.setItem(key, serializer.serialize(value));
	} catch (e) {
		console.error(`Error when writing value from persisted store "${key}" to ${storage}`, e);
	}
}

type StorageType = "local" | "session";

function getStorage(storageType: StorageType): Storage | null {
	if (typeof window === "undefined") return null;

	const storageByStorageType = {
		local: localStorage,
		session: sessionStorage,
	} satisfies Record<StorageType, Storage>;

	return storageByStorageType[storageType];
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
	#storage: Storage | null;
	#serializer: Serializer<T>;
	#subscribe: VoidFunction;

	constructor(key: string, initialValue: T, options: PersistedStateOptions<T> = {}) {
		const {
			storage: storageType = "local",
			serializer = { serialize: JSON.stringify, deserialize: JSON.parse },
			syncTabs = true,
		} = options;

		this.#key = key;
		this.#storage = getStorage(storageType);
		this.#serializer = serializer;

		const valueFromStorage = getValueFromStorage({
			key: this.#key,
			storage: this.#storage,
			serializer: this.#serializer,
		});

		this.#current = valueFromStorage.found ? valueFromStorage.value : initialValue;

		this.#subscribe = createSubscriber(() => {
			return $effect.root(() => {
				$effect(() => {
					setValueToStorage({
						key: this.#key,
						value: this.#current,
						storage: this.#storage,
						serializer: this.#serializer,
					});
				});

				$effect(() => {
					if (!syncTabs || storageType !== "local") return;

					return addEventListener(window, "storage", this.#handleStorageEvent);
				});
			});
		});
	}

	#handleStorageEvent = (event: StorageEvent): void => {
		if (event.key !== this.#key || !this.#storage) return;

		const valueFromStorage = getValueFromStorage({
			key: this.#key,
			storage: this.#storage,
			serializer: this.#serializer,
		});

		if (valueFromStorage.found) {
			this.#current = valueFromStorage.value;
		}
	};

	get current(): T {
		this.#subscribe();
		return this.#current;
	}

	set current(newValue: T) {
		this.#current = newValue;
	}
}
