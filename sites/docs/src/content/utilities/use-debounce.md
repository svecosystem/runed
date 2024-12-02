---
title: useDebounce
description: A higher-order function that debounces the execution of a function.
category: Utilities
---

<script>
	import Demo from '$lib/components/demos/use-debounce.svelte';
</script>

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { useDebounce } from "runed";

	let count = $state(0);
	let logged = $state("");
	let isFirstTime = $state(true);
	let debounceDuration = $state(1000);

	const logCount = useDebounce(
		() => {
			if (isFirstTime) {
				isFirstTime = false;
				logged = `You pressed the button ${count} times!`;
			} else {
				logged = `You pressed the button ${count} times since last time!`;
			}
			count = 0;
		},
		() => debounceDuration
	);

	function ding() {
		count++;
		logCount();
	}
</script>

<input type="number" bind:value={debounceDuration} />
<button onclick={ding}>DING DING DING</button>
<button onclick={logCount.cancel} disabled={!logCount.pending}>Cancel message</button>
<p>{logged || "Press the button!"}</p>
```
