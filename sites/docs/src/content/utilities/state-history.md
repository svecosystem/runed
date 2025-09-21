---
title: StateHistory
description: Track state changes with undo/redo capabilities
category: State
---

<script>
import Demo from '$lib/components/demos/state-history.svelte';
</script>

## Demo

<Demo />

## Usage

`StateHistory` tracks a getter's return value, logging each change into an array. A setter is also
required to use the `undo` and `redo` functions.

<!-- prettier-ignore -->
```ts
import { StateHistory } from "runed";

let count = $state(0);
const history = new StateHistory(() => count, (c) => (count = c));
history.log[0]; // { snapshot: 0, timestamp: ... }
```

Besides `log`, the returned object contains `undo`, `redo`, and `clear` functionality.

<!-- prettier-ignore -->
```svelte
<script lang="ts">
	import { StateHistory } from "runed";

	let count = $state(0);
	const history = new StateHistory(() => count, (c) => (count = c));
</script>

<p>{count}</p>

<button onclick={() => count++}>Increment</button>
<button onclick={() => count--}>Decrement</button>

<button disabled={!history.canUndo} onclick={history.undo}>Undo</button>
<button disabled={!history.canRedo} onclick={history.redo}>Redo</button>
<button onclick={history.clear}>Clear History</button>
```

## Methods

### `undo()`

Reverts the state to the previous value in the history log. The current state is moved to the redo
stack.

<!-- prettier-ignore -->
```ts
let count = $state(0);
const history = new StateHistory(() => count, (c) => (count = c));

count = 1;
count = 2;

history.undo(); // count is now 1
history.undo(); // count is now 0
```

### `redo()`

Restores a previously undone state. Moves the next state from the redo stack back to the history
log.

<!-- prettier-ignore -->
```ts
let count = $state(0);
const history = new StateHistory(() => count, (c) => (count = c));

count = 1;
count = 2;

history.undo(); // count is now 1
history.redo();  // count is now 2
```

### `clear()`

Clears the entire history log and redo stack, effectively resetting the state history.

<!-- prettier-ignore -->
```ts
history.clear();
console.log(history.log); // []
console.log(history.canUndo); // false
console.log(history.canRedo); // false
```

## Properties

### `log`

An array of `LogEvent<T>` objects containing the state history. Each event has a `snapshot` of the
state and a `timestamp`.

### `canUndo`

A derived boolean indicating whether undo is possible (true when there's more than one item in the
log).

### `canRedo`

A derived boolean indicating whether redo is possible (true when the redo stack is not empty).
