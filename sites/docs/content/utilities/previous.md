---
title: Previous
description: Holds the previous value of a getter.
category: State
---

<script>
import Demo from '$lib/components/demos/previous.svelte';
</script>

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { Previous } from "runed";

	let count = $state(0);
	const previous = new Previous(() => count);
</script>

<div>
	<button onclick={() => count++}>Count: {count}</button>
	<pre>Previous: {`${previous.current}`}</pre>
</div>
```
