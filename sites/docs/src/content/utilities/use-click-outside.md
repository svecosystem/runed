---
title: useClickOutside
description:
  A function that calls a callback when a click event is triggered outside of a given container
  element.
category: Browser
---

<script>
import Demo from '$lib/components/demos/use-click-outside.svelte';
</script>

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { useClickOutside } from "runed";

	let el = $state<HTMLDivElement | undefined>(undefined);

	useClickOutside(
		() => el,
		() => {
			console.log("clicked outside of container");
		}
	);
</script>

<main>
	<div bind:this={el}>Container</div>
	<button>Click Me</button>
</main>
```

You can also programmatically pause and resume `useClickOutside` using the `start` and `stop`
functiosn returned by `useClickOutside`.

```svelte
<script lang="ts">
	import { useClickOutside } from "runed";

	let el = $state<HTMLDivElement | undefined>(undefined);

	const outsideClick = useClickOutside(
		() => el,
		() => {
			console.log("clicked outside of container");
		}
	);
</script>

<main>
	<button onclick={outsideClick.stop}>Stop listening for outside clicks</button>
	<button onclick={outsideClick.start}>Start listening again</button>
	<div bind:this={el}></div>
</main>
```
