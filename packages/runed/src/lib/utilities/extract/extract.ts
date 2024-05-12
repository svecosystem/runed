import type { MaybeGetter } from "$lib/internal/types.js";
import { get } from "$lib/internal/utils/get.js";

/**
 * Extracts the value from a getter or a value.
 */
export function extract<T>(value: MaybeGetter<T>): T;

/**
 * Extracts the value from a getter or a value, replacing `undefined` with the default value.
 */
export function extract<T>(value: MaybeGetter<T | undefined>, defaultValue: T): T;

export function extract<T>(value: MaybeGetter<T>, defaultValue?: T): T | undefined {
	const result = get(value);
	if (result === undefined) {
		return defaultValue;
	}
	return result;
}
