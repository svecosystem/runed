---
title: useStickToBottom
description:
  Tracks if a scrollable container is at the bottom and provides functionality to stick to the
  bottom as content changes
category: Elements
---

<script>
import Demo from '$lib/components/demos/use-stick-to-bottom.svelte';
</script>

## Demo

<Demo />

## Usage

The `useStickToBottom` utility helps track if a scrollable container is at the bottom and provides
functionality to stick to the bottom as content changes. This is particularly useful for chat or
message interfaces where you want to automatically scroll to new content.

```svelte
<script lang="ts">
	import { useStickToBottom } from "runed";

	let contentToTrack: HTMLElement | null = $state(null);

	const { state, scrollToBottom } = useStickToBottom(() => contentToTrack);
</script>

<div class="relative overflow-auto">
	<div bind:this={contentToTrack}>
		{#each messages as message}
			<div>{message}</div>
		{/each}
	</div>
</div>

{#if !$state.isAtBottom}
	<button onclick={() => scrollToBottom()}>Scroll to bottom</button>
{/if}
```
