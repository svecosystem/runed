/**
 * A callback function that takes an array of arguments of type `T` and returns `void`.
 * @template T The types of the arguments that the callback function takes.
 */
export type Callback<T extends unknown[] = unknown[]> = (...args: T) => void;

type NonEmptyArray<T> = [T, ...T[]];

/**
 * Executes an array of callback functions with the same arguments.
 * @template T The types of the arguments that the callback functions take.
 * @param n array of callback functions to execute.
 * @returns A new function that executes all of the original callback functions with the same arguments.
 */
export function chain<T extends unknown[]>(
	...callbacks: NonEmptyArray<Callback<T>>
): (...args: T) => void {
	return (...args) => {
		for (const callback of callbacks) {
			if (typeof callback === "function") {
				callback(...args);
			}
		}
	};
}
