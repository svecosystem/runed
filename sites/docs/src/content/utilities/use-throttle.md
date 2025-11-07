---
title: useThrottle
description: A higher-order function that throttles the execution of a function.
category: Utilities
---

<script>
 import Demo from '$lib/components/demos/use-throttle.svelte';
</script>

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { useThrottle } from "runed";

	let search = $state("");
	let throttledSearch = $state("");
	let durationMs = $state(1000);

	const throttledUpdate = useThrottle(
		() => {
			throttledSearch = search;
		},
		() => durationMs
	);
</script>

<div>
	<input
		bind:value={
			() => search,
			(v) => {
				search = v;
				throttledUpdate();
			}
		} />
	<p>You searched for: <b>{throttledSearch}</b></p>
</div>
```
