---
title: useIntersectionObserver
description: Watch for intersection changes of a target element.
category: Browser
---

<script>
import Demo from '$lib/components/demos/use-intersection-observer.svelte';
import { Callout } from '$lib/components'
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
