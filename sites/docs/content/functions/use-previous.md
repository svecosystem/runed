---
title: usePrevious
description: Holds the previous value of a box or getter.
category: State
---

<script>
import Demo from '$lib/components/demos/use-previous.svelte';
</script>

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { usePrevious } from "runed";

	let count = $state(0);
	const previous = usePrevious(() => count);
</script>

<button onclick={() => count++}>Count: {count}</button>

<pre>Previous: {`${previous.value}`}</pre>
```
