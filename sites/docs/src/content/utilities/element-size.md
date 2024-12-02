---
title: ElementSize
description: Track element dimensions reactively
category: Elements
---

<script>
	import Demo from '$lib/components/demos/element-size.svelte';
</script>

`ElementSize` provides reactive access to an element's width and height, automatically updating when
the element's dimensions change. Similar to `ElementRect` but focused only on size measurements.

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { ElementSize } from "runed";

	let el = $state() as HTMLElement;
	const size = new ElementSize(() => el);
</script>

<textarea bind:this={el}></textarea>

<p>Width: {size.width} Height: {size.height}</p>
```

## Type Definition

```ts
interface ElementSize {
	readonly width: number;
	readonly height: number;
}
```
