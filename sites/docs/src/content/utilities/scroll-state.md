---
title: ScrollState
description: Track and modify the scroll state of an element
category: Elements
---

<script>
import Demo from '$lib/components/demos/scroll-state.svelte';
</script>

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { ScrollState } from "runed";

	let el = $state<HTMLElement>();
	const scroll = new ScrollState({
		element: () => el
	});
</script>

<div bind:this={el}></div>
```
