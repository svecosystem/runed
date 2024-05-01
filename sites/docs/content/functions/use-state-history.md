---
title: useStateHistory
description: Track the change history of a ref, also provides undo and redo functionality
category: State
---

<script>
import Demo from '$lib/components/demos/use-state-history.svelte';
</script>

## Demo

<Demo />

## Usage

`useStateHistory` tracks a [`box's`](/docs/functions/box) value, logging each change into an array.

```ts
import { box, useStateHistory } from "runed";

let count = box(0);
const history = useStateHistory(count);
history.log[0] // { snapshot: 0, timestamp: ... }
```

You can also use `box.with` to track existing $state.

```ts
import { box, useStateHistory } from "runed";

let count = $state(0);
const history = useStateHistory(box.with(() => count, (c) => count = c));
```

Besides `log`, the returned object contains `undo` and `redo` functionality.

```svelte
<script lang="ts">
	import { box, useStateHistory } from "runed";

	let count = box(0);
	const history = useStateHistory(count);

	function format(ts: number) {
		return new Date(ts).toLocaleString();
	}
</script>

<div>
	<p>{count.value}</p>

	<button onclick={() => count.value++}>Increment</button>
	<button onclick={() => count.value--}>Decrement</button>

	<button disabled={!history.canUndo} onclick={history.undo}>Undo</button>
	<button disabled={!history.canRedo} onclick={history.redo}>Redo</button>
</div>
```
