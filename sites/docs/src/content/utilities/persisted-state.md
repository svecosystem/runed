---
title: PersistedState
description:
  A reactive state manager that persists and synchronizes state across browser sessions and tabs
  using Web Storage APIs.
category: State
---

<script>
import Demo from '$lib/components/demos/persisted-state.svelte';
import { Callout } from '@svecodocs/kit'
</script>

`PersistedState` provides a reactive state container that automatically persists data to browser
storage and optionally synchronizes changes across browser tabs in real-time.

## Demo

<Demo />
<Callout>
	You can refresh this page and/or open it in another tab to see the count state being persisted
	and synchronized across sessions and tabs.
</Callout>

## Usage

Initialize `PersistedState` by providing a unique key and an initial value for the state.

```svelte
<script lang="ts">
	import { PersistedState } from "runed";

	const count = new PersistedState("count", 0);
</script>

<div>
	<button onclick={() => count.current++}>Increment</button>
	<button onclick={() => count.current--}>Decrement</button>
	<button onclick={() => (count.current = 0)}>Reset</button>
	<p>Count: {count.current}</p>
</div>
```

### Complex objects

When persisting complex objects, only plain structures are deeply reactive.

This includes arrays, plain objects, and primitive values.

For example:

```ts
const persistedArray = new PersistedState("foo", ["a", "b"]);
persistedArray.current.push("c"); // This will persist the change

const persistedObject = new PersistedState("bar", { name: "Bob" });
persistedObject.current.name = "JG"; // This will persist the change

class Person {
	name: string;
	constructor(name: string) {
		this.name = name;
	}
}
const persistedComplexObject = new PersistedState("baz", new Person("Bob"));
persistedComplexObject.current.name = "JG"; // This will NOT persist the change
persistedComplexObject.current = new Person("JG"); // This will persist the change
```

## Configuration Options

`PersistedState` includes an `options` object that allows you to customize the behavior of the state
manager.

```ts
const state = new PersistedState("user-preferences", initialValue, {
	// Use sessionStorage instead of localStorage (default: 'local')
	storage: "session",

	// Disable cross-tab synchronization (default: true)
	syncTabs: false,

	// Custom serialization handlers
	serializer: {
		serialize: superjson.stringify,
		deserialize: superjson.parse
	}
});
```

### Storage Options

- `'local'`: Data persists until explicitly cleared
- `'session'`: Data persists until the browser session ends

### Cross-Tab Synchronization

When `syncTabs` is enabled (default), changes are automatically synchronized across all browser tabs
using the storage event.

### Custom Serialization

Provide custom `serialize` and `deserialize` functions to handle complex data types:

```ts
import superjson from "superjson";

// Example with Date objects
const lastAccessed = new PersistedState("last-accessed", new Date(), {
	serializer: {
		serialize: superjson.stringify,
		deserialize: superjson.parse
	}
});
```
