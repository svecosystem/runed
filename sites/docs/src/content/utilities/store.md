---
title: Store
description: Convert a legacy svelte store into rune-powered runeStore state.
category: Utilities
---

<script>
import Demo from '$lib/components/demos/store.svelte';
</script>

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { Store } from "runed";
	import { writable } from "svelte/store";

	const store = writable(0);
	const runeStore = new Store(store);
</script>

<div>
	<p>Rune: {runeStore.current}</p>
	<button onclick={() => runeStore.current++}>Increment via runeStore</button>
	<p>Store: {$store}</p>
	<button onclick={() => ($store = $store + 1)}>Increment via store</button>
</div>
```
