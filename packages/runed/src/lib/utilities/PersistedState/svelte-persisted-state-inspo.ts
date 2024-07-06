// import { type Writable, writable as internal } from "svelte/store";

// declare type Updater<T> = (value: T) => T;
// declare type StoreDict<T> = { [key: string]: Persisted<T> };

// interface Persisted<T> extends Writable<T> {
// 	reset: () => void;
// }

// /* eslint-disable @typescript-eslint/no-explicit-any */
// interface Stores {
// 	local: StoreDict<any>;
// 	session: StoreDict<any>;
// }

// const stores: Stores = {
// 	local: {},
// 	session: {},
// };

// export interface Serializer<T> {
// 	parse: (text: string) => T;
// 	stringify: (object: T) => string;
// }

// export type StorageType = "local" | "session";

// export interface Options<StoreType, SerializerType> {
// 	serializer?: Serializer<SerializerType>;
// 	storage?: StorageType;
// 	syncTabs?: boolean;
// 	onError?: (e: unknown) => void;
// 	onWriteError?: (e: unknown) => void;
// 	onParseError?: (newValue: string | null, e: unknown) => void;
// 	beforeRead?: (val: SerializerType) => StoreType;
// 	beforeWrite?: (val: StoreType) => SerializerType;
// }

// function getStorage(type: StorageType) {
// 	return type === "local" ? localStorage : sessionStorage;
// }

// /** @deprecated `writable()` has been renamed to `persisted()` */
// export function writable<StoreType, SerializerType = StoreType>(
// 	key: string,
// 	initialValue: StoreType,
// 	options?: Options<StoreType, SerializerType>
// ): Persisted<StoreType> {
// 	console.warn(
// 		"writable() has been deprecated. Please use persisted() instead.\n\nchange:\n\nimport { writable } from 'svelte-persisted-store'\n\nto:\n\nimport { persisted } from 'svelte-persisted-store'"
// 	);
// 	return persisted<StoreType, SerializerType>(key, initialValue, options);
// }
// export function persisted<StoreType, SerializerType = StoreType>(
// 	key: string,
// 	initialValue: StoreType,
// 	options?: Options<StoreType, SerializerType>
// ): Persisted<StoreType> {
// 	if (options?.onError)
// 		console.warn("onError has been deprecated. Please use onWriteError instead");

// 	const serializer = options?.serializer ?? JSON;
// 	const storageType = options?.storage ?? "local";
// 	const syncTabs = options?.syncTabs ?? true;
// 	const onWriteError =
// 		options?.onWriteError ??
// 		options?.onError ??
// 		((e) =>
// 			console.error(`Error when writing value from persisted store "${key}" to ${storageType}`, e));
// 	const onParseError =
// 		options?.onParseError ??
// 		((newVal, e) =>
// 			console.error(
// 				`Error when parsing ${newVal ? `"${newVal}"` : "value"} from persisted store "${key}"`,
// 				e
// 			));

// 	const beforeRead = options?.beforeRead ?? ((val) => val as unknown as StoreType);
// 	const beforeWrite = options?.beforeWrite ?? ((val) => val as unknown as SerializerType);

// 	const browser = typeof window !== "undefined" && typeof document !== "undefined";
// 	const storage = browser ? getStorage(storageType) : null;

// 	function updateStorage(key: string, value: StoreType) {
// 		const newVal = beforeWrite(value);

// 		try {
// 			storage?.setItem(key, serializer.stringify(newVal));
// 		} catch (e) {
// 			onWriteError(e);
// 		}
// 	}

// 	function maybeLoadInitial(): StoreType {
// 		function serialize(json: any) {
// 			try {
// 				return <SerializerType>serializer.parse(json);
// 			} catch (e) {
// 				onParseError(json, e);
// 			}
// 		}
// 		const json = storage?.getItem(key);
// 		if (json == null) return initialValue;

// 		const serialized = serialize(json);
// 		if (serialized == null) return initialValue;

// 		const newVal = beforeRead(serialized);
// 		return newVal;
// 	}

// 	if (!stores[storageType][key]) {
// 		const initial = maybeLoadInitial();
// 		const store = internal(initial, (set) => {
// 			if (browser && storageType == "local" && syncTabs) {
// 				const handleStorage = (event: StorageEvent) => {
// 					if (event.key === key && event.newValue) {
// 						let newVal: any;
// 						try {
// 							newVal = serializer.parse(event.newValue);
// 						} catch (e) {
// 							onParseError(event.newValue, e);
// 							return;
// 						}
// 						const processedVal = beforeRead(newVal);

// 						set(processedVal);
// 					}
// 				};

// 				window.addEventListener("storage", handleStorage);

// 				return () => window.removeEventListener("storage", handleStorage);
// 			}
// 		});

// 		const { subscribe, set } = store;

// 		stores[storageType][key] = {
// 			set(value: StoreType) {
// 				set(value);
// 				updateStorage(key, value);
// 			},
// 			update(callback: Updater<StoreType>) {
// 				return store.update((last) => {
// 					const value = callback(last);

// 					updateStorage(key, value);

// 					return value;
// 				});
// 			},
// 			reset() {
// 				this.set(initialValue);
// 			},
// 			subscribe,
// 		};
// 	}
// 	return stores[storageType][key];
// }
export {};
