import { Derived, Ref } from "./box.svelte.js";

describe("box", () => {
	it("updates when the referenced value updates", () => {
		let count = 0;
		const box = Ref.to(() => count);
		expect(box.current).toBe(0);

		count = 1;
		expect(box.current).toBe(1);
	});

	it("creates a readonly box when only a getter is passed", () => {
		const box = Ref.to(() => 0);
		expect(box.current).toBe(0);

		function set() {
			// @ts-expect-error It's readonly
			box.current = 1;
		}

		expect(set).toThrowError();
	});

	it("creates a writable box when a getter and setter are passed", () => {
		let count = 0;
		const box = Ref.to(
			() => count,
			(value) => {
				count = value;
			}
		);
		expect(box.current).toBe(0);

		box.current = 1;
		expect(box.current).toBe(1);
		expect(count).toBe(1);

		count = 2;
		expect(box.current).toBe(2);
	});

	it("does not memoize the getter", () => {
		const fn = vi.fn(() => 0);
		const box = Ref.to(fn);
		expect(fn).not.toHaveBeenCalled();

		box.current;
		expect(fn).toHaveBeenCalledTimes(1);

		box.current;
		expect(fn).toHaveBeenCalledTimes(2);
	});
});

describe("Derived", () => {
	it("updates when the referenced value updates", () => {
		let count = $state(0);
		const box = Derived.by(() => count);
		expect(box.current).toBe(0);

		count = 1;
		expect(box.current).toBe(1);
	});

	it("creates a readonly box when only a getter is passed", () => {
		const box = Derived.by(() => 0);
		expect(box.current).toBe(0);

		function set() {
			// @ts-expect-error It's readonly
			box.current = 1;
		}

		expect(set).toThrowError();
	});

	it("creates a writable box when a getter and setter are passed", () => {
		let count = $state(0);
		const box = Derived.by(
			() => count,
			(value) => {
				count = value;
			}
		);
		expect(box.current).toBe(0);

		box.current = 1;
		expect(box.current).toBe(1);
		expect(count).toBe(1);

		count = 2;
		expect(box.current).toBe(2);
	});

	it("memoizes the getter", () => {
		let count = $state(0);
		const fn = vi.fn(() => count);
		const box = Derived.by(fn);
		expect(fn).not.toHaveBeenCalled();

		box.current;
		expect(fn).toHaveBeenCalledTimes(1);

		box.current;
		expect(fn).toHaveBeenCalledTimes(1);

		count = 1;
		box.current;
		expect(fn).toHaveBeenCalledTimes(2);

		box.current;
		expect(fn).toHaveBeenCalledTimes(2);
	});
});
