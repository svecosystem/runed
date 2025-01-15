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

export class Ref<T> implements Box<T> {
	readonly get: Getter<T>;

	constructor(get: Getter<T>) {
		this.get = get;
	}

	static to<T>(get: Getter<T>): Box<T>;
	static to<T>(get: Getter<T>, set: Setter<T>): WritableBox<T>;
	static to<T>(get: Getter<T>, set?: Setter<T>): Box<T> {
		if (set !== undefined) {
			return new WritableRef(get, set);
		}
		return new Ref(get);
	}

	get current(): T {
		return this.get();
	}
}

class WritableRef<T> extends Ref<T> implements WritableBox<T> {
	readonly set: Setter<T>;

	constructor(get: Getter<T>, set: Setter<T>) {
		super(get);
		this.set = set;
	}

	get current(): T {
		return this.get();
	}

	set current(value: T) {
		this.set(value);
	}
}

export class Derived<T> implements Box<T> {
	readonly get: Getter<T>;

	constructor(get: Getter<T>) {
		const current = $derived.by(get);
		this.get = () => current;
	}

	static by<T>(get: Getter<T>): Derived<T>;
	static by<T>(get: Getter<T>, set: Setter<T>): WritableDerived<T>;
	static by<T>(get: Getter<T>, set?: Setter<T>): Derived<T> {
		if (set !== undefined) {
			return new WritableDerived(get, set);
		}
		return new Derived(get);
	}

	get current(): T {
		return this.get();
	}
}

class WritableDerived<T> extends Derived<T> implements WritableBox<T> {
	readonly set: Setter<T>;

	constructor(get: Getter<T>, set: Setter<T>) {
		super(get);
		this.set = set;
	}

	get current(): T {
		return this.get();
	}

	set current(value: T) {
		this.set(value);
	}
}
