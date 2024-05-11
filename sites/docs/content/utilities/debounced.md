---
title: Debounced
description: A wrapper over `useDebounce` that returns a debounced state.
category: New
---

<script>
import Demo from '$lib/components/demos/debounced.svelte';
</script>

## Demo

<Demo />

## Usage

This is a simple wrapper over [`useDebounce`](https://runed.dev/docs/utilities/use-debounce) that
returns a debounced state.

```svelte
<script lang="ts">
	import { Debounced } from "runed";

	let search = $state("");
	const debounced = new Debounced(() => search, 500);
</script>

<div>
	<input bind:value={search} />
	<p>You searched for: <b>{debounced.current}</b></p>
</div>
```
