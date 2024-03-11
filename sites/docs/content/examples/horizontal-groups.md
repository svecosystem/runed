---
title: Horizontal Groups
description: An example of a horizontal group of panes.
---

<script>
	import { HorizontalDemo } from '$lib/components/demos'
	import { ViewExampleCode } from '$lib/components'
</script>

<HorizontalDemo />

<ViewExampleCode href="https://github.com/svecosystem/withrunes/blob/main/sites/docs/src/lib/components/demos/horizontal-demo.svelte" />

## Anatomy

Here's the high-level structure of the example above:

```svelte
<script lang="ts">
	import { PaneGroup, Pane, PaneResizer } from "withrunes";
</script>

<PaneGroup direction="horizontal">
	<Pane defaultSize={50} />
	<PaneResizer />
	<Pane defaultSize={50} />
</PaneGroup>
```
