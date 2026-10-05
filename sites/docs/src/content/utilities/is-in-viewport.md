---
title: IsInViewport
description: Track if an element is visible within the current viewport.
category: Elements
---

<script>
import Demo from '#lib/components/demos/is-in-viewport.svelte';
</script>

`IsInViewport` uses the [`useIntersectionObserver`](/docs/utilities/use-intersection-observer)
utility to track if an element is visible within the current viewport.

It accepts an element or getter that returns an element and an optional `options` object that aligns
with the [`useIntersectionObserver`](/docs/utilities/use-intersection-observer) utility options.

## Demo

<Demo />

## Usage

### Basic Usage

```svelte
<script lang="ts">
	import { IsInViewport } from "runed";

	let targetNode = $state<HTMLElement>()!;
	const inViewport = new IsInViewport(() => targetNode);
</script>

<p bind:this={targetNode}>Target node</p>

<p>Target node in viewport: {inViewport.current}</p>
```

### One-time Detection

The `once` option automatically stops observing after the first intersection. This is useful for
one-time animations or loading content when it becomes visible:

```svelte
<script lang="ts">
	import { IsInViewport } from "runed";

	let targetNode = $state<HTMLElement>()!;
	const inViewport = new IsInViewport(() => targetNode, {
		once: true
	});
</script>

<div bind:this={targetNode} class="transition" class="transition-opacity {hasBeenSeen ? 'opacity-100' : 'opacity-0'}">
	I'll fade in once when first visible, then stop observing
</div>
```

### Observer Controls

The `IsInViewport` class exposes the underlying intersection observer for direct control:

```svelte
<script lang="ts">
	import { IsInViewport } from "runed";

	let targetNode = $state<HTMLElement>()!;
	const inViewport = new IsInViewport(() => targetNode);

	// Access observer directly
	inViewport.observer.pause();
	inViewport.observer.resume();
	inViewport.observer.stop();
	console.log(inViewport.observer.isActive);
</script>
```

## Type Definition

```ts
import { type UseIntersectionObserverOptions, type UseIntersectionObserverReturn } from "runed";
export type IsInViewportOptions = UseIntersectionObserverOptions;

export declare class IsInViewport {
	constructor(node: MaybeGetter<HTMLElement | null | undefined>, options?: IsInViewportOptions);

	/** Current viewport intersection state */
	get current(): boolean;

	/** The underlying intersection observer */
	get observer(): UseIntersectionObserverReturn;
}
```

<!-- Ensure the page can scroll so the target can be outside of the viewport -->
<div class="h-[500px]"></div>
