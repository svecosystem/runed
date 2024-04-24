import type { ReadableBox } from "$lib/functions/index.js";

// eslint-disable-next-line ts/no-explicit-any
export type FunctionArgs<Args extends any[] = any[], Return = void> = (...args: Args) => Return;

export type Getter<T> = () => T;
export type MaybeGetter<T> = T | (() => T);

export type MaybeBoxOrGetter<T> = T | Getter<T> | ReadableBox<T>