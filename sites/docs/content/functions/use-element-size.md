---
title: useElementSize
description: A higher-order function that debounces the execution of a function.
---

<script>
	import { UseElementSizeDemo } from '$lib/components/demos';
</script>

## Demo

<UseElementSizeDemo />

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
