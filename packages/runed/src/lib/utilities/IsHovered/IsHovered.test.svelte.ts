import { render } from "@testing-library/svelte/svelte5";
import { describe, expect, it } from "vitest";
import { userEvent } from "@testing-library/user-event";
import TestIsHovered from "./TestIsHovered.svelte";

function setup() {
	const user = userEvent.setup();
	const result = render(TestIsHovered);
	const hoverTarget = result.getByTestId("hover-target");

	return {
		...result,
		user,
		hoverTarget,
	};
}

describe("IsHovered", () => {
	it("should be false on initial render", async () => {
		const { hoverTarget } = setup();
		expect(hoverTarget).toHaveTextContent("false");
	});

	it("should be true when hovered", async () => {
		const { user, hoverTarget } = setup();
		expect(hoverTarget).toHaveTextContent("false");
		await user.hover(hoverTarget);
		expect(hoverTarget).toHaveTextContent("true");
	});

	it("should be false when unhovered", async () => {
		const { user, hoverTarget } = setup();
		await user.hover(hoverTarget);
		expect(hoverTarget).toHaveTextContent("true");
		await user.unhover(hoverTarget);
		expect(hoverTarget).toHaveTextContent("false");
	});
});
