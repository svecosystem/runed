---
title: Debounced
description: A wrapper over `useDebounce` that returns a debounced state.
category: State
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

You may cancel the pending update, run it immediately, or set a new value. Setting a new value
immediately also cancels any pending updates.

```ts
let count = $state(0);
const debounced = new Debounced(() => count, 500);
count = 1;
debounced.cancel();
// after a while...
console.log(debounced.current); // Still 0!

count = 2;
console.log(debounced.current); // Still 0!
debounced.setImmediately(count);
console.log(debounced.current); // 2

count = 3;
console.log(debounced.current); // 2
await debounced.updateImmediately();
console.log(debounced.current); // 3
```
