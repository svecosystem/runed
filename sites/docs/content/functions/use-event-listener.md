---
title: useEventListener
description: A function that attaches an automatically disposed event listener.
---

<script>
import { UseEventListenerDemo } from '$lib/components/demos';
</script>

## Demo

<UseEventListenerDemo />

## Usage

```svelte
<script lang="ts">
	import { useEventListener } from "runed";

	let count = $state(0);
	function increment() {
		count++;
	}

	let wrapper = $state<HTMLElement>();
	useEventListener(() => wrapper, "click", increment);
</script>

<div bind:this={wrapper}>
	<p>You've clicked {count} {count === 1 ? "time" : "times"}</p>
</div>
```
