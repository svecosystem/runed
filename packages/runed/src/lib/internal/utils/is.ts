export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
	return typeof value === "function";
}

export function isObject(value: unknown): value is Record<PropertyKey, unknown> {
	return value !== null && typeof value === "object";
}

export function isNotNullish<T = unknown>(value: T | null | undefined): value is T {
	return value != null;
}
