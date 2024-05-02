import { box } from "../box/box.svelte.js";
import type { Getter, MaybeBoxOrGetter } from "$lib/internal/types.js";
import { isFunction } from "$lib/internal/utils/is.js";

export function unbox<T>(value: MaybeBoxOrGetter<T>): T {
	if (box.isBox(value)) {
		return value.value;
	}

	if (isFunction(value)) {
		const getter = value as Getter<T>;
		return getter();
	}

	return value;
}
