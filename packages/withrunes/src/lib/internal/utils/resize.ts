import { PRECISION } from "../constants.js";
import type { PaneConstraints } from "../types.js";
import { assert } from "./assert.js";
import { compareNumbersWithTolerance } from "./compare.js";

/**
 * Resizes a pane based on its constraints.
 */
export function resizePane({
	paneConstraints: paneConstraintsArray,
	paneIndex,
	initialSize,
}: {
	paneConstraints: PaneConstraints[];
	paneIndex: number;
	initialSize: number;
}): number {
	const paneConstraints = paneConstraintsArray[paneIndex];
	assert(paneConstraints != null, "Pane constraints should not be null.");

	const { collapsedSize = 0, collapsible, maxSize = 100, minSize = 0 } = paneConstraints;

	let newSize = initialSize;

	if (compareNumbersWithTolerance(newSize, minSize) < 0) {
		newSize = getAdjustedSizeForCollapsible(newSize, collapsible, collapsedSize, minSize);
	}

	newSize = Math.min(maxSize, newSize);
	return parseFloat(newSize.toFixed(PRECISION));
}

/**
 * Adjusts the size of a pane based on its collapsible state.
 *
 * If the pane is collapsible, the size will be snapped to the collapsed size
 * or the minimum size based on the halfway point.
 */
function getAdjustedSizeForCollapsible(
	size: number,
	collapsible: boolean | undefined,
	collapsedSize: number,
	minSize: number
): number {
	if (!collapsible) return minSize;

	// Snap collapsible panes closed or open based on the halfway point.
	const halfwayPoint = (collapsedSize + minSize) / 2;
	return compareNumbersWithTolerance(size, halfwayPoint) < 0 ? collapsedSize : minSize;
}
