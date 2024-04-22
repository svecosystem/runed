---
title: UseEventListener
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

	useEventListener(() => document, "click", increment);
</script>

<p>You've clicked {count} {count === 1 ? "Time" : "Times"}</p>
```
