import type { Readable, Writable } from "svelte/store";
import type { ReadableBox, WritableBox } from "../box/box.svelte.js";
import { box } from "../box/box.svelte.js";

export function useStore<T>(store: Writable<T>): WritableBox<T>;
export function useStore<T>(store: Readable<T>): ReadableBox<T>;
export function useStore<T>(store: Writable<T> | Readable<T>): WritableBox<T> | ReadableBox<T> {
	let data = $state(undefined as T);

	const unsub = store.subscribe((val) => {
		data = val;
	});

	$effect(() => {
		return function ondestroy() {
			unsub();
		};
	});

	if ("set" in store && typeof store.set === "function") {
		return box.with(
			() => data,
			(val) => {
				store.set(val);
			}
		);
	}

	return box.with(() => data);
}
