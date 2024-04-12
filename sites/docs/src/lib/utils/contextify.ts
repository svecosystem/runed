// https://github.com/Hugos68/svelte-contextify
import { getContext, hasContext, setContext } from "svelte";

export function createContext<T>(): [() => T, (value: T) => T, symbol];

export function createContext<T>() {
	const key = Symbol("CTX");

	const getCtx = () => {
		if (!hasContext(key)) {
			throw new Error("No context provider found for this component.");
		}
		return getContext<T>(key);
	};

	return [getCtx, (value: T) => setContext<T>(key, value), key];
}
