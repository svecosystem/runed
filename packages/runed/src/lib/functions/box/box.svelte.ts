import type { Getter } from "$lib/internal/types.js";
import { isFunction, isObject } from "$lib/internal/utils/is.js";

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
function isBox(value: unknown): value is ReadableBox<unknown> {
	return isObject(value) && BoxSymbol in value;
}
/**
 * @returns Whether the value is a WritableBox
 */
function isWritableBox(value: unknown): value is WritableBox<unknown> {
	return isBox(value) && isWritableSymbol in value;
}

/**
 * Creates a writable box.
 *
 * @returns A box with a `value` property which can be set to a new value.
 * Useful to pass state to other functions.
 */
export function box<T>(): WritableBox<T | undefined>;
/**
 * Creates a writable box with an initial value.
 *
 * @param initialValue The initial value of the box.
 * @returns A box with a `value` property which can be set to a new value.
 * Useful to pass state to other functions.
 */
export function box<T>(initialValue: T): WritableBox<T>;
export function box(initialValue?: unknown) {
	let value = $state(initialValue);

	return {
		[BoxSymbol]: true,
		[isWritableSymbol]: true,
		get value() {
			return value as unknown;
		},
		set value(v: unknown) {
			value = v;
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
	const derived = $derived.by(getter);

	if (setter) {
		return {
			[BoxSymbol]: true,
			[isWritableSymbol]: true,
			get value() {
				return derived;
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

export type BoxFrom<T> =
	T extends WritableBox<infer U>
		? WritableBox<U>
		: T extends ReadableBox<infer U>
			? ReadableBox<U>
			: T extends Getter<infer U>
				? ReadableBox<U>
				: WritableBox<T>;

/**
 * Creates a box from either a static value, a box, or a getter function.
 * Useful when you want to receive any of these types of values and generate a boxed version of it.
 *
 * @returns A box with a `value` property whose value.
 */
function boxFrom<T>(value: T): BoxFrom<T> {
	if (box.isBox(value)) return value as BoxFrom<T>;
	if (isFunction(value)) return boxWith(value) as BoxFrom<T>;
	return box(value) as BoxFrom<T>;
}

box.from = boxFrom;
box.with = boxWith;
box.isBox = isBox;
box.isWritableBox = isWritableBox;
