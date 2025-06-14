---
title: Previous
description: A utility that tracks and provides access to the previous value of a reactive getter.
category: State
---

<script>
import Demo from '$lib/components/demos/previous.svelte';
</script>

The `Previous` utility creates a reactive wrapper that maintains the previous value of a getter
function. This is particularly useful when you need to compare state changes or implement transition
effects.

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

## Type Definition

```ts
class Previous<T> {
	constructor(getter: () => T);

	readonly current: T | undefined; // Previous value
}
```
