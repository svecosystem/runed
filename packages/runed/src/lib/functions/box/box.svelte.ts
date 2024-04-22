import type { Getter, Setter } from "$lib/internal/types.js";
import { isFunction, isObject } from "$lib/internal/utils/is.js";

const BoxSymbol = Symbol('Box');
const ReadonlyBoxSymbol = Symbol('ReadonlyBox');

type ReadonlyBox<T> = {
	[ReadonlyBoxSymbol]: T;
	readonly value: T
}

type Box<T> = {
	[BoxSymbol]: true,
	value: T
}

/**
 * @returns Whether the value is a settable Box
 */
export function isBox<T>(value: unknown): value is Box<T> {
	return isObject(value) && BoxSymbol in value;
}

/**
 * @returns Whether the value is a readonly Box
 */
export function isReadonlyBox<T>(value: unknown): value is ReadonlyBox<T> {
	return isObject(value) && ReadonlyBoxSymbol in value;
}

/**
 * Creates an internal $derived that's equal to the value returned from
 * the get function.
 *
 * @returns An object with a readonly `value` property. 
 * Useful to pass state to other functions.
 */
export function box<T>(get: Getter<T>): ReadonlyBox<T>;
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
export function box<T>(initial: T): Box<T>
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
export function box<T>(initial: T, set: Setter<T>): Box<T>
export function box<T>(getOrInitial: T | Getter<T>, set?: Setter<T>) {
	// If box is transporting an existing state
	if (isFunction(getOrInitial)) {
		const value = $derived(getOrInitial());
		if (isFunction(set)) {
			return {
				[BoxSymbol]: true,
				get value() {
					return value;
				},
				set value(newValue: T) {
					set(newValue);
				}
			}
		}

		return {
			[ReadonlyBoxSymbol]: true,
			get value() {
				return value;
			}
		}
	}

	// If box holds its own state
	let value = $state(getOrInitial);

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
		}
	}
}

