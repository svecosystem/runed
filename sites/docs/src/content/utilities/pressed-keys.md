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

Or get all of the currently pressed keys:

```ts
const keys = new PressedKeys();
console.log(keys.all);
```

Or register a callback to execute when specified key combination is pressed:

```ts
const keys = new PressedKeys();
keys.onKeys(["meta", "k"], () => {
	console.log("open command palette");
});
```
