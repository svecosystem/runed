---
title: useInterval
description: A wrapper for setInterval with controls for pausing, resuming, and tracking ticks.
category: Utilities
---

<script>
	import Demo from '$lib/components/demos/use-interval.svelte';
</script>

`useInterval` is a utility function that provides a reactive wrapper around `setInterval` with
controls for pausing and resuming the execution, as well as a built-in counter for tracking ticks.

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { useInterval } from "runed";

	let delay = $state(1000);

	const interval = useInterval(() => delay, {
		callback: (count) => {
			console.log(`Tick ${count}`);
		}
	});
</script>

<p>Counter: {interval.counter}</p>
<p>Interval delay: {delay}ms</p>
<p>Status: {interval.isActive ? "Running" : "Paused"}</p>

<input type="number" bind:value={delay} min="100" step="100" />

<button onclick={interval.pause} disabled={!interval.isActive}>Pause</button>
<button onclick={interval.resume} disabled={interval.isActive}>Resume</button>
<button onclick={interval.reset}>Reset Counter</button>
```

## Counter

`useInterval` includes a built-in `counter` property that tracks the number of times the interval
has ticked:

```svelte
<script lang="ts">
	import { useInterval } from "runed";

	const interval = useInterval(1000);
</script>

<p>Ticks: {interval.counter}</p>
<button onclick={interval.reset}>Reset</button>
```

## Callback

You can provide an optional callback that will be called on each tick with the current counter
value:

```svelte
<script lang="ts">
	import { useInterval } from "runed";

	const interval = useInterval(1000, {
		callback: (count) => {
			console.log(`Tick number ${count}`);
		}
	});
</script>
```

## Options

The `useInterval` function accepts an optional second parameter with the following options:

- `immediate` (default: `true`) - Whether to start the interval immediately
- `immediateCallback` (default: `false`) - Whether to execute the callback immediately when resuming
- `callback` - Optional callback function that receives the current counter value on each tick

```svelte
<script lang="ts">
	import { useInterval } from "runed";

	const interval = useInterval(1000, {
		immediate: false,
		immediateCallback: true,
		callback: (count) => console.log(count)
	});
</script>
```

## Reactive Interval

The interval delay can be reactive, and the timer will automatically restart with the new interval
when it changes:

```svelte
<script lang="ts">
	import { useInterval } from "runed";

	let delay = $state(1000);

	const interval = useInterval(() => delay);
</script>

<input type="range" bind:value={delay} min="100" max="2000" /><p>Delay: {delay}ms</p>
```
