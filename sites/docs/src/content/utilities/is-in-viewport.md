---
title: IsInViewport
description: Track if an element is visible within the current viewport.
category: Elements
---

<script>
import Demo from '$lib/components/demos/is-in-viewport.svelte';
</script>

`IsInViewport` uses the [`useIntersectionObserver`](/docs/utilities/use-intersection-observer)
utility to track if an element is visible within the current viewport.

It accepts an element or getter that returns an element and an optional `options` object that aligns
with the [`useIntersectionObserver`](/docs/utilities/use-intersection-observer) utility options.

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { IsInViewport } from "runed";

	let targetNode = $state<HTMLElement>()!;
	const inViewport = new IsInViewport(() => targetNode);
</script>

<p bind:this={targetNode}>Target node</p>

<p>Target node in viewport: {inViewport.current}</p>
```

## Type Definition

```ts
import { type UseIntersectionObserverOptions } from "runed";
export type IsInViewportOptions = UseIntersectionObserverOptions;

export declare class IsInViewport {
	constructor(node: MaybeGetter<HTMLElement | null | undefined>, options?: IsInViewportOptions);
	get current(): boolean;
}
```

<!-- Ensure the page can scroll so the target can be outside of the viewport -->
<div class="h-[500px]"></div>
