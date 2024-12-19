---
title: useDebounce
description: A higher-order function that debounces the execution of a function.
category: Utilities
---

<script>
	import Demo from '$lib/components/demos/use-debounce.svelte';
</script>

`useDebounce` is a utility function that creates a debounced version of a callback function.
Debouncing prevents a function from being called too frequently by delaying its execution until
after a specified duration of inactivity.

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
<button onclick={logCount.runScheduledNow} disabled={!logCount.pending}>Run now</button>
<button onclick={logCount.cancel} disabled={!logCount.pending}>Cancel message</button>
<p>{logged || "Press the button!"}</p>
```
