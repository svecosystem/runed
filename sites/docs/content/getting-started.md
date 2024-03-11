---
title: Getting Started
description: Learn how to install and use Paneforge in your projects.
---

## Installation

Install Paneforge using your favorite package manager:

```bash
npm install paneforge
```

## Basic Usage

Here's a simple example of how to use Paneforge to create a horizontal pane group with two panes:

```svelte
<script lang="ts">
	import { PaneGroup, Pane, PaneResizer } from "paneforge";
</script>

<PaneGroup direction="horizontal">
	<Pane defaultSize={50}>Pane 1</Pane>
	<PaneResizer />
	<Pane defaultSize={50}>Pane 2</Pane>
</PaneGroup>
```

The `PaneGroup` component is used to initialize a pane group, and the `Pane` component is used to create a pane. The `PaneResizer` component is used to create a resizer that can be dragged to resize the panes.

The components ship only with the styles necessary to position the panes in the appropriate layout. The rest of the styling is up to you.
