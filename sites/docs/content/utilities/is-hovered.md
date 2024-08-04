---
title: IsHovered
description: Determine if an element is hovered.
category: Utilities
---

<script>
import Demo from '$lib/components/demos/is-hovered.svelte';
</script>

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { IsHovered } from "runed";

	let el = $state<HTMLElement>();
	const isHovered = new IsHovered(() => el);
</script>

<button bind:this={el}>
	{!isHovered.current ? "Hover me!" : "Unhover me!"}
</button>

<p>Is hovered: <b>{isHovered.current ? "true" : "false"}</b></p>
```
