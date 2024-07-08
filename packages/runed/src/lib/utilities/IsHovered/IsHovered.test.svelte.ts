import { fireEvent, render } from "@testing-library/svelte/svelte5";
import { describe, expect, it } from "vitest";
import TestIsHovered from "./TestIsHovered.svelte";

function setup() {
	const result = render(TestIsHovered);
	const hoverTarget = result.getByTestId("hover-target");
	return {
		...result,
		hoverTarget,
	};
}

describe("IsHovered", () => {
	it("should be false on initial render", () => {
		const { hoverTarget } = setup();
		expect(hoverTarget).toHaveTextContent("false");
	});

	it("should be true when hovered", async () => {
		const { hoverTarget } = setup();
		await fireEvent.mouseEnter(hoverTarget);
		expect(hoverTarget).toHaveTextContent("true");
	});

	it("should be false when unhovered", async () => {
		const { hoverTarget } = setup();
		await fireEvent.mouseEnter(hoverTarget);
		expect(hoverTarget).toHaveTextContent("true");
		await fireEvent.mouseLeave(hoverTarget);
		expect(hoverTarget).toHaveTextContent("false");
	});
});
