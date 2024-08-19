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

	import { Label } from "../ui/label";
	import DemoContainer from "$lib/components/demo-container.svelte";
	import Input from "$lib/components/ui/input/input.svelte";

	let search = $state("");
	let throttledSearch = $state("");
	let durationMs = $state(1000);

	const throttledUpdate = useThrottle(
		() => {
			throttledSearch = search;
		},
		() => durationMs
	);

	$effect(() => {
		search;
		throttledUpdate();
	});
</script>

<div>
	<input bind:value={search} />
	<p>You searched for: <b>{throttledSearch}</b></p>
</div>
```
