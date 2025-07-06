export type Getter<T> = () => T;
export type MaybeGetter<T> = T | Getter<T>;
export type MaybeElementGetter<T extends Element = HTMLElement> = MaybeGetter<T | null | undefined>;
export type MaybeElement = HTMLElement | SVGElement | undefined | null;

export type Setter<T> = (value: T) => void;
export type Expand<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
export type WritableProperties<T> = {
	-readonly [P in keyof T]: T[P];
};
