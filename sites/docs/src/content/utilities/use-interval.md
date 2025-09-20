---
title: useInterval
description: A wrapper for setInterval with controls for pausing and resuming.
category: Utilities
---

<script>
	import Demo from '$lib/components/demos/use-interval.svelte';
</script>

`useInterval` is a utility function that provides a reactive wrapper around `setInterval` with
controls for pausing and resuming the execution.

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { useInterval } from "runed";

	let count = $state(0);
	let intervalDelay = $state(1000);

	const interval = useInterval(
		() => count++,
		() => intervalDelay
	);
</script>

<p>Count: {count}</p>
<p>Interval delay: {intervalDelay}ms</p>
<p>Status: {isActive ? "Running" : "Paused"}</p>

<input type="number" bind:value={intervalDelay} min="100" step="100" />

<button onclick={interval.pause} disabled={!interval.isActive}>Pause</button>
<button onclick={interval.resume} disabled={interval.isActive}>Resume</button>
```

## Options

The `useInterval` function accepts an optional third parameter with the following options:

- `immediate` (default: `true`) - Whether to start the interval immediately
- `immediateCallback` (default: `false`) - Whether to execute the callback immediately when resuming

```svelte
<script lang="ts">
	import { useInterval } from "runed";

	let count = $state(0);

	const interval = useInterval(() => count++, 1000, {
		immediate: false, // Don't start automatically
		immediateCallback: true // Execute callback immediately on resume
	});
</script>
```

## Reactive Interval

The interval delay can be reactive, and the timer will automatically restart with the new interval
when it changes:

```svelte
<script lang="ts">
	import { useInterval } from "runed";

	let count = $state(0);
	let speed = $state(1000);

	// The interval will update reactively when speed changes
	const interval = useInterval(
		() => count++,
		() => speed
	);
</script>
```
