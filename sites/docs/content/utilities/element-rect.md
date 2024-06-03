---
title: ElementRect
description: A function that returns the size of an element.
category: Elements
---

<script>
	import Demo from '$lib/components/demos/element-rect.svelte';
</script>

## Demo

<Demo />

## Usage

With a reference to an element, you can use the `ElementRect` utility to get the bounding rectangle
of the element.

```svelte
<script lang="ts">
	import { ElementRect } from "runed";

	let el = $state() as HTMLElement;
	const rect = new ElementRect(() => el);
</script>

<textarea bind:this={el}></textarea>

<p>Width: {rect.width} Height: {rect.height}</p>
<!-- alternatively -->
<pre>{JSON.stringify(rect.current, null, 2)}</pre>
```
