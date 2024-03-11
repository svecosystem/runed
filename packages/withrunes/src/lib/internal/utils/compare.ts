import { PRECISION } from "../constants.js";

/**
 * Compares two numbers for equality with a given fractional precision.
 */
export function areNumbersAlmostEqual(
	actual: number,
	expected: number,
	fractionDigits: number = PRECISION
): boolean {
	return compareNumbersWithTolerance(actual, expected, fractionDigits) === 0;
}

/**
 * Compares two numbers with a given tolerance.
 *
 * @returns `-1` if `actual` is less than `expected`, `0` if they are equal,
 * and `1` if `actual` is greater than `expected`.
 */
export function compareNumbersWithTolerance(
	actual: number,
	expected: number,
	fractionDigits: number = PRECISION
): number {
	const roundedActual = roundTo(actual, fractionDigits);
	const roundedExpected = roundTo(expected, fractionDigits);

	return Math.sign(roundedActual - roundedExpected);
}

/**
 * Compares two arrays for equality.
 */
export function areArraysEqual<T extends Array<unknown>>(arrA: T, arrB: T): boolean {
	if (arrA.length !== arrB.length) return false;

	for (let index = 0; index < arrA.length; index++) {
		if (arrA[index] !== arrB[index]) return false;
	}

	return true;
}

/**
 * Rounds a number to a given number of decimal places.
 */
function roundTo(value: number, decimals: number): number {
	return parseFloat(value.toFixed(decimals));
}
