---
title: activeElement
description: Track and access the currently focused DOM element
category: Elements
---

<script>
import Demo from '$lib/components/demos/active-element.svelte';
</script>

`activeElement` provides reactive access to the currently focused DOM element in your application,
similar to `document.activeElement` but with reactive updates.

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { activeElement } from "runed";
</script>

<p>
	Currently active element:
	{activeElement.current?.localName ?? "No active element found"}
</p>
```

## Notes

- Updates synchronously with DOM focus changes
- Returns `null` when no element is focused
- Safe to use with SSR (Server-Side Rendering)
- Lightweight alternative to manual focus tracking

## Type Definition

```ts
interface ActiveElement {
	readonly current: Element | null;
}
```
