---
title: Collapsible Panes
description: An example of how to create collapsible panes.
---

<script>
	import { CollapsibleDemo } from '$lib/components/demos'
	import { ViewExampleCode } from '$lib/components'
</script>

You can use the `collapsedSize` and `collapsible` props to create collapsible panes. The `collapsedSize` prop sets the size of the pane when it is in a collapsed state, and the `collapsible` prop determines whether the pane can be collapsed.

You can also use the `onCollapse` and `onExpand` callbacks to perform actions when the pane is collapsed or expanded, along with the `pane` prop to get a reference to the `Pane` component's API to programmatically collapse or expand the pane.

<div class="flex flex-col gap-4">
	<CollapsibleDemo />
</div>

<ViewExampleCode href="https://github.com/svecosystem/paneforge/blob/main/sites/docs/src/lib/components/demos/collapsible-demo.svelte" />

## Anatomy

Here's the high-level structure of the example above:

```svelte
<script lang="ts">
	import { PaneGroup, Pane, PaneResizer, type PaneAPI } from "paneforge";

	let paneOne: PaneAPI;
	let collapsed = false;
</script>

{#if collapsed}
	<button
		on:click={() => {
			paneOne.expand();
		}}
	>
		Expand Pane One
	</button>
{:else}
	<button
		on:click={() => {
			paneOne.collapse();
		}}
	>
		Collapse Pane One
	</button>
{/if}
<PaneGroup direction="horizontal">
	<Pane
		defaultSize={50}
		collapsedSize={5}
		collapsible={true}
		minSize={15}
		bind:pane={paneOne}
		onCollapse={() => (collapsed = true)}
		onExpand={() => (collapsed = false)}
	/>
	<PaneResizer />
	<Pane defaultSize={50}>
		<PaneGroup direction="vertical">
			<Pane defaultSize={50} />
			<PaneResizer />
			<Pane defaultSize={50} />
		</PaneGroup>
	</Pane>
</PaneGroup>
```
