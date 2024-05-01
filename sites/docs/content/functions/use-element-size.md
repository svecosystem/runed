---
title: useElementSize
description: A function that returns the size of an element.
category: Elements
---

<script>
	import Demo from '$lib/components/demos/use-element-size.svelte';
</script>

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { useElementSize } from "runed";

	let el = $state() as HTMLElement;
	const size = useElementSize(() => el);
</script>

<div>
	<textarea bind:this={el} />
	<p>Width: {size.width} Height: {size.height}</p>
</div>
```
