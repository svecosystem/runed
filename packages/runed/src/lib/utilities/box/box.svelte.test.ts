import { box, ref } from "./box.svelte.js";

describe("box", () => {
	it("updates when the referenced value updates", () => {
		let count = $state(0);
		const boxed = box(() => count);
		expect(boxed.current).toBe(0);

		count = 1;
		expect(boxed.current).toBe(1);
	});

	it("creates a readonly box when only a getter is passed", () => {
		const boxed = box(() => 0);

		function set() {
			// @ts-expect-error It's readonly
			boxed.current = 1;
		}

		expect(set).toThrowError();
	});

	it("creates a writable box when a getter and setter are passed", () => {
		let count = $state(0);
		const boxed = box(
			() => count,
			(value) => {
				count = value;
			}
		);
		expect(boxed.current).toBe(0);

		boxed.current = 1;
		expect(boxed.current).toBe(1);
		expect(count).toBe(1);

		count = 2;
		expect(boxed.current).toBe(2);
	});

	it("memoizes the getter", () => {
		let count = $state(0);
		const fn = vi.fn(() => count);
		const boxed = box(fn);
		expect(fn).not.toHaveBeenCalled();

		boxed.current;
		expect(fn).toHaveBeenCalledTimes(1);

		boxed.current;
		expect(fn).toHaveBeenCalledTimes(1);

		count = 1;
		boxed.current;
		expect(fn).toHaveBeenCalledTimes(2);

		boxed.current;
		expect(fn).toHaveBeenCalledTimes(2);
	});
});

describe("ref", () => {
	it("updates when the referenced value updates", () => {
		let count = 0;
		const boxed = ref(() => count);
		expect(boxed.current).toBe(0);

		count = 1;
		expect(boxed.current).toBe(1);
	});

	it("creates a readonly box when only a getter is passed", () => {
		const boxed = ref(() => 0);

		function set() {
			// @ts-expect-error It's readonly
			boxed.current = 1;
		}

		expect(set).toThrowError();
	});

	it("creates a writable box when a getter and setter are passed", () => {
		let count = 0;
		const boxed = ref(
			() => count,
			(value) => {
				count = value;
			}
		);
		expect(boxed.current).toBe(0);

		boxed.current = 1;
		expect(boxed.current).toBe(1);
		expect(count).toBe(1);

		count = 2;
		expect(boxed.current).toBe(2);
	});

	it("does not memoize the getter", () => {
		const fn = vi.fn(() => 0);
		const boxed = ref(fn);
		expect(fn).not.toHaveBeenCalled();

		boxed.current;
		expect(fn).toHaveBeenCalledTimes(1);

		boxed.current;
		expect(fn).toHaveBeenCalledTimes(2);
	});
});
