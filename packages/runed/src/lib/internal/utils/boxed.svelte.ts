import { isFunction } from "./is.js";
import type { ValueOrGetter } from "$lib/internal/types.js";

export function boxed<T>(value: ValueOrGetter<T>) {
	return {
		get value() {
			return isFunction(value) ? value() : value;
		},
	};
}
