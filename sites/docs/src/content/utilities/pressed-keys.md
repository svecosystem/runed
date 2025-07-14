---
title: PressedKeys
description: Tracks which keys are currently pressed
category: Sensors
---

<script>
import Demo from '$lib/components/demos/pressed-keys.svelte';
</script>

## Demo

<Demo />

## Usage

With an instance of `PressedKeys`, you can use the `has` method.

```ts
const keys = new PressedKeys();

const isArrowDownPressed = $derived(keys.has("ArrowDown"));
const isCtrlAPressed = $derived(keys.has("Control", "a"));
```

`has` uses **exact matching** - it only returns `true` when exactly the specified keys are pressed:

```ts
const keys = new PressedKeys();

// If only 'k' is pressed:
keys.has("k"); // true
keys.has("k", "meta"); // false

// If 'meta' + 'k' are pressed:
keys.has("k"); // false (exact match requires only 'k')
keys.has("k", "meta"); // true
```

If you need to check whether a specific key is pressed regardless of modifiers, use the `all` property:

```ts
// If 'meta' + 'k' are pressed:
keys.all.includes("k"); // true
keys.all.includes("meta"); // true
```

### Getting All Pressed Keys

Get all of the currently pressed keys:

```ts
const keys = new PressedKeys();
console.log(keys.all);
```

### Monitoring Key Combinations

Register a callback to execute when specified key combination is pressed:

```ts
const keys = new PressedKeys();
// Triggers only when exactly meta+k are pressed
keys.onKeys(["meta", "k"], () => {
	console.log("open command palette");
});

// Triggers only when 'k' is pressed alone
keys.onKeys("k", () => {
	console.log("k pressed without modifiers");
});
```
