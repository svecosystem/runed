import type { MaybeGetter } from "$lib/internal/types.js";
import { isFunction } from "$lib/internal/utils/is.js";

export function extract<T>(value: MaybeGetter<T>): T;
export function extract<T>(value: MaybeGetter<T | undefined>, defaultValue: T): T;

/**
 * Extracts the value from a getter or a value.
 * Optionally, a default value can be provided.
 */
export function extract(value: unknown, defaultValue?: unknown) {
	if (isFunction(value)) {
		const getter = value;
		const gotten = getter();
		if (gotten === undefined) return defaultValue;
		return gotten;
	}

	if (value === undefined) return defaultValue;
	return value;
}
