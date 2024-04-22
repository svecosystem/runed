import { type ReadonlyBox, isReadonlyBox } from "../readonlyBox/index.js";
import type { Getter, Setter } from "$lib/internal/types.js";
import { isFunction, isObject } from "$lib/internal/utils/is.js";

const BoxSymbol = Symbol("Box");

export type Box<T> = {
	readonly [BoxSymbol]: true;
	value: T;
};

/**
 * @returns Whether the value is a settable Box
 */
export function isBox<T>(value: unknown): value is Box<T> {
	return isObject(value) && BoxSymbol in value;
}

/**
 * Not allowed. Use `readonlyBox` instead.
 */
export function box<T>(box: ReadonlyBox<T>): never;
/**
 * Not allowed. Use `readonlyBox` instead, or pass a setter function to `box`.
 */
export function box<T>(get: Getter<T>): never;

/**
 * Re-returns the box if it's already a box.
 * Useful for when you want to accept a prop that can be a box or a value.
 */
export function box<T>(box: Box<T>): Box<T>;
/**
 * Creates an internal $derived that's equal to the value returned from
 * the get function.
 *
 * Accepts a setter prop that is run whenever setting the returned object's
 * `value` property.
 *
 * @example
 * e.g.
 * ```ts
 * let count = $state(0)
 * let countBox = box(() => count, (c) => count = c)
 * console.log(countBox.value) // 0
 * countBox.value = 1
 * console.log(countBox.value) // 1
 * ```
 *
 * @returns An object with a `value` property which can be set to a new value.
 * Useful to pass state to other functions. *
 */
export function box<T>(get: Getter<T>, set: Setter<T>): Box<T>;
/**
 * Creates internal $state with an initial value equal to what is passed in.
 *
 * @returns An object with a `value` property which can be set to a new value.
 * Useful to pass state to other functions.
 */
export function box<T>(initial: T): Box<T>;
/**
 * Creates internal $state with an initial value equal to what is passed in.
 *
 * Accepts a setter prop to choose how you want to update the state.
 *
 * @example
 * ```ts
 * const doubleWhenSet = box(0, (value) => value * 2);
 * doubleWhenSet.value = 2;
 * console.log(doubleWhenSet.value); // 4
 * ```
 *
 * @returns An object with a `value` property which can be set to a new value.
 * Useful to pass state to other functions.
 */
export function box<T>(initial: T, set: Setter<T>): Box<T>;
export function box<T>(valueOrGetterOrBox: T | Getter<T> | Box<T>, set?: Setter<T>) {
	if (isReadonlyBox(valueOrGetterOrBox)) {
		throw new Error("A `ReadonlyBox` cannot be passed onto `box`. Use `readonlyBox` instead.");
	}

	if (isBox(valueOrGetterOrBox)) {
		return valueOrGetterOrBox;
	}

	if (isFunction(valueOrGetterOrBox)) {
		if (!isFunction(set)) {
			throw new Error(
				"A setter function must be provided when passing a getter function to `box`."
			);
		}

		const value = $derived(valueOrGetterOrBox());

		return {
			[BoxSymbol]: true,
			get value() {
				return value;
			},
			set value(newValue: T) {
				set(newValue);
			},
		};
	}

	// If box holds its own state
	let value = $state(valueOrGetterOrBox);

	return {
		[BoxSymbol]: true,
		get value() {
			return value;
		},
		set value(newValue: T) {
			if (isFunction(set)) {
				value = set(newValue) ?? value;
			} else {
				value = newValue;
			}
		},
	};
}
