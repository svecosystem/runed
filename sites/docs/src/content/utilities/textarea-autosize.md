---
title: TextareaAutosize
description: Automatically update the height of a textarea depending on the content.
category: Elements
---

<script>
import Demo from '$lib/components/demos/textarea-autosize.svelte';
</script>

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { TextareaAutosize } from "runed";

	let el = $state<HTMLTextAreaElement>(null!);
	let value = $state("");
	new TextareaAutosize({
		element: () => el,
		input: () => value
	});
</script>

<textarea bind:this={el} bind:value></textarea>
```
