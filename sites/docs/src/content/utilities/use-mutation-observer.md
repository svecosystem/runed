---
title: useMutationObserver
description: Observe changes in an element
category: Elements
---

<script>
import Demo from '$lib/components/demos/use-mutation-observer.svelte';
</script>

## Demo

<Demo />

## Usage

With a reference to an element, you can use the `useMutationObserver` hook to observe changes in the
element.

```svelte
<script lang="ts">
	import { useMutationObserver } from "runed";

	let el = $state<HTMLElement | null>(null);
	const messages = $state<string[]>([]);
	let className = $state("");
	let style = $state("");

	useMutationObserver(
		() => el,
		(mutations) => {
			const mutation = mutations[0];
			if (!mutation) return;

			messages.push(mutation.attributeName!);
		},
		{ attributes: true }
	);

	setTimeout(() => {
		className = "text-brand";
	}, 1000);

	setTimeout(() => {
		style = "font-style: italic;";
	}, 1500);
</script>

<div bind:this={el} class={className} {style}>
	{#each messages as text}
		<div>
			Mutation Attribute: {text}
		</div>
	{:else}
		<div>No mutations yet</div>
	{/each}
</div>
```

You can stop the mutation observer at any point by calling the `stop` method.

```ts
const { stop } = useMutationObserver(/* ... */);
stop();
```
