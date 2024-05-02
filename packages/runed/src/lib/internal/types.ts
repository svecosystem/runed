import type { ReadableBox } from "$lib/functions/index.js";

// eslint-disable-next-line ts/no-explicit-any
export type FunctionArgs<Args extends any[] = any[], Return = void> = (...args: Args) => Return;

export type Getter<T> = () => T;
export type MaybeGetter<T> = T | Getter<T>;
export type MaybeBoxOrGetter<T> = T | Getter<T> | ReadableBox<T>;
export type BoxOrGetter<T> = Getter<T> | ReadableBox<T>;

export type Expand<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
