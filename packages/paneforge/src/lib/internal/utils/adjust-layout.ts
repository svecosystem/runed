import type { PaneConstraints } from "../types.js";
import { assert } from "./assert.js";
import {
	compareNumbersWithTolerance,
	areNumbersAlmostEqual,
	resizePane,
} from "$lib/internal/utils/index.js";

/**
 * Adjusts the layout of panes based on the delta of the resize handle.
 * All units must be in percentages; pixel values should be pre-converted.
 *
 * Credit: https://github.com/bvaughn/react-resizable-panels
 */
export function adjustLayoutByDelta({
	delta,
	layout: prevLayout,
	paneConstraints: paneConstraintsArray,
	pivotIndices,
	trigger,
}: {
	delta: number;
	layout: number[];
	paneConstraints: PaneConstraints[];
	pivotIndices: number[];
	trigger: "imperative-api" | "keyboard" | "mouse-or-touch";
}): number[] {
	if (areNumbersAlmostEqual(delta, 0)) return prevLayout;

	const nextLayout = [...prevLayout];

	const [firstPivotIndex, secondPivotIndex] = pivotIndices;

	let deltaApplied = 0;

	// A resizing pane affects the panes before or after it.
	//
	// A negative delta means the pane(s) immediately after the resize handle should grow/expand by decreasing its offset.
	// Other panes may also need to shrink/contract (and shift) to make room, depending on the min weights.
	//
	// A positive delta means the pane(s) immediately before the resize handle should "expand".
	// This is accomplished by shrinking/contracting (and shifting) one or more of the panes after the resize handle.

	{
		// If this is a resize triggered by a keyboard event, our logic for expanding/collapsing is different.
		// We no longer check the halfway threshold because this may prevent the pane from expanding at all.
		if (trigger === "keyboard") {
			{
				// Check if we should expand a collapsed pane
				const index = delta < 0 ? secondPivotIndex : firstPivotIndex;
				const paneConstraints = paneConstraintsArray[index];
				assert(paneConstraints);

				if (paneConstraints.collapsible) {
					const prevSize = prevLayout[index];
					assert(prevSize != null);

					const paneConstraints = paneConstraintsArray[index];
					assert(paneConstraints);
					const { collapsedSize = 0, minSize = 0 } = paneConstraints;

					if (areNumbersAlmostEqual(prevSize, collapsedSize)) {
						const localDelta = minSize - prevSize;
						//DEBUG.push(`  -> expand delta: ${localDelta}`);

						if (compareNumbersWithTolerance(localDelta, Math.abs(delta)) > 0) {
							delta = delta < 0 ? 0 - localDelta : localDelta;
							//DEBUG.push(`  -> delta: ${delta}`);
						}
					}
				}
			}

			{
				// Check if we should collapse a pane at its minimum size
				const index = delta < 0 ? firstPivotIndex : secondPivotIndex;
				const paneConstraints = paneConstraintsArray[index];
				assert(paneConstraints);
				const { collapsible } = paneConstraints;

				if (collapsible) {
					const prevSize = prevLayout[index];
					assert(prevSize != null);

					const paneConstraints = paneConstraintsArray[index];
					assert(paneConstraints);
					const { collapsedSize = 0, minSize = 0 } = paneConstraints;

					if (areNumbersAlmostEqual(prevSize, minSize)) {
						const localDelta = prevSize - collapsedSize;

						if (compareNumbersWithTolerance(localDelta, Math.abs(delta)) > 0) {
							delta = delta < 0 ? 0 - localDelta : localDelta;
						}
					}
				}
			}
		}
	}

	{
		// Pre-calculate max available delta in the opposite direction of our pivot.
		// This will be the maximum amount we're allowed to expand/contract the panes in the primary direction.
		// If this amount is less than the requested delta, adjust the requested delta.
		// If this amount is greater than the requested delta, that's useful information too–
		// as an expanding pane might change from collapsed to min size.

		const increment = delta < 0 ? 1 : -1;

		let index = delta < 0 ? secondPivotIndex : firstPivotIndex;
		let maxAvailableDelta = 0;

		// eslint-disable-next-line no-constant-condition
		while (true) {
			const prevSize = prevLayout[index];
			assert(prevSize != null);

			const maxSafeSize = resizePane({
				paneConstraints: paneConstraintsArray,
				paneIndex: index,
				initialSize: 100,
			});
			const delta = maxSafeSize - prevSize;

			maxAvailableDelta += delta;
			index += increment;

			if (index < 0 || index >= paneConstraintsArray.length) {
				break;
			}
		}

		const minAbsDelta = Math.min(Math.abs(delta), Math.abs(maxAvailableDelta));
		delta = delta < 0 ? 0 - minAbsDelta : minAbsDelta;
	}

	{
		// Delta added to a pane needs to be subtracted from other panes (within the constraints that those panes allow).

		const pivotIndex = delta < 0 ? firstPivotIndex : secondPivotIndex;
		let index = pivotIndex;
		while (index >= 0 && index < paneConstraintsArray.length) {
			const deltaRemaining = Math.abs(delta) - Math.abs(deltaApplied);

			const prevSize = prevLayout[index];
			assert(prevSize != null);

			const unsafeSize = prevSize - deltaRemaining;
			const safeSize = resizePane({
				paneConstraints: paneConstraintsArray,
				paneIndex: index,
				initialSize: unsafeSize,
			});

			if (!areNumbersAlmostEqual(prevSize, safeSize)) {
				deltaApplied += prevSize - safeSize;

				nextLayout[index] = safeSize;

				if (
					deltaApplied.toPrecision(3).localeCompare(Math.abs(delta).toPrecision(3), undefined, {
						numeric: true,
					}) >= 0
				) {
					break;
				}
			}

			if (delta < 0) {
				index--;
			} else {
				index++;
			}
		}
	}

	// If we were unable to resize any of the panes, return the previous state.
	// This will essentially bailout and ignore e.g. drags past a pane's boundaries
	if (areNumbersAlmostEqual(deltaApplied, 0)) {
		return prevLayout;
	}

	{
		// Now distribute the applied delta to the panes in the other direction
		const pivotIndex = delta < 0 ? secondPivotIndex : firstPivotIndex;

		const prevSize = prevLayout[pivotIndex];
		assert(prevSize != null);

		const unsafeSize = prevSize + deltaApplied;
		const safeSize = resizePane({
			paneConstraints: paneConstraintsArray,
			paneIndex: pivotIndex,
			initialSize: unsafeSize,
		});

		// Adjust the pivot pane before, but only by the amount that surrounding panes were able to shrink/contract.
		nextLayout[pivotIndex] = safeSize;

		// Edge case where expanding or contracting one pane caused another one to change collapsed state
		if (!areNumbersAlmostEqual(safeSize, unsafeSize)) {
			let deltaRemaining = unsafeSize - safeSize;

			const pivotIndex = delta < 0 ? secondPivotIndex : firstPivotIndex;
			let index = pivotIndex;
			while (index >= 0 && index < paneConstraintsArray.length) {
				const prevSize = nextLayout[index];
				assert(prevSize != null);

				const unsafeSize = prevSize + deltaRemaining;
				const safeSize = resizePane({
					paneConstraints: paneConstraintsArray,
					paneIndex: index,
					initialSize: unsafeSize,
				});

				if (!areNumbersAlmostEqual(prevSize, safeSize)) {
					deltaRemaining -= safeSize - prevSize;
					nextLayout[index] = safeSize;
				}

				if (areNumbersAlmostEqual(deltaRemaining, 0)) break;

				delta > 0 ? index-- : index++;
			}
		}
	}

	const totalSize = nextLayout.reduce((total, size) => size + total, 0);

	if (!areNumbersAlmostEqual(totalSize, 100)) return prevLayout;

	return nextLayout;
}
