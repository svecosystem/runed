---
title: LazyState
description: A stateful object that is lazily initialized.
category: State
---

<script>
import Demo from '$lib/components/demos/lazy-state.svelte';
</script>

The `LazyState` utility creates a reactive value that is only initialized when it is first accessed.

This is useful for deferring expensive initializations until they're actually needed.

## Demo

This is a demo of a large tree whose children are lazily initialized. Check the console for
initialization logs.

<Demo />

## Usage

```ts
import { LazyState } from "runed";

const expensiveValue = new LazyState(() => performExpensiveComputation());
expensiveValue.initialized === false;

// Accessing the `current` property for the first time initializes it
// with the result of the `performExpensiveComputation` function.
expensiveValue.current;
expensiveValue.initialized === true;

// Accessing the `current` property again does not call the function.
expensiveValue.current;
```

## Type Definition

```ts
class LazyState<T> {
	constructor(factory: () => T);

	get current(): T;

	set current(value: T);

	get initialized(): boolean;
}
```
