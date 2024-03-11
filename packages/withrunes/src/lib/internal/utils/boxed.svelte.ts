import type { ValueOrGetter } from "../types.js";
import { isFunction } from "./is.js";

export function boxed<T>(value: ValueOrGetter<T>) {
	return {
		get value() {
			return isFunction(value) ? value() : value;
		},
	};
}
