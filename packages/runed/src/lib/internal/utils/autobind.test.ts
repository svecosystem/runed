import { describe, it, expect } from "vitest";
import { autobind } from "./autobind.js";

describe("@autobind", () => {
	it("should bind method to class instance", () => {
		class TestClass {
			value = "test";

			@autobind
			getValue() {
				return this.value;
			}
		}

		const instance = new TestClass();
		expect(instance.getValue()).toBe("test");
	});

	it("should cache bound method", () => {
		class TestClass {
			@autobind
			method() {}
		}

		const instance = new TestClass();
		const first = instance.method;
		const second = instance.method;

		expect(first).toBe(second);
	});

	it("should preserve method behavior when used as callback", () => {
		vi.useFakeTimers();
		let called = false;

		class TestClass {
			value = "test";

			@autobind
			delayed() {
				called = true;
				expect(this.value).toBe("test");
			}
		}

		const instance = new TestClass();
		setTimeout(instance.delayed, 0);

		vi.runAllTimers();
		expect(called).toBe(true);

		vi.useRealTimers();
	});

	it("should work with async methods", async () => {
		class TestClass {
			value = "test";

			@autobind
			async getValue() {
				return this.value;
			}
		}

		const instance = new TestClass();
		const { getValue } = instance;

		expect(await getValue()).toBe("test");
	});
});
