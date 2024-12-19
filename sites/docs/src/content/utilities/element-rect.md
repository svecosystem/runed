---
title: ElementRect
description: Track element dimensions and position reactively
category: Elements
---

<script>
	import Demo from '$lib/components/demos/element-rect.svelte';
</script>

`ElementRect` provides reactive access to an element's dimensions and position information,
automatically updating when the element's size or position changes.

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { ElementRect } from "runed";

	let el = $state<HTMLElement>();
	const rect = new ElementRect(() => el);
</script>

<textarea bind:this={el}></textarea>

<p>Width: {rect.width} Height: {rect.height}</p>
<!-- alternatively -->
<pre>{JSON.stringify(rect.current, null, 2)}</pre>
```

## Type Definition

```ts
type Rect = Omit<DOMRect, "toJSON">;

interface ElementRectOptions {
	initialRect?: DOMRect;
}

class ElementRect {
	constructor(node: MaybeGetter<HTMLElement | undefined | null>, options?: ElementRectOptions);
	readonly current: Rect;
	readonly width: number;
	readonly height: number;
	readonly top: number;
	readonly left: number;
	readonly right: number;
	readonly bottom: number;
	readonly x: number;
	readonly y: number;
}
```
