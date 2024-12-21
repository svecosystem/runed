---
title: onClickOutside
description: Handle clicks outside of a specified element.
category: Sensors
---

<script>
import Demo from '$lib/components/demos/on-click-outside.svelte';
</script>

`onClickOutside` detects clicks that occur outside a specified element's boundaries and executes a
callback function. It's commonly used for dismissible dropdowns, modals, and other interactive
components.

## Demo

<Demo />

## Basic Usage

```svelte
<script lang="ts">
	import { onClickOutside } from "runed";

	let container = $state<HTMLElement>()!;

	onClickOutside(
		() => container,
		() => console.log("clicked outside")
	);
</script>

<div bind:this={el}>
	<!-- Container content -->
</div>
<button>I'm outside the container</button>
```

## Advanced Usage

### Controlled Listener

The function returns control methods to programmatically manage the listener, `start` and `stop`:

```svelte
<script lang="ts">
	import { onClickOutside } from "runed";

	let container = $state<HTMLElement>();

	const clickOutside = onClickOutside(
		() => container,
		() => console.log("Clicked outside")
	);
</script>

<div>
	<button on:click={clickOutside.stop}>Disable</button>
	<button on:click={clickOutside.start}>Enable</button>
</div>

<div bind:this={container}>
	<!-- Content -->
</div>
```
