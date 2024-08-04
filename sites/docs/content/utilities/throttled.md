---
title: Throttled
description: A wrapper over `useThrottle` that returns a throttled state.
category: State
---

<script>
import Demo from '$lib/components/demos/throttled.svelte';
</script>

## Demo

<Demo />

## Usage

This is a simple wrapper over [`useThrottle`](https://runed.dev/docs/utilities/use-throttle) that
returns a throttled state.

```svelte
<script lang="ts">
	import { Throttled } from "runed";

	let search = $state("");
	const throttled = new Throttled(() => search, 500);
</script>

<div>
	<input bind:value={search} />
	<p>You searched for: <b>{throttled.current}</b></p>
</div>
```

You may cancel the pending update, or set a new value immediately. Setting immediately also cancels
any pending updates.

```ts
let count = $state(0);
const throttled = new Throttled(() => count, 500);
count = 1;
throttled.cancel();
// after a while...
console.log(throttled.current); // Still 0!

count = 2;
console.log(throttled.current); // Still 0!
throttled.setImmediately(count);
console.log(throttled.current); // 2
```
