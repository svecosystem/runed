---
title: useIntersectionObserver
description: Watch for intersection changes of a target element.
category: Elements
---

<script>
import Demo from '$lib/components/demos/use-intersection-observer.svelte';
import { Callout } from '@svecodocs/kit'
</script>

## Demo

<Demo />

## Usage

With a reference to an element, you can use the `useIntersectionObserver` utility to watch for
intersection changes of the target element.

```svelte
<script lang="ts">
	import { useIntersectionObserver } from "runed";

	let target = $state<HTMLElement | null>(null);
	let root = $state<HTMLElement | null>(null);

	let isIntersecting = $state(false);

	useIntersectionObserver(
		() => target,
		(entries) => {
			const entry = entries[0];
			if (!entry) return;
			isIntersecting = entry.isIntersecting;
		},
		{ root: () => root }
	);
</script>

<div bind:this={root}>
	<div bind:this={target}>
		{#if isIntersecting}
			<div>Target is intersecting</div>
		{:else}
			<div>Target is not intersecting</div>
		{/if}
	</div>
</div>
```

### One-time Detection

You can use the `once` option to automatically stop observing after the first intersection:

```svelte
<script lang="ts">
	import { useIntersectionObserver } from "runed";

	let target = $state<HTMLElement | null>(null);
	let hasBeenSeen = $state(false);

	useIntersectionObserver(
		() => target,
		(entries) => {
			const entry = entries[0];
			if (entry?.isIntersecting) {
				hasBeenSeen = true;
			}
		},
		{ once: true }
	);
</script>

<div bind:this={target} class="transition" class="transition-opacity {hasBeenSeen ? 'opacity-100' : 'opacity-0'}">
	I'll fade in once when first visible, then stop observing
</div>
```

### Pause

You can pause the intersection observer at any point by calling the `pause` method.

```ts
const observer = useIntersectionObserver(/* ... */);

observer.pause();
```

### Resume

You can resume the intersection observer at any point by calling the `resume` method.

```ts
const observer = useIntersectionObserver(/* ... */);

observer.resume();
```

### Stop

You can stop the intersection observer at any point by calling the `stop` method.

```ts
const observer = useIntersectionObserver(/* ... */);

observer.stop();
```

### isActive

You can check if the intersection observer is active by checking the `isActive` property.

<Callout type="warning">

This property cannot be destructured as it is a getter. You must access it directly from the
observer.

</Callout>

```ts
const observer = useIntersectionObserver(/* ... */);

if (observer.isActive) {
	// do something
}
```
