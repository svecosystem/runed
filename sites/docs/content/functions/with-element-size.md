---
title: WithElementSize
description: A higher-order function that debounces the execution of a function.
---

<script>
import { WithElementSizeDemo } from '$lib/components/demos';
</script>

## Demo

<WithElementSizeDemo />

## Usage

```svelte
<script lang="ts">
	<script lang="ts">
	import { withElementSize } from "runed";

	let el: HTMLElement | undefined = $state(undefined);
	const size = withElementSize(() => el);
</script>

<div>
	<textarea bind:this={el} />
	<p>Width: {size.width} Height: {size.height}</p>
</div>
```
