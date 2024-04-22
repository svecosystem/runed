import { type Box, isBox } from "../box/box.svelte.js";
import { isFunction, isObject } from "$lib/internal/utils/is.js";
import type { Getter } from "$lib/internal/types.js";

const ReadonlyBoxSymbol = Symbol("ReadonlyBox");

export type ReadonlyBox<T> = {
	readonly [ReadonlyBoxSymbol]: true;
	readonly value: T;
};

/**
 * @returns Whether the value is a settable ReadonlyBox
 */
export function isReadonlyBox<T>(value: unknown): value is ReadonlyBox<T> {
	return isObject(value) && ReadonlyBoxSymbol in value;
}

export type ValueOrReadonlyBox<T> = T | ReadonlyBox<T>;

/**
 * Makes the box readonly.
 */
export function readonlyBox<T>(box: Box<T>): ReadonlyBox<T>;
/**
 * Creates an internal $derived that's equal to the value returned from
 * the get function.
 *
 * @example
 * e.g.
 * ```ts
 * let count = $state(0)
 * let countReadonlyBox = readonlyBox(() => count)
 * console.log(countReadonlyBox.value) // 0
 * count++
 * console.log(countReadonlyBox.value) // 1
 * ```
 *
 * @returns An object with a `value` property.
 * Useful to pass state to other functions. *
 */
export function readonlyBox<T>(get: Getter<T>): ReadonlyBox<T>;
/**
 * Re-returns the readonlyBox if it's already a readonlyBox.
 * Useful for when you want to accept a prop that can be a readonlyBox or a value.
 */
export function readonlyBox<T>(readonlybox: ValueOrReadonlyBox<T>): ReadonlyBox<T>;
/**
 * @returns An object with a static `value` property.
 */
export function readonlyBox<T>(initial: T): ReadonlyBox<T>;
export function readonlyBox<T>(valueOrGetterOrBox: T | Getter<T> | ReadonlyBox<T>) {
	if (isReadonlyBox(valueOrGetterOrBox)) {
		return valueOrGetterOrBox;
	}

	const value = $derived(
		isBox(valueOrGetterOrBox)
			? valueOrGetterOrBox.value
			: isFunction(valueOrGetterOrBox)
				? valueOrGetterOrBox()
				: valueOrGetterOrBox
	);

	return {
		[ReadonlyBoxSymbol]: true,
		get value() {
			return value;
		},
	};
}
