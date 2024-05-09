---
title: useStore
description: Convert a legacy svelte store into rune-powered boxed state.
category: Utilities
---

<script>
import Demo from '$lib/components/demos/use-store.svelte';
</script>

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { useStore } from "runed";
	import { writable } from "svelte/store";

	const store = writable(0);
	const boxed = useStore(store);
</script>

<div>
	<p>Rune: {boxed.value}</p>
	<button onclick={() => boxed.value++}>Increment via boxed</button>
	<p>Store: {$store}</p>
	<button onclick={() => ($store = $store + 1)}>Increment via store</button>
</div>
```
