---
title: onCleanup
description:
  Register a cleanup function that will be called when the current effect context is disposed
category: Utilities
---

`onCleanup` allows you to register a cleanup function that will be called when the current effect
context is disposed. This happens when a component is destroyed or when a root effect is disposed.

This utility is a short hand for the following:

```ts
$effect(() => {
	return () => {
		// cleanup
	};
});
```

## Usage

```svelte
<script lang="ts">
	import { onCleanup } from "runed";

	// can act as a replacement for `onDestroy`
	onCleanup(() => {
		console.log("Component is being cleaned up!");
	});

	// can be used within a root effect to call a cleanup function when the root effect is disposed
	$effect.root(() => {
		onCleanup(() => {
			console.log("Root effect is being cleaned up!");
		});
	});
</script>
```

## Type Definition

```ts
function onCleanup(cb: () => void): void;
```
