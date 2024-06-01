---
title: useResizeObserver
description: Detects changes in the size of an element
category: Browser
---

<script>
import Demo from '$lib/components/demos/use-resize-observer.svelte';
</script>

## Demo

<Demo />

## Usage

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
