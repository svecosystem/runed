---
title: Nested Groups
description: An example of nesting groups of panes for more complex layouts.
---

<script>
	import { NestedGroupsDemo } from '$lib/components/demos'
	import { ViewExampleCode } from '$lib/components'
</script>

<NestedGroupsDemo />

<ViewExampleCode href="https://github.com/svecosystem/paneforge/blob/main/sites/docs/src/lib/components/demos/nested-groups-demo.svelte" />

## Anatomy

Here's the high-level structure of the example above:

```svelte
<script lang="ts">
	import { PaneGroup, Pane, PaneResizer } from "paneforge";
</script>

<PaneGroup direction="horizontal">
	<Pane defaultSize={50} />
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
