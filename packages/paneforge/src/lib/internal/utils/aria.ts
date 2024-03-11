import type { PaneData } from "../types.js";

/**
 * A utility function that calculates the `aria-valuemax`, `aria-valuemin`,
 * and `aria-valuenow` values for a pane based on its layout and constraints.
 */
export function calculateAriaValues({
	layout,
	panesArray,
	pivotIndices,
}: {
	layout: number[];
	panesArray: PaneData[];
	pivotIndices: number[];
}) {
	let currentMinSize = 0;
	let currentMaxSize = 100;
	let totalMinSize = 0;
	let totalMaxSize = 0;

	const firstIndex = pivotIndices[0];

	// A pane's effective min/max sizes also need to account for other pane's sizes.
	for (let i = 0; i < panesArray.length; i++) {
		const { constraints } = panesArray[i];
		const { maxSize = 100, minSize = 0 } = constraints;

		if (i === firstIndex) {
			currentMinSize = minSize;
			currentMaxSize = maxSize;
		} else {
			totalMinSize += minSize;
			totalMaxSize += maxSize;
		}
	}

	const valueMax = Math.min(currentMaxSize, 100 - totalMinSize);
	const valueMin = Math.max(currentMinSize, 100 - totalMaxSize);

	const valueNow = layout[firstIndex];

	return {
		valueMax,
		valueMin,
		valueNow,
	};
}
