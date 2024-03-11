---
title: Vertical Groups
description: An example of a vertical group of panes.
---

<script>
	import { VerticalDemo } from '$lib/components/demos'
	import { ViewExampleCode } from '$lib/components'
</script>

<VerticalDemo />

<ViewExampleCode href="https://github.com/svecosystem/withrunes/blob/main/sites/docs/src/lib/components/demos/vertical-demo.svelte" />

## Anatomy

Here's the high-level structure of the example above:

```svelte
<script lang="ts">
	import { PaneGroup, Pane, PaneResizer } from "withrunes";
</script>

<PaneGroup direction="vertical">
	<Pane defaultSize={50} />
	<PaneResizer />
	<Pane defaultSize={50} />
</PaneGroup>
```
