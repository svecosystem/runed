import type { ReadonlyBox } from "$lib/functions/box/box.svelte.js";

// eslint-disable-next-line ts/no-explicit-any
export type FunctionArgs<Args extends any[] = any[], Return = void> = (...args: Args) => Return;

export type Getter<T> = () => T;
export type ValueOrGetter<T> = T | (() => T);
export type ValueOrReadonlyBox<T> = T | ReadonlyBox<T>;
export type Setter<T> = (value: T) => void | T;