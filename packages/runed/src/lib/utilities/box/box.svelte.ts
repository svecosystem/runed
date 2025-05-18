import type { Getter, Setter } from "$lib/internal/types.js";

export type Box<T> = {
	readonly current: T;
	readonly get: Getter<T>;
};

export type WritableBox<T> = {
	current: T;
	readonly get: Getter<T>;
	readonly set: Setter<T>;
};

export function box<T>(get: Getter<T>): Box<T>;
export function box<T>(get: Getter<T>, set: Setter<T>): WritableBox<T>;
export function box<T>(get: Getter<T>, set?: Setter<T>): Box<T> {
	const current = $derived.by(get);
	if (set !== undefined) {
		return new WritableRef(() => current, set);
	}
	return new Ref(() => current);
}

export function ref<T>(get: Getter<T>): Box<T>;
export function ref<T>(get: Getter<T>, set: Setter<T>): WritableBox<T>;
export function ref<T>(get: Getter<T>, set?: Setter<T>): Box<T> {
	if (set !== undefined) {
		return new WritableRef(get, set);
	}
	return new Ref(get);
}

class Ref<T> {
	readonly get: Getter<T>;

	constructor(get: Getter<T>) {
		this.get = get;
	}

	get current(): T {
		return this.get();
	}
}

class WritableRef<T> {
	readonly get: Getter<T>;
	readonly set: Setter<T>;

	constructor(get: Getter<T>, set: Setter<T>) {
		this.get = get;
		this.set = set;
	}

	get current(): T {
		return this.get();
	}

	set current(value: T) {
		this.set(value);
	}
}
