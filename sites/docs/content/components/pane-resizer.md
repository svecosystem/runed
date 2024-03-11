---
title: PaneResizer
description: A draggable handle between two panes that allows the user to resize them.
tagline: Components
---

The `PaneResizer` component is used to create a draggable handle between two panes that allows the user to resize them.

## Usage

```svelte {7}
<script lang="ts">
	import { PaneGroup, Pane, PaneResizer } from "svelte-pane";
</script>

<PaneGroup direction="horizontal">
	<Pane defaultSize={50}>Pane 1</Pane>
	<PaneResizer />
	<Pane defaultSize={50}>Pane 2</Pane>
</PaneGroup>
```

## Props

Here are the props available for the `PaneResizer` component:

```ts
export type PaneResizerProps = {
	/**
	 * Whether the resize handle is disabled.
	 *
	 * @defaultValue `false`
	 */
	disabled?: boolean;

	/**
	 * A callback that is called when the resize handle's dragging state changes.
	 */
	onDraggingChange?: (isDragging: boolean) => void;

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
```

## Data Attributes

The following data attributes are available for the `PaneResizer` component:

```ts
export type PaneResizerAttributes = {
	/** The direction of the pane group the handle belongs to. */
	"data-direction": "horizontal" | "vertical";
	/** The ID of the pane group the handle belongs to. */
	"data-pane-group-id": string;
	/** Whether the resize handle is active or not. */
	"data-active"?: "pointer" | "keyboard";
	/** Whether the resize handle is enabled or not. */
	"data-enabled"?: boolean;
	/** The ID of the resize handle. */
	"data-pane-resizer-id": string;
	/** Present on all resizer elements */
	"data-pane-resizer": "";
};
```
