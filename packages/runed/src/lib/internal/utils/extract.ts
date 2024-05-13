import { isFunction } from "./is.js";
import type { MaybeGetter } from "$lib/internal/types.js";

/**
 * Extracts the value from a getter or a value.
 */
export function extract<T>(value: MaybeGetter<T>): T;

/**
 * Extracts the value from a getter or a value, replacing `undefined` with the default value.
 */
export function extract<T>(value: MaybeGetter<T | undefined>, defaultValue: T): T;

export function extract<T>(value: MaybeGetter<T | undefined>, defaultValue?: T): T | undefined {
	const result = isFunction(value) ? value() : value;
	if (result === undefined) {
		return defaultValue;
	}
	return result;
}
