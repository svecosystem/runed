---
title: PaneGroup
description: A container for panes or nested pane groups.
tagline: Components
---

The `PaneGroup` component wraps a collection of panes or nested `PaneGroup`s and is used to initialize and manage the layout of the panes.

## Props

Here are the props available for the `PaneGroup` component:

```ts
export type PaneGroupProps = {
	/**
	 * The id to save the layout of the panes to in local storage.
	 */
	autoSaveId?: string | null;

	/**
	 * The direction of the panes.
	 * @required
	 */
	direction: "horizontal" | "vertical";

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
	onLayoutChange?: (layout: number[]) => void | null;

	/**
	 * The storage object to use for saving the layout of the panes in the group.
	 *
	 * Defaults to use `localStorage` if an `autoSaveId` is provided and no storage is provided.
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
```

## Imperative API

The `PaneGroup` component provides an imperative API for controlling the pane group which can be accessed by binding a variable to the `api` prop. Here are the methods available on the `PaneGroupAPI`:

```ts
export type PaneGroupAPI = {
	/** Get the ID of the PaneGroup */
	getId: () => string;
	/** Get the layout of the PaneGroup */
	getLayout: () => number[];
	/** Set the layout of the PaneGroup */
	setLayout: (layout: number[]) => void;
};
```

## Persisted Layouts/Storage

When the `PaneGroup` component is provided with an `autoSaveId` prop, it will automatically save the layout of the panes to local storage. If you want to use a different storage mechanism, you can provide a `storage` prop with a custom storage object that implements the `PaneGroupStorage` interface.

```ts
export type PaneGroupStorage = {
	/** Retrieves the item from storage */
	getItem(name: string): string | null;
	/** Sets the item to storage */
	setItem(name: string, value: string): void;
};
```

## Data Attributes

The following data attributes are available for the `PaneGroup` component:

```ts
export type PaneGroupAttributes = {
	/** Applied to every pane group element. */
	"data-pane-group": "";
	/** The direction of the pane group. */
	"data-direction": "horizontal" | "vertical";
	/** The ID of the pane group. */
	"data-pane-group-id": string;
};
```
