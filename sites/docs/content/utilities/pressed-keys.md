---
title: PressedKeys
description: Tracks which keys are currently pressed
category: Browser
---

<script>
import Demo from '$lib/components/demos/pressed-keys.svelte';
</script>

## Demo

<Demo />

## Usage

With an instance of `PressedKeys`, you can use the `pressed` method.

```ts
const keys = new PressedKeys();

const isArrowDownPressed = $derived(keys.pressed("ArrowDown"));
const isCtrlAPressed = $derived(keys.pressed("Control", "a"));
```

Or get all of the currently pressed keys:

```ts
const pressedKeys = keys.pressed();
console.log(pressedKeys.all);
```
