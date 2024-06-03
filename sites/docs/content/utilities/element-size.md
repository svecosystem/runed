---
title: ElementSize
description: A function that returns the size of an element.
category: Elements
---

<script>
	import Demo from '$lib/components/demos/element-size.svelte';
</script>

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { ElementSize } from "runed";

	let el = $state() as HTMLElement;
	const size = new ElementSize(() => el);
</script>

<textarea bind:this={el}></textarea>

<p>Width: {size.width} Height: {size.height}</p>
```
