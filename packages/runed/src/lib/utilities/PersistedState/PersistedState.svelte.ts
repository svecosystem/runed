import { addEventListener } from "$lib/internal/utils/event.js";

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
	if (!storage) {
		return { found: false, value: null };
	}

	const value = storage.getItem(key);
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
	if (!storage) {
		return;
	}

	try {
		storage.setItem(key, serializer.serialize(value));
	} catch (e) {
		console.error(`Error when writing value from persisted store "${key}" to ${storage}`, e);
	}
}

type StorageType = "local" | "session";

function getStorage(storageType: StorageType): Storage | null {
	if (typeof window === "undefined") {
		return null;
	}

	const storageByStorageType = {
		local: localStorage,
		session: sessionStorage,
	} satisfies Record<StorageType, Storage>;

	return storageByStorageType[storageType];
}

type PersistedStateOptions<T> = {
	storage?: StorageType;
	serializer?: Serializer<T>;
};

export class PersistedState<T> {
	#current = $state() as T;
	#key: string;
	#storage: Storage | null;
	#serializer: Serializer<T>;

	constructor(key: string, initialValue: T, options: PersistedStateOptions<T> = {}) {
		const {
			storage: storageType = "local",
			serializer = { serialize: JSON.stringify, deserialize: JSON.parse },
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

		$effect.pre(() => {
			setValueToStorage({
				key: this.#key,
				value: this.#current,
				storage: this.#storage,
				serializer: this.#serializer,
			});
		});

		$effect(() => {
			return addEventListener(window, "storage", this.#handleStorageEvent.bind(this));
		});
	}

	#handleStorageEvent(event: StorageEvent) {
		if (event.key !== this.#key || !this.#storage) {
			return;
		}

		const valueFromStorage = getValueFromStorage({
			key: this.#key,
			storage: this.#storage,
			serializer: this.#serializer,
		});

		if (valueFromStorage.found) {
			this.#current = valueFromStorage.value;
		}
	}

	get current(): T {
		return this.#current;
	}

	set current(newValue: T) {
		this.#current = newValue;
	}
}
