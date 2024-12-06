---
title: MediaQuery
description:
  Take a media query (or a function that returns one if you want reactivity) as input and you can
  check if it currently matches doing `instance.match`
category: Browser
---

<script>
import Demo from '$lib/components/demos/media-query.svelte';
</script>

## Demo

<Demo />

## Usage

The simplest way of using this utility is just by passing a string with a valid media query.

```svelte
<script>
	import { MediaQuery } from "runed";

	const screen = new MediaQuery("(min-width: 640px)");
</script>

{#if screen.matches}
	Your screen is less than 640px
{:else}
	Your screen is more than 640px
{/if}
```

You can also pass a getter that returns a string.

```svelte
<script lang="ts">
	import { MediaQuery } from "runed";

	let media = $state("(min-width: 640px)");
	const screen = new MediaQuery(() => media);
</script>

Media query {media} is currently {screen.matches}

<select bind:value={media}>
	<option value="(min-width: 640px)">640px</option>
	<option value="(min-width: 320px)">320px</option>
</select>
```
