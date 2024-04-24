/**
 * Box
 *
 * This module contains utilities to provide boxes to use throughout runes-powered
 * Svelte applications.
 *
 * The practicality of box comes due to the fact that runes are based on primitives, rather than
 * providing the closures directly. So to pass runes around, you need to provide said closures yourself.
 *
 * With the box utilities, we aim to achieve certain goals.
 *
 * - Be able to pass state around in a reactive manner.
 * - Be able to set passed state.
 * - Control how said state gets read and set.
 * - Initiate state inside a box, rather than always requiring a pre-existing state.
 * - Easily receive boxed state inside functions
 *
 * We provide several functions to this end, which can either provide a ReadonlyBox or a Box.
 *
 * WritableBox should extend from ReadonlyBox, as a function that accepts a ReadonlyBox should also accept a WritableBox.
 * The inverse is not true, as a function that accepts a WritableBox should not necessarily accept a ReadonlyBox,
 * as the WritableBox can be set, while the ReadonlyBox cannot.
 */

import { isObject } from "$lib/internal/utils/is.js";

const BoxSymbol = Symbol("box");
const isWritableSymbol = Symbol("is-writable");

export interface ReadableBox<T> {
	readonly [BoxSymbol]: true;
	readonly value: T;
}

export interface WritableBox<T> extends ReadableBox<T> {
	readonly [isWritableSymbol]: true;
	value: T;
}

/**
 * @returns Whether the value is a Box
 */
function isBox<T>(value: unknown): value is ReadableBox<T> {
	return isObject(value) && BoxSymbol in value;
}
/**
 * @returns Whether the value is a WritableBox
 */
function isWritableBox<T>(value: unknown): value is WritableBox<T> {
	return isBox(value) && isWritableSymbol in value;
}

/**
 * Re-returns the box if it's already a box.
 *
 * @param boxed The box to re-return
 * @returns The box if it's already a box. This is useful when you want to accept a prop that can be a box or a value.
 */
export function box<T>(boxed: WritableBox<T>): WritableBox<T>;
export function box<T>(boxed: ReadableBox<T>): ReadableBox<T>;
/**
 * Creates a writable box.
 *
 * @returns A box with a `value` property which can be set to a new value.
 * Useful to pass state to other functions.
 */
export function box<T>(): WritableBox<T | undefined>;
/**
 * Creates a box with an initial value, or re-returns the value if it's already a box.
 *
 * @param initialValue The initial value of the box, or a box that contains the initial value.
 * 
 * @example
 * const count = box(0);
 * const reCount = box(count);
 * count.value = 5;
 * reCount.value = 10;
 * console.log(`${count.value}, ${reCount.value}`); // "10, 10" 
 * 
 * 
 * @returns A box with a `value` property which can be set to a new value.
 * Useful to pass state to other functions.
 */
export function box<T>(initialValue: T): T extends WritableBox<infer U> ? WritableBox<U> : T extends ReadableBox<infer U> ? ReadableBox<U> : WritableBox<T>;
/**
 * Creates a writable box with an initial value.
 *
 * @param initialValue The initial value of the box.
 * @param setter (optional) A function that controls how the value is set.
 * Its argument is the value trying to be set. The returned value will be the new value.
 * 
 * @example
 * const count = box(0);
 * const doubleCount = box(0, (c) => c * 2);
 * count.value = 5;
 * doubleCount.value = 10;
 * console.log(`${count.value}, ${doubleCount.value}`); // "5, 20" 
 * 
 * 
 * @returns A box with a `value` property which can be set to a new value.
 * Useful to pass state to other functions.
 */
export function box<T>(initialValue: T, setter?: (v: T) => T): WritableBox<T>;

export function box(initialValue?: unknown, setter?: (v: unknown) => unknown) {
	if (isBox(initialValue) && !setter) return initialValue;

	let value = $state(initialValue);

	return {
		[BoxSymbol]: true,
		[isWritableSymbol]: true,
		get value() {
			return value as unknown;
		},
		set value(v: unknown) {
			value = setter ? setter(v) : v;
		},
	};
}

/**
 * Creates a readonly box
 *
 * @param getter Function to get the value of the box
 * @returns A box with a `value` property whose value is the result of the getter.
 * Useful to pass state to other functions.
 */
function boxWith<T>(getter: () => T): ReadableBox<T>;
/**
 * Creates a writable box
 *
 * @param getter Function to get the value of the box
 * @param setter Function to set the value of the box
 * @returns A box with a `value` property which can be set to a new value.
 * Useful to pass state to other functions.
 */
function boxWith<T>(getter: () => T, setter: (v: T) => void): WritableBox<T>;
function boxWith<T>(getter: () => T, setter?: (v: T) => void) {
	if (setter) {
		return {
			[BoxSymbol]: true,
			[isWritableSymbol]: true,
			get value() {
				return getter();
			},
			set value(v: T) {
				setter(v);
			},
		};
	}

	return {
		[BoxSymbol]: true,
		get value() {
			return getter();
		},
	};
}

box.with = boxWith;
box.isBox = isBox;
box.isWritableBox = isWritableBox;