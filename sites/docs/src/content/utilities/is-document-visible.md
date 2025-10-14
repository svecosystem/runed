---
title: IsDocumentVisible
description: Track whether the current document is visible using the Page Visibility API.
category: Sensors
---

<script>
import Demo from '$lib/components/demos/is-document-visible.svelte';
</script>

`IsDocumentVisible` provides a reactive boolean that reflects the current document visibility state.
It listens to the `visibilitychange` event and updates automatically.

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { IsDocumentVisible } from "runed";

	const visible = new IsDocumentVisible();
</script>

<p>Document visible: {visible.current ? "Yes" : "No"}</p>
```

## Type Definition

```ts
type IsDocumentVisibleOptions = {
	window?: Window;
	document?: Document;
};

class IsDocumentVisible {
	constructor(options?: IsDocumentVisibleOptions);
	readonly current: boolean; // true when document is visible, false when hidden
}
```

## Notes

- Uses the Page Visibility API via `document.hidden` and `visibilitychange`.
- In non-browser contexts, `current` defaults to `false`.
