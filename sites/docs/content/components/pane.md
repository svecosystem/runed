---
title: Pane
description: An individual pane within a pane group.
tagline: Components
---

The `Pane` component is used to create an individual pane within a `PaneGroup`.

## Props

Here are the props available for the `Pane` component:

```ts
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
	 * The default size of the pane in percentage of the group's size.
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
	onCollapse?: () => void;

	/**
	 * A callback that is called when the pane is expanded.
	 */
	onExpand?: () => void;

	/**
	 * A callback that is called when the pane is resized.
	 */
	onResize?: (size: number, prevSize: number | undefined) => void;

	/**
	 * The underlying DOM element of the pane. You can `bind` to this
	 * prop to get a reference to the element.
	 */
	el?: HTMLElement | null;

	/**
	 * An imperative API for the pane. `bind` to this prop to get access
	 * to methods for controlling the pane.
	 */
	api?: PaneAPI;
} & Omit<HTMLAttributes<HTMLDivElement>, "id">;
```

## Imperative API

The `Pane` component provides an imperative API for controlling the pane which can be accessed by binding a variable to the `api` prop. Here are the methods available on the `PaneAPI`:

```ts
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
```

## Data Attributes

The following data attributes are available for the `Pane` component:

```ts
export type PaneAttributes = {
	/** Applied to every pane element. */
	"data-pane": "";
	/** The ID of the pane. */
	"data-pane-id": string;
	/** The ID of the pane's group. */
	"data-pane-group-id": string;
};
```
