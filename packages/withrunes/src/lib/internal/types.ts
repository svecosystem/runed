// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionArgs<Args extends any[] = any[], Return = void> = (...args: Args) => Return;

export type Getter<T> = () => T;
export type ValueOrGetter<T> = T | (() => T);
