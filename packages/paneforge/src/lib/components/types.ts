import type { PaneGroupOnLayout } from "$lib/internal/paneforge.js";
import type {
	Direction,
	PaneOnCollapse,
	PaneOnExpand,
	PaneOnResize,
	PaneResizeHandleOnDragging,
} from "$lib/internal/types.js";
import type { PaneGroupStorage } from "$lib/internal/utils/storage.js";
import type { HTMLAttributes } from "svelte/elements";

export type PaneProps = {
	/**
	 * The size of the pane when it is in a collapsed state.
	 */
	collapsedSize?: number;

	/**
	 * Whether the pane can be collapsed.
	 *
	 * @defaultValue `false`
	 */
	collapsible?: boolean;

	/**
	 * The default size of the pane in percentage.
	 */
	defaultSize?: number;

	/**
	 * The id of the pane element.
	 */
	id?: string | null;

	/**
	 * The maximum size of the pane in percentage of the group's size.
	 *
	 * @defaultValue `100`
	 */
	maxSize?: number;

	/**
	 * The minimum size of the pane in percentage of the group's size.
	 *
	 * @defaultValue `0`
	 */
	minSize?: number;

	/**
	 * The order of the pane in the group.
	 * Useful for maintaining order when conditionally rendering panes.
	 */
	order?: number;

	/**
	 * A callback that is called when the pane is collapsed.
	 */
	onCollapse?: PaneOnCollapse;

	/**
	 * A callback that is called when the pane is expanded.
	 */
	onExpand?: PaneOnExpand;

	/**
	 * A callback that is called when the pane is resized.
	 */
	onResize?: PaneOnResize;

	/**
	 * The underlying DOM element of the pane. You can `bind` to this
	 * prop to get a reference to the element.
	 */
	el?: HTMLElement | null;

	/**
	 * An imperative API for the pane. `bind` to this prop to get access
	 * to methods for controlling the pane.
	 */
	pane?: PaneAPI;
} & Omit<HTMLAttributes<HTMLDivElement>, "id">;

export type PaneResizerProps = {
	/**
	 * Whether the resize handle is disabled.
	 *
	 * @defaultValue `false`
	 */
	disabled?: boolean;

	/**
	 * A callback that is called when the resize handle is being dragged.
	 */
	onDraggingChange?: PaneResizeHandleOnDragging;

	/**
	 * The tabIndex of the resize handle.
	 */
	tabIndex?: number;

	/**
	 * The underlying DOM element of the resize handle. You can `bind` to this
	 * prop to get a reference to the element.
	 */
	el?: HTMLElement | null;
} & HTMLAttributes<HTMLDivElement>;

export type PaneGroupProps = {
	/**
	 * The id to save the layout of the panes to in local storage.
	 */
	autoSaveId?: string | null;

	/**
	 * The direction of the panes.
	 *
	 * @required
	 */
	direction: Direction;

	/**
	 * The id of the pane group DOM element.
	 */
	id?: string | null;

	/**
	 * The amount of space to add to the pane group when the keyboard
	 * resize event is triggered.
	 */
	keyboardResizeBy?: number | null;

	/**
	 * A callback called when the layout of the panes within the group changes.
	 */
	onLayoutChange?: PaneGroupOnLayout | null;

	/**
	 * The storage object to use for saving the layout of the panes in the group.
	 */
	storage?: PaneGroupStorage;

	/**
	 * The style of the pane group. This will be appended to styles applied by
	 * the library.
	 */
	style?: string;

	/**
	 * The underlying DOM element of the pane group. You can `bind` to this
	 * prop to get a reference to the element.
	 */
	el?: HTMLElement | null;

	/**
	 * An imperative API for the pane group. `bind` to this prop to get access
	 * to methods for controlling the pane group.
	 */
	paneGroup?: PaneGroupAPI;
} & Omit<HTMLAttributes<HTMLDivElement>, "id">;

export type PaneAPI = {
	/* Collapse the panee to its minimum size */
	collapse: () => void;
	/* Expand the pane to its previous size */
	expand: () => void;
	/* Get the pane's id */
	getId: () => string;
	/** Get the panes size */
	getSize: () => number;
	/** Check if the pane is collapsed */
	isCollapsed: () => boolean;
	/** Check if the pane is expanded */
	isExpanded: () => boolean;
	/** Resize the pane to the specified size */
	resize: (size: number) => void;
};

export type PaneGroupAPI = {
	/** Get the ID of the PaneGroup */
	getId: () => string;
	/** Get the layout of the PaneGroup */
	getLayout: () => number[];
	/** Set the layout of the PaneGroup */
	setLayout: (layout: number[]) => void;
};

/**
 * Data attributes applied to the element rendered by
 * the [Pane](https://paneforge.com/docs/components/pane) component.
 */
export type PaneAttributes = {
	/** Applied to every pane element. */
	"data-pane": string;
	/** The ID of the pane. */
	"data-pane-id": string;
	/** The ID of the pane's group. */
	"data-pane-group-id": string;
};

export type PaneGroupAttributes = {
	/** Applied to every pane group element. */
	"data-pane-group": string;
	/** The direction of the pane group. */
	"data-direction": Direction;
	/** The ID of the pane group. */
	"data-pane-group-id": string;
};

export type PaneResizerAttributes = {
	/** Applied to all resizer elements */
	"data-pane-resizer": string;
	/** The direction of the pane group the resize handle belongs to. */
	"data-direction": Direction;
	/** The ID of the pane group the resize handle belongs to. */
	"data-pane-group-id": string;
	/** Whether the resize handle is active or not. */
	"data-active"?: "pointer" | "keyboard";
	/** Whether the resize handle is enabled or not. */
	"data-enabled"?: boolean;
	/** The ID of the resize handle. */
	"data-pane-resizer-id": string;
};
