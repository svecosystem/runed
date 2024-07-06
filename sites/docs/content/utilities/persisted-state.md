---
title: PersistedState
description:
  Create reactive state that is persisted and synchronized across browser sessions and tabs using
  Web Storage.
category: State
---

<script>
import Demo from '$lib/components/demos/persisted-state.svelte';
</script>

## Demo

<Demo />

## Usage

`PersistedState` allows for syncing and persisting state across browser sessions using
`localStorage` or `sessionStorage`. Initialize `PersistedState` by providing a unique key and an
initial value for the state.

```svelte
<script lang="ts">
	import { PersistedState } from "runed";

	const count = new PersistedState("count", 0);
</script>

<div>
	<p>Count: {count.current}</p>
	<button onclick={() => count.current++}>Increment</button>
</div>
```

`PersistedState` also includes an `options` object.

```ts
{
	storage: 'session', // Specifies whether to use local or session storage. Default is 'local'.
	syncTabs: false,   // Indicates if changes should sync across tabs. Default is true.
	serializer: {
		serialize: superjson.serialize,   // Custom serialization function. Default is JSON.stringify.
		deserialize: superjson.parse      // Custom deserialization function. Default is JSON.parse.
	}
}
```
