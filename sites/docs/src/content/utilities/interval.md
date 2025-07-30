---
title: Interval
description:
  A reactive counter that increases on every interval with controls for pausing and resuming.
category: Utilities
---

<script>
	import Demo from '$lib/components/demos/interval.svelte';
</script>

`Interval` is a class that provides a reactive counter that increases on every interval, similar to
VueUse's `useInterval`. It offers controls for pausing, resuming, and resetting the counter.

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { Interval } from "runed";

	const interval = new Interval(1000);
</script>

<p>Counter: {interval.counter}</p>
<p>Status: {interval.isActive ? "Running" : "Paused"}</p>

<button onclick={() => interval.pause()} disabled={!interval.isActive}>Pause</button>
<button onclick={() => interval.resume()} disabled={interval.isActive}>Resume</button>
<button onclick={() => interval.reset()}>Reset</button>
```

## With Callback

You can provide a callback that will be executed on every interval tick:

```svelte
<script lang="ts">
	import { Interval } from "runed";

	let message = $state("");

	const interval = new Interval(1000, {
		callback: (count) => {
			message = `Tick ${count}`;
		}
	});
</script>

<p>Counter: {interval.counter}</p><p>Message: {message}</p>
```

## Options

The `Interval` constructor accepts an optional second parameter with the following options:

- `immediate` (default: `true`) - Whether to start the interval immediately
- `callback` - A function that will be called on every interval tick with the current counter value

```svelte
<script lang="ts">
	import { Interval } from "runed";

	const interval = new Interval(1000, {
		immediate: false, // Don't start automatically
		callback: (count) => console.log(`Count: ${count}`)
	});
</script>
```

## Reactive Interval

The interval delay can be reactive using a getter function:

```svelte
<script lang="ts">
	import { Interval } from "runed";

	let speed = $state(1000);

	// The interval will update reactively when speed changes
	const interval = new Interval(() => speed);
</script>

<input type="number" bind:value={speed} min="100" step="100" /><p>Counter: {interval.counter}</p>
```

## Properties

- `counter` - The current counter value (readonly)
- `isActive` - Whether the interval is currently running (readonly)

## Methods

- `pause()` - Pause the interval
- `resume()` - Resume the interval
- `reset()` - Reset the counter to 0
