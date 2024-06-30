import { render } from "@testing-library/svelte/svelte5";
import { describe, expect, it } from "vitest";
import { userEvent } from "@testing-library/user-event";
import TestIsFocusWithin from "./TestIsFocusWithin.svelte";
import { focus } from "$lib/test/util.svelte.js";

function setup() {
	const user = userEvent.setup();
	const result = render(TestIsFocusWithin);
	const input = result.getByTestId("input");
	const submit = result.getByTestId("submit");
	const outside = result.getByTestId("outside");
	const current = result.getByTestId("current");

	return {
		...result,
		user,
		input,
		submit,
		outside,
		current,
	};
}

describe("IsFocusWithin", () => {
	it("should be false on initial render", async () => {
		const { current } = setup();
		expect(current).toHaveTextContent("false");
	});

	it("should be true when any child of the target is focused", async () => {
		const { user, input, current, submit } = setup();
		expect(current).toHaveTextContent("false");
		await user.click(input);
		expect(current).toHaveTextContent("true");
		await focus(submit);
		expect(submit).toHaveFocus();
		expect(current).toHaveTextContent("true");
	});

	it("should be false when focus leaves the target after being true", async () => {
		const { user, input, current, outside } = setup();
		await user.click(input);
		expect(current).toHaveTextContent("true");
		await focus(outside);
		expect(outside).toHaveFocus();
		expect(current).toHaveTextContent("false");
	});
});
