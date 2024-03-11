---
title: Conditional Panes
description: An example of how to handle conditional panes.
---

<script>
	import { ConditionalDemo } from '$lib/components/demos'
	import { ViewExampleCode } from '$lib/components'
</script>

When conditionally rendering panes, you need to use the `order` prop to ensure the panes are rendered in the correct order when they are displayed.

<div class="flex flex-col gap-4">
	<ConditionalDemo />
</div>

<ViewExampleCode href="https://github.com/svecosystem/paneforge/blob/main/sites/docs/src/lib/components/demos/conditional-demo.svelte" />

## Anatomy

Here's the high-level structure of the example above:

```svelte
<script lang="ts">
	import { PaneGroup, Pane, PaneResizer } from "paneforge";

	let showPaneOne = true;
	let showPaneThree = true;
</script>

<button variant="outline" on:click={() => (showPaneOne = !showPaneOne)}>
	{showPaneOne ? "Hide" : "Show"} Pane One
</button>
<button variant="outline" on:click={() => (showPaneThree = !showPaneThree)}>
	{showPaneThree ? "Hide" : "Show"} Pane Three
</button>

<PaneGroup direction="horizontal">
	{#if showPaneOne}
		<Pane defaultSize={1 / 3} order={1} />
		<PaneResizer />
	{/if}
	<Pane defaultSize={1 / 3} order={2} />
	{#if showPaneThree}
		<PaneResizer />
		<Pane defaultSize={1 / 3} order={3} />
	{/if}
</PaneGroup>
```
