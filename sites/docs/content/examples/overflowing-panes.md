---
title: Overflowing Panes
description: An example of how panes with overflowing content are handled.
---

<script>
	import { OverflowDemo } from '$lib/components/demos'
	import { ViewExampleCode } from '$lib/components'
</script>

<OverflowDemo />

<ViewExampleCode href="https://github.com/svecosystem/paneforge/blob/main/sites/docs/src/lib/components/demos/overflow-demo.svelte" />

## Anatomy

Here's the high-level structure of the example above:

```svelte
<script lang="ts">
	import { PaneGroup, Pane, PaneResizer } from "paneforge";
</script>

<PaneGroup direction="horizontal">
	<Pane defaultSize={50}>
		<div class="overflow-auto">
			<!-- ... content here-->
		</div>
	</Pane>
	<PaneResizer />
	<Pane defaultSize={50}>
		<PaneGroup direction="vertical">
			<Pane defaultSize={25}>
				<div class="overflow-auto">
					<!-- ... content here-->
				</div>
			</Pane>
			<PaneResizer />
			<Pane defaultSize={75}>
				<div class="overflow-auto">
					<!-- ... content here-->
				</div>
			</Pane>
		</PaneGroup>
	</Pane>
</PaneGroup>
```
