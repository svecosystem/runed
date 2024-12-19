---
title: useResizeObserver
description: Detects changes in the size of an element
category: Elements
---

<script>
import Demo from '$lib/components/demos/use-resize-observer.svelte';
</script>

## Demo

<Demo />

## Usage

With a reference to an element, you can use the `useResizeObserver` utility to detect changes in the
size of an element.

```svelte
<script lang="ts">
	import { useResizeObserver } from "runed";

	let el = $state<HTMLElement | null>(null);
	let text = $state("");

	useResizeObserver(
		() => el,
		(entries) => {
			const entry = entries[0];
			if (!entry) return;

			const { width, height } = entry.contentRect;
			text = `width: ${width};\nheight: ${height};`;
		}
	);
</script>

<textarea bind:this={el} readonly value={text}></textarea>
```

You can stop the resize observer at any point by calling the `stop` method.

```ts
const { stop } = useResizeObserver(/* ... */);
stop();
```
