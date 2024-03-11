import type { DragState, Direction, PaneData, PaneConstraints, ResizeEvent } from "./types.js";
import {
	initializeStorage,
	loadPaneGroupState,
	resizePane,
	resetGlobalCursorStyle,
	setGlobalCursorStyle,
	type PaneGroupStorage,
	updateStorageValues,
	adjustLayoutByDelta,
	areNumbersAlmostEqual,
	areArraysEqual,
	generateId,
	removeUndefined,
	clientEffect,
	toWritableStores,
	calculateAriaValues,
	addEventListener,
	computePaneFlexBoxStyle,
	styleToString,
	isBrowser,
	isHTMLElement,
	isKeyDown,
	isMouseEvent,
	isTouchEvent,
} from "$lib/internal/utils/index.js";
import { derived, get, writable } from "svelte/store";
import { assert } from "./utils/assert.js";
import { onMount } from "svelte";
import type { PaneGroupAttributes } from "$lib/components/types.js";

export type PaneGroupOnLayout = (layout: number[]) => void;

export type PaneGroupProps = {
	autoSaveId?: string | null;
	direction: Direction;
	id?: string | null;
	keyboardResizeBy?: number | null;
	onLayout?: PaneGroupOnLayout | null;
	storage?: PaneGroupStorage;
	style?: string;
	tagName?: keyof HTMLElementTagNameMap;
};

export const defaultStorage: PaneGroupStorage = {
	getItem: (name: string) => {
		initializeStorage(defaultStorage);
		return defaultStorage.getItem(name);
	},
	setItem: (name: string, value: string) => {
		initializeStorage(defaultStorage);
		defaultStorage.setItem(name, value);
	},
};

export type CreatePaneForgeProps = {
	autoSaveId: string | null;
	direction: Direction;
	id: string | null | undefined;
	keyboardResizeBy: number | null;
	onLayout: PaneGroupOnLayout | null;
	storage: PaneGroupStorage;
};

const defaultProps: CreatePaneForgeProps = {
	id: null,
	onLayout: null,
	keyboardResizeBy: null,
	autoSaveId: null,
	direction: "horizontal",
	storage: defaultStorage,
};

export function createPaneForge(props: CreatePaneForgeProps) {
	const withDefaults = {
		...defaultProps,
		...removeUndefined(props),
	};

	const options = toWritableStores(withDefaults);
	const { autoSaveId, direction, keyboardResizeBy, storage, onLayout } = options;

	const groupId = writable(generateId());
	const dragState = writable<DragState | null>(null);
	const layout = writable<number[]>([]);
	const paneDataArray = writable<PaneData[]>([]);
	const paneDataArrayChanged = writable(false);

	const paneIdToLastNotifiedSizeMap = writable<Record<string, number>>({});
	const paneSizeBeforeCollapseMap = writable<Map<string, number>>(new Map());
	const prevDelta = writable<number>(0);

	clientEffect([groupId, layout, paneDataArray], ([$groupId, $layout, $paneDataArray]) => {
		const unsub = updateResizeHandleAriaValues({
			groupId: $groupId,
			layout: $layout,
			paneDataArray: $paneDataArray,
		});

		return unsub;
	});

	onMount(() => {
		const unsub = setResizeHandlerEventListeners();
		return unsub;
	});

	clientEffect([autoSaveId, layout, storage], ([$autoSaveId, $layout, $storage]) => {
		if (!$autoSaveId) return;

		updateStorageValues({
			autoSaveId: $autoSaveId,
			layout: $layout,
			storage: $storage,
			paneDataArrayStore: paneDataArray,
			paneSizeBeforeCollapseStore: paneSizeBeforeCollapseMap,
		});
	});

	function collapsePane(paneData: PaneData) {
		const $prevLayout = get(layout);
		const $paneDataArray = get(paneDataArray);

		if (!paneData.constraints.collapsible) return;

		const paneConstraintsArray = $paneDataArray.map((paneData) => paneData.constraints);

		const {
			collapsedSize = 0,
			paneSize,
			pivotIndices,
		} = paneDataHelper($paneDataArray, paneData, $prevLayout);

		assert(paneSize != null);

		if (paneSize === collapsedSize) return;

		// Store the size before collapse, which is returned when `expand()` is called
		paneSizeBeforeCollapseMap.update((curr) => {
			curr.set(paneData.id, paneSize);
			return curr;
		});

		const isLastPane = findPaneDataIndex($paneDataArray, paneData) === $paneDataArray.length - 1;
		const delta = isLastPane ? paneSize - collapsedSize : collapsedSize - paneSize;

		const nextLayout = adjustLayoutByDelta({
			delta,
			layout: $prevLayout,
			paneConstraints: paneConstraintsArray,
			pivotIndices,
			trigger: "imperative-api",
		});

		if (areArraysEqual($prevLayout, nextLayout)) return;

		layout.set(nextLayout);
		const $onLayout = get(onLayout);

		if ($onLayout) {
			$onLayout(nextLayout);
		}

		callPaneCallbacks($paneDataArray, nextLayout, get(paneIdToLastNotifiedSizeMap));
	}

	function getPaneSize(paneData: PaneData) {
		const $layout = get(layout);
		const $paneDataArray = get(paneDataArray);

		const { paneSize } = paneDataHelper($paneDataArray, paneData, $layout);
		return paneSize;
	}

	const getPaneStyle = derived(
		[paneDataArray, layout, dragState],
		([$paneDataArray, $layout, $dragState]) => {
			return (paneData: PaneData, defaultSize: number | undefined) => {
				const paneIndex = findPaneDataIndex($paneDataArray, paneData);
				return computePaneFlexBoxStyle({
					defaultSize,
					dragState: $dragState,
					layout: $layout,
					paneData: $paneDataArray,
					paneIndex,
				});
			};
		}
	);

	function isPaneExpanded(paneData: PaneData) {
		const $paneDataArray = get(paneDataArray);
		const $layout = get(layout);

		const {
			collapsedSize = 0,
			collapsible,
			paneSize,
		} = paneDataHelper($paneDataArray, paneData, $layout);

		return !collapsible || paneSize > collapsedSize;
	}

	function registerPane(paneData: PaneData) {
		paneDataArray.update((curr) => {
			const newArr = [...curr, paneData];
			newArr.sort((paneA, paneB) => {
				const orderA = paneA.order;
				const orderB = paneB.order;

				if (orderA == null && orderB == null) {
					return 0;
				} else if (orderA == null) {
					return -1;
				} else if (orderB == null) {
					return 1;
				} else {
					return orderA - orderB;
				}
			});
			return newArr;
		});
		paneDataArrayChanged.set(true);
	}

	clientEffect([paneDataArrayChanged], ([$paneDataArrayChanged]) => {
		if (!$paneDataArrayChanged) return;

		paneDataArrayChanged.set(false);

		const $autoSaveId = get(autoSaveId);
		const $storage = get(storage);

		const $prevLayout = get(layout);
		const $paneDataArray = get(paneDataArray);

		// If this pane has been configured to persist sizing information,
		// default size should be restored from local storage if possible.
		let unsafeLayout: number[] | null = null;

		if ($autoSaveId) {
			const state = loadPaneGroupState($autoSaveId, $paneDataArray, $storage);
			if (state) {
				paneSizeBeforeCollapseMap.set(new Map(Object.entries(state.expandToSizes)));
				unsafeLayout = state.layout;
			}
		}

		if (unsafeLayout == null) {
			unsafeLayout = getUnsafeDefaultLayout({
				paneDataArray: $paneDataArray,
			});
		}

		// Validate even saved layouts in case something has changed since last render
		const nextLayout = validatePaneGroupLayout({
			layout: unsafeLayout,
			paneConstraints: $paneDataArray.map((paneData) => paneData.constraints),
		});

		if (areArraysEqual($prevLayout, nextLayout)) return;

		layout.set(nextLayout);
		const $onLayout = get(onLayout);

		if ($onLayout) {
			$onLayout(nextLayout);
		}

		callPaneCallbacks($paneDataArray, nextLayout, get(paneIdToLastNotifiedSizeMap));
	});

	function registerResizeHandle(dragHandleId: string) {
		return function resizeHandler(event: ResizeEvent) {
			event.preventDefault();

			const $direction = get(direction);
			const $dragState = get(dragState);
			const $groupId = get(groupId);
			const $keyboardResizeBy = get(keyboardResizeBy);

			const $prevLayout = get(layout);
			const $paneDataArray = get(paneDataArray);

			const { initialLayout } = $dragState ?? {};

			const pivotIndices = getPivotIndices($groupId, dragHandleId);

			let delta = getDeltaPercentage(
				event,
				dragHandleId,
				$direction,
				$dragState,
				$keyboardResizeBy
			);
			if (delta === 0) return;

			// support RTL
			const isHorizontal = $direction === "horizontal";
			if (document.dir === "rtl" && isHorizontal) {
				delta = -delta;
			}

			const paneConstraints = $paneDataArray.map((paneData) => paneData.constraints);

			const nextLayout = adjustLayoutByDelta({
				delta,
				layout: initialLayout ?? $prevLayout,
				paneConstraints: paneConstraints,
				pivotIndices,
				trigger: isKeyDown(event) ? "keyboard" : "mouse-or-touch",
			});
			const layoutChanged = !areArraysEqual($prevLayout, nextLayout);

			// Only update the cursor for layout changes triggered by touch/mouse events (not keyboard)
			// Update the cursor even if the layout hasn't changed (we may need to show an invalid cursor state)
			if (isMouseEvent(event) || isTouchEvent(event)) {
				// Watch for multiple subsequent deltas; this might occur for tiny cursor movements.
				// In this case, Pane sizes might not change–
				// but updating cursor in this scenario would cause a flicker.
				const $prevDelta = get(prevDelta);
				if ($prevDelta != delta) {
					prevDelta.set(delta);

					if (!layoutChanged) {
						// If the pointer has moved too far to resize the pane any further,
						// update the cursor style for a visual clue.
						// This mimics VS Code behavior.

						if (isHorizontal) {
							setGlobalCursorStyle(delta < 0 ? "horizontal-min" : "horizontal-max");
						} else {
							setGlobalCursorStyle(delta < 0 ? "vertical-min" : "vertical-max");
						}
					} else {
						setGlobalCursorStyle(isHorizontal ? "horizontal" : "vertical");
					}
				}
			}

			if (layoutChanged) {
				layout.set(nextLayout);
				const $onLayout = get(onLayout);

				if ($onLayout) {
					$onLayout(nextLayout);
				}

				callPaneCallbacks($paneDataArray, nextLayout, get(paneIdToLastNotifiedSizeMap));
			}
		};
	}

	function resizePane(paneData: PaneData, unsafePaneSize: number) {
		const $prevLayout = get(layout);
		const $paneDataArray = get(paneDataArray);

		const paneConstraintsArr = $paneDataArray.map((paneData) => paneData.constraints);

		const { paneSize, pivotIndices } = paneDataHelper($paneDataArray, paneData, $prevLayout);

		assert(paneSize != null);

		const isLastPane = findPaneDataIndex($paneDataArray, paneData) === $paneDataArray.length - 1;

		const delta = isLastPane ? paneSize - unsafePaneSize : unsafePaneSize - paneSize;

		const nextLayout = adjustLayoutByDelta({
			delta,
			layout: $prevLayout,
			paneConstraints: paneConstraintsArr,
			pivotIndices,
			trigger: "imperative-api",
		});

		if (areArraysEqual($prevLayout, nextLayout)) return;

		layout.set(nextLayout);

		const $onLayout = get(onLayout);

		$onLayout?.(nextLayout);

		callPaneCallbacks($paneDataArray, nextLayout, get(paneIdToLastNotifiedSizeMap));
	}

	function startDragging(dragHandleId: string, event: ResizeEvent) {
		const $direction = get(direction);
		const $layout = get(layout);

		const handleElement = getResizeHandleElement(dragHandleId);

		assert(handleElement);

		const initialCursorPosition = getResizeEventCursorPosition($direction, event);

		dragState.set({
			dragHandleId,
			dragHandleRect: handleElement.getBoundingClientRect(),
			initialCursorPosition,
			initialLayout: $layout,
		});
	}

	function stopDragging() {
		resetGlobalCursorStyle();
		dragState.set(null);
	}

	function unregisterPane(paneData: PaneData) {
		const $paneDataArray = get(paneDataArray);
		const index = findPaneDataIndex($paneDataArray, paneData);

		if (index < 0) return;
		paneDataArray.update((curr) => {
			curr.splice(index, 1);
			paneIdToLastNotifiedSizeMap.update((curr) => {
				delete curr[paneData.id];
				return curr;
			});
			paneDataArrayChanged.set(true);
			return curr;
		});
	}

	function isPaneCollapsed(paneData: PaneData) {
		const $paneDataArray = get(paneDataArray);
		const $layout = get(layout);

		const {
			collapsedSize = 0,
			collapsible,
			paneSize,
		} = paneDataHelper($paneDataArray, paneData, $layout);

		return collapsible === true && paneSize === collapsedSize;
	}

	function expandPane(paneData: PaneData) {
		const $prevLayout = get(layout);
		const $paneDataArray = get(paneDataArray);

		if (!paneData.constraints.collapsible) return;
		const paneConstraintsArray = $paneDataArray.map((paneData) => paneData.constraints);

		const {
			collapsedSize = 0,
			paneSize,
			minSize = 0,
			pivotIndices,
		} = paneDataHelper($paneDataArray, paneData, $prevLayout);

		if (paneSize !== collapsedSize) return;
		// Restore this pane to the size it was before it was collapsed, if possible.
		const prevPaneSize = get(paneSizeBeforeCollapseMap).get(paneData.id);
		const baseSize = prevPaneSize != null && prevPaneSize >= minSize ? prevPaneSize : minSize;

		const isLastPane = findPaneDataIndex($paneDataArray, paneData) === $paneDataArray.length - 1;

		const delta = isLastPane ? paneSize - baseSize : baseSize - paneSize;

		const nextLayout = adjustLayoutByDelta({
			delta,
			layout: $prevLayout,
			paneConstraints: paneConstraintsArray,
			pivotIndices,
			trigger: "imperative-api",
		});

		if (areArraysEqual($prevLayout, nextLayout)) return;

		layout.set(nextLayout);

		const $onLayout = get(onLayout);

		$onLayout?.(nextLayout);

		callPaneCallbacks($paneDataArray, nextLayout, get(paneIdToLastNotifiedSizeMap));
	}

	const paneGroupStyle = derived([direction], ([$direction]) => {
		return styleToString({
			display: "flex",
			"flex-direction": $direction === "horizontal" ? "row" : "column",
			height: "100%",
			overflow: "hidden",
			width: "100%",
		});
	});

	const paneGroupSelectors = derived([direction, groupId], ([$direction, $groupId]) => {
		return {
			"data-pane-group": "",
			"data-direction": $direction,
			"data-pane-group-id": $groupId,
		} satisfies PaneGroupAttributes;
	});

	const paneGroupAttrs = derived([paneGroupStyle, paneGroupSelectors], ([$style, $selectors]) => {
		return {
			style: $style,
			...$selectors,
		};
	});

	function setResizeHandlerEventListeners() {
		const $groupId = get(groupId);
		const handles = getResizeHandleElementsForGroup($groupId);

		const unsubHandlers = handles.map((handle) => {
			const handleId = handle.getAttribute("data-pane-resizer-id");
			if (!handleId) return noop;

			const [idBefore, idAfter] = getResizeHandlePaneIds($groupId, handleId, get(paneDataArray));

			if (idBefore == null || idAfter == null) return noop;

			const onKeydown = (e: KeyboardEvent) => {
				if (e.defaultPrevented || e.key !== "Enter") return;

				e.preventDefault();
				const $paneDataArray = get(paneDataArray);

				const index = $paneDataArray.findIndex((paneData) => paneData.id === idBefore);

				if (index < 0) return;

				const paneData = $paneDataArray[index];
				assert(paneData);
				const $layout = get(layout);

				const size = $layout[index];

				const { collapsedSize = 0, collapsible, minSize = 0 } = paneData.constraints;

				if (!(size != null && collapsible)) return;

				const nextLayout = adjustLayoutByDelta({
					delta: areNumbersAlmostEqual(size, collapsedSize) ? minSize - size : collapsedSize - size,
					layout: $layout,
					paneConstraints: $paneDataArray.map((paneData) => paneData.constraints),
					pivotIndices: getPivotIndices($groupId, handleId),
					trigger: "keyboard",
				});
				if ($layout !== nextLayout) {
					layout.set(nextLayout);
				}
			};

			const unsubListener = addEventListener(handle, "keydown", onKeydown);

			return () => {
				unsubListener();
			};
		});

		return () => {
			unsubHandlers.forEach((unsub) => unsub());
		};
	}

	function setLayout(newLayout: number[]) {
		layout.set(newLayout);
	}

	function getLayout() {
		return get(layout);
	}

	return {
		methods: {
			collapsePane,
			expandPane,
			getSize: getPaneSize,
			getPaneStyle,
			isCollapsed: isPaneCollapsed,
			isExpanded: isPaneExpanded,
			registerPane,
			registerResizeHandle,
			resizePane,
			startDragging,
			stopDragging,
			unregisterPane,
			setLayout,
			getLayout,
		},
		states: {
			direction,
			dragState,
			groupId,
			paneGroupAttrs,
			paneGroupSelectors,
			paneGroupStyle,
			layout,
		},
		options,
	};
}

function updateResizeHandleAriaValues({
	groupId,
	layout,
	paneDataArray,
}: {
	groupId: string;
	layout: number[];
	paneDataArray: PaneData[];
}) {
	const resizeHandleElements = getResizeHandleElementsForGroup(groupId);

	for (let index = 0; index < paneDataArray.length - 1; index++) {
		const { valueMax, valueMin, valueNow } = calculateAriaValues({
			layout,
			panesArray: paneDataArray,
			pivotIndices: [index, index + 1],
		});

		const resizeHandleEl = resizeHandleElements[index];

		if (isHTMLElement(resizeHandleEl)) {
			const paneData = paneDataArray[index];

			resizeHandleEl.setAttribute("aria-controls", paneData.id);
			resizeHandleEl.setAttribute("aria-valuemax", "" + Math.round(valueMax));
			resizeHandleEl.setAttribute("aria-valuemin", "" + Math.round(valueMin));
			resizeHandleEl.setAttribute(
				"aria-valuenow",
				valueNow != null ? "" + Math.round(valueNow) : ""
			);
		}
	}

	return () => {
		resizeHandleElements.forEach((resizeHandleElement) => {
			resizeHandleElement.removeAttribute("aria-controls");
			resizeHandleElement.removeAttribute("aria-valuemax");
			resizeHandleElement.removeAttribute("aria-valuemin");
			resizeHandleElement.removeAttribute("aria-valuenow");
		});
	};
}

export function getResizeHandleElementsForGroup(groupId: string): HTMLElement[] {
	if (!isBrowser) return [];
	return Array.from(
		document.querySelectorAll(`[data-pane-resizer-id][data-pane-group-id="${groupId}"]`)
	);
}

function getPaneGroupElement(id: string): HTMLElement | null {
	if (!isBrowser) return null;
	const element = document.querySelector(`[data-pane-group][data-pane-group-id="${id}"]`);
	if (element) {
		return element as HTMLElement;
	}
	return null;
}

function noop() {
	// do nothing
}

export function getResizeHandlePaneIds(
	groupId: string,
	handleId: string,
	panesArray: PaneData[]
): [idBefore: string | null, idAfter: string | null] {
	const handle = getResizeHandleElement(handleId);
	const handles = getResizeHandleElementsForGroup(groupId);
	const index = handle ? handles.indexOf(handle) : -1;

	const idBefore: string | null = panesArray[index]?.id ?? null;
	const idAfter: string | null = panesArray[index + 1]?.id ?? null;

	return [idBefore, idAfter];
}

export function getResizeHandleElement(id: string): HTMLElement | null {
	if (!isBrowser) return null;
	const element = document.querySelector(`[data-pane-resizer-id="${id}"]`);
	if (element) {
		return element as HTMLElement;
	}
	return null;
}

export function getResizeHandleElementIndex(groupId: string, id: string): number | null {
	if (!isBrowser) return null;
	const handles = getResizeHandleElementsForGroup(groupId);
	const index = handles.findIndex((handle) => handle.getAttribute("data-pane-resizer-id") === id);
	return index ?? null;
}

function getPivotIndices(
	groupId: string,
	dragHandleId: string
): [indexBefore: number, indexAfter: number] {
	const index = getResizeHandleElementIndex(groupId, dragHandleId);

	return index != null ? [index, index + 1] : [-1, -1];
}

function paneDataHelper(paneDataArray: PaneData[], paneData: PaneData, layout: number[]) {
	const paneConstraintsArray = paneDataArray.map((paneData) => paneData.constraints);

	const paneIndex = findPaneDataIndex(paneDataArray, paneData);
	const paneConstraints = paneConstraintsArray[paneIndex];

	const isLastPane = paneIndex === paneDataArray.length - 1;
	const pivotIndices = isLastPane ? [paneIndex - 1, paneIndex] : [paneIndex, paneIndex + 1];

	const paneSize = layout[paneIndex];

	return {
		...paneConstraints,
		paneSize,
		pivotIndices,
	};
}

function findPaneDataIndex(paneDataArray: PaneData[], paneData: PaneData) {
	return paneDataArray.findIndex((prevPaneData) => prevPaneData.id === paneData.id);
}

// Layout should be pre-converted into percentages
function callPaneCallbacks(
	paneArray: PaneData[],
	layout: number[],
	paneIdToLastNotifiedSizeMap: Record<string, number>
) {
	layout.forEach((size, index) => {
		const paneData = paneArray[index];
		assert(paneData);

		const { callbacks, constraints, id: paneId } = paneData;
		const { collapsedSize = 0, collapsible } = constraints;

		const lastNotifiedSize = paneIdToLastNotifiedSizeMap[paneId];
		// invert the logic from below

		if (!(lastNotifiedSize == null || size !== lastNotifiedSize)) return;
		paneIdToLastNotifiedSizeMap[paneId] = size;

		const { onCollapse, onExpand, onResize } = callbacks;

		onResize?.(size, lastNotifiedSize);

		if (collapsible && (onCollapse || onExpand)) {
			if (
				onExpand &&
				(lastNotifiedSize == null || lastNotifiedSize === collapsedSize) &&
				size !== collapsedSize
			) {
				onExpand();
			}

			if (
				onCollapse &&
				(lastNotifiedSize == null || lastNotifiedSize !== collapsedSize) &&
				size === collapsedSize
			) {
				onCollapse();
			}
		}
	});
}

function getUnsafeDefaultLayout({ paneDataArray }: { paneDataArray: PaneData[] }): number[] {
	const layout = Array<number>(paneDataArray.length);

	const paneConstraintsArray = paneDataArray.map((paneData) => paneData.constraints);

	let numPanesWithSizes = 0;
	let remainingSize = 100;

	// Distribute default sizes first
	for (let index = 0; index < paneDataArray.length; index++) {
		const paneConstraints = paneConstraintsArray[index];
		assert(paneConstraints);
		const { defaultSize } = paneConstraints;

		if (defaultSize != null) {
			numPanesWithSizes++;
			layout[index] = defaultSize;
			remainingSize -= defaultSize;
		}
	}

	// Remaining size should be distributed evenly between panes without default sizes
	for (let index = 0; index < paneDataArray.length; index++) {
		const paneConstraints = paneConstraintsArray[index];
		assert(paneConstraints);
		const { defaultSize } = paneConstraints;

		if (defaultSize != null) {
			continue;
		}

		const numRemainingPanes = paneDataArray.length - numPanesWithSizes;
		const size = remainingSize / numRemainingPanes;

		numPanesWithSizes++;
		layout[index] = size;
		remainingSize -= size;
	}

	return layout;
}

// All units must be in percentages
function validatePaneGroupLayout({
	layout: prevLayout,
	paneConstraints,
}: {
	layout: number[];
	paneConstraints: PaneConstraints[];
}): number[] {
	const nextLayout = [...prevLayout];
	const nextLayoutTotalSize = nextLayout.reduce((accumulated, current) => accumulated + current, 0);

	// Validate layout expectations
	if (nextLayout.length !== paneConstraints.length) {
		throw Error(
			`Invalid ${paneConstraints.length} pane layout: ${nextLayout
				.map((size) => `${size}%`)
				.join(", ")}`
		);
	} else if (!areNumbersAlmostEqual(nextLayoutTotalSize, 100)) {
		for (let index = 0; index < paneConstraints.length; index++) {
			const unsafeSize = nextLayout[index];
			assert(unsafeSize != null);
			const safeSize = (100 / nextLayoutTotalSize) * unsafeSize;
			nextLayout[index] = safeSize;
		}
	}

	let remainingSize = 0;

	// First pass: Validate the proposed layout given each pane's constraints
	for (let index = 0; index < paneConstraints.length; index++) {
		const unsafeSize = nextLayout[index];
		assert(unsafeSize != null);

		const safeSize = resizePane({
			paneConstraints,
			paneIndex: index,
			initialSize: unsafeSize,
		});

		if (unsafeSize != safeSize) {
			remainingSize += unsafeSize - safeSize;

			nextLayout[index] = safeSize;
		}
	}

	// If there is additional, left over space, assign it to any pane(s) that permits it
	// (It's not worth taking multiple additional passes to evenly distribute)
	if (!areNumbersAlmostEqual(remainingSize, 0)) {
		for (let index = 0; index < paneConstraints.length; index++) {
			const prevSize = nextLayout[index];
			assert(prevSize != null);
			const unsafeSize = prevSize + remainingSize;
			const safeSize = resizePane({
				paneConstraints,
				paneIndex: index,
				initialSize: unsafeSize,
			});

			if (prevSize !== safeSize) {
				remainingSize -= safeSize - prevSize;
				nextLayout[index] = safeSize;

				// Once we've used up the remainder, bail
				if (areNumbersAlmostEqual(remainingSize, 0)) {
					break;
				}
			}
		}
	}

	return nextLayout;
}

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX
function getDeltaPercentage(
	e: ResizeEvent,
	dragHandleId: string,
	dir: Direction,
	initialDragState: DragState | null,
	keyboardResizeBy: number | null
): number {
	if (isKeyDown(e)) {
		const isHorizontal = dir === "horizontal";

		let delta = 0;
		if (e.shiftKey) {
			delta = 100;
		} else if (keyboardResizeBy != null) {
			delta = keyboardResizeBy;
		} else {
			delta = 10;
		}

		let movement = 0;
		switch (e.key) {
			case "ArrowDown":
				movement = isHorizontal ? 0 : delta;
				break;
			case "ArrowLeft":
				movement = isHorizontal ? -delta : 0;
				break;
			case "ArrowRight":
				movement = isHorizontal ? delta : 0;
				break;
			case "ArrowUp":
				movement = isHorizontal ? 0 : -delta;
				break;
			case "End":
				movement = 100;
				break;
			case "Home":
				movement = -100;
				break;
		}

		return movement;
	} else {
		if (initialDragState == null) return 0;

		return getDragOffsetPercentage(e, dragHandleId, dir, initialDragState);
	}
}

function getDragOffsetPercentage(
	e: ResizeEvent,
	dragHandleId: string,
	dir: Direction,
	initialDragState: DragState
): number {
	const isHorizontal = dir === "horizontal";

	const handleElement = getResizeHandleElement(dragHandleId);
	assert(handleElement);

	const groupId = handleElement.getAttribute("data-pane-group-id");
	assert(groupId);

	const { initialCursorPosition } = initialDragState;

	const cursorPosition = getResizeEventCursorPosition(dir, e);

	const groupElement = getPaneGroupElement(groupId);
	assert(groupElement);

	const groupRect = groupElement.getBoundingClientRect();
	const groupSizeInPixels = isHorizontal ? groupRect.width : groupRect.height;

	const offsetPixels = cursorPosition - initialCursorPosition;
	const offsetPercentage = (offsetPixels / groupSizeInPixels) * 100;

	return offsetPercentage;
}

function getResizeEventCursorPosition(dir: Direction, e: ResizeEvent): number {
	const isHorizontal = dir === "horizontal";

	if (isMouseEvent(e)) {
		return isHorizontal ? e.clientX : e.clientY;
	} else if (isTouchEvent(e)) {
		const firstTouch = e.touches[0];
		assert(firstTouch);
		return isHorizontal ? firstTouch.screenX : firstTouch.screenY;
	} else {
		throw Error(`Unsupported event type "${e.type}"`);
	}
}
