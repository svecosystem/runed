import type { DragState, PaneData } from "../types.js";

/**
 * A utility function that converts a style object to a string,
 * which can be used as the value of the `style` attribute for
 * an element.
 *
 * @param style - The style object to convert
 * @returns The style object as a string
 */
export function styleToString(style: StyleObject): string {
	return Object.keys(style).reduce((str, key) => {
		if (style[key] === undefined) return str;
		return str + `${key}:${style[key]};`;
	}, "");
}

export type StyleObject = Record<string, number | string | undefined>;

type CursorState =
	| "horizontal"
	| "horizontal-max"
	| "horizontal-min"
	| "vertical"
	| "vertical-max"
	| "vertical-min";

/* Global cursor state */
let currentState: CursorState | null = null;

/* Global cursor element */
let element: HTMLStyleElement | null = null;

/**
 * Returns the cursor style for a given cursor state.
 */
export function getCursorStyle(state: CursorState): string {
	switch (state) {
		case "horizontal":
			return "ew-resize";
		case "horizontal-max":
			return "w-resize";
		case "horizontal-min":
			return "e-resize";
		case "vertical":
			return "ns-resize";
		case "vertical-max":
			return "n-resize";
		case "vertical-min":
			return "s-resize";
	}
}

/**
 * Resets the global cursor style to the default.
 */
export function resetGlobalCursorStyle() {
	if (element === null) return;

	document.head.removeChild(element);

	currentState = null;
	element = null;
}

/**
 * Sets the global cursor style to the given state.
 */
export function setGlobalCursorStyle(state: CursorState) {
	if (currentState === state) return;

	currentState = state;

	const style = getCursorStyle(state);

	if (element === null) {
		element = document.createElement("style");
		document.head.appendChild(element);
	}

	element.innerHTML = `*{cursor: ${style}!important;}`;
}

/**
 * Computes the flexbox style for a pane given its layout and drag state.
 */
export function computePaneFlexBoxStyle({
	defaultSize,
	dragState,
	layout,
	paneData,
	paneIndex,
	precision = 3,
}: {
	defaultSize: number | undefined;
	layout: number[];
	dragState: DragState | null;
	paneData: PaneData[];
	paneIndex: number;
	precision?: number;
}): string {
	const size = layout[paneIndex];

	let flexGrow;
	if (size == null) {
		// Initial render (before panes have registered themselves)
		// To support server rendering, fallback to default size
		flexGrow = defaultSize ?? "1";
	} else if (paneData.length === 1) {
		//  Single pane group should always fill full width/height
		flexGrow = "1";
	} else {
		flexGrow = size.toPrecision(precision);
	}

	return styleToString({
		"flex-basis": 0,
		"flex-grow": flexGrow,
		"flex-shrink": 1,
		// Without this, pane sizes may be unintentionally overridden by their content
		overflow: "hidden",
		// Disable pointer events inside of a pane during resize
		// This avoid edge cases like nested iframes
		"pointer-events": dragState !== null ? "none" : undefined,
	});
}
