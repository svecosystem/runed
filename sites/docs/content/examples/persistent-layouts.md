---
title: Persistent Layouts
description: Examples of persisting layouts across page loads.
---

<script>
	import { StorageDemo, CookieDemo } from '$lib/components/demos'
	import { ViewExampleCode } from '$lib/components'
	export let data;
</script>

## Local Storage

The `PaneGroup` component has an `autoSaveId` prop that can be used to uniquely identify the layout of the panes within the group. When provided, the layout of the panes will be saved to local storage and restored when the page is reloaded.

<StorageDemo />

<ViewExampleCode href="https://github.com/svecosystem/paneforge/blob/main/sites/docs/src/lib/components/demos/storage-demo.svelte" />

### Anatomy

Here's the high-level structure of the example above:

```svelte title="+page.svelte"
<script lang="ts">
	import { PaneGroup, Pane, PaneResizer } from "paneforge";
</script>

<PaneGroup direction="horizontal" autoSaveId="someGroupId">
	<Pane defaultSize={50} />
	<PaneResizer />
	<Pane defaultSize={50} />
</PaneGroup>
```

## Cookies (SSR-friendly)

Local storage is not available on the server, so you can use cookies to persist the layout of the panes across page loads, ensuring no layout flicker when the page is first loaded.

<CookieDemo layout={data.layout} />

<ViewExampleCode href="https://github.com/svecosystem/paneforge/blob/main/sites/docs/src/lib/components/demos/cookie-demo.svelte" />

### Anatomy

Here's the high-level structure of the example above:

```ts title="+page.server.ts"
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	let layout = event.cookies.get("PaneForge:layout");
	if (layout) {
		layout = JSON.parse(layout);
	}

	return {
		layout,
	};
};
```

```svelte
<script lang="ts">
	import { PaneGroup, Pane, PaneResizer } from "paneforge";

	export let layout: number[] | undefined = undefined;
	function onLayoutChange(sizes: number[]) {
		document.cookie = `PaneForge:layout=${JSON.stringify(sizes)}`;
	}
</script>

<PaneGroup direction="horizontal" {onLayoutChange}>
	<Pane defaultSize={layout ? layout[0] : 50} />
	<PaneResizer />
	<Pane defaultSize={layout ? layout[1] : 50} />
</PaneGroup>
```
