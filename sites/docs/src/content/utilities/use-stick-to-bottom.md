---
title: useStickToBottom
description:
  Tracks if a scrollable container is at the bottom and provides functionality to stick to the
  bottom as content changes with customizable animations
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

	const stickToBottom = useStickToBottom(() => contentToTrack);
</script>

<div class="relative overflow-auto">
	<div bind:this={contentToTrack}>
		{#each messages as message}
			<div>{message}</div>
		{/each}
	</div>
</div>

{#if !stickToBottom.isNearBottom}
	<button onclick={() => stickToBottom.scrollToBottom()}>Scroll to bottom</button>
{/if}
```

## Customizing Animations

The utility supports both standard scroll behaviors (`"smooth"` or `"instant"`) and spring-based
physics animations for more natural scrolling effects:

```svelte
<script>
	// Spring animation for smoother scrolling
	const { scrollToBottom } = useStickToBottom(() => contentEl, {
		// Spring animation properties
		damping: 0.8, // Higher value means more damping (0-1)
		stiffness: 0.04, // Stiffness of the spring
		mass: 1.5, // Higher means heavier/slower

		// Different animation for initial scroll vs resize events
		initial: "instant", // Use instant animation for first scroll
		resize: {
			// Use spring animation for resize events
			damping: 0.6,
			stiffness: 0.05
		}
	});

	// Advanced scroll control
	function scrollWithOptions() {
		scrollToBottom({
			animation: "smooth", // or spring options
			ignoreEscapes: true, // prevent user from scrolling away
			wait: 200, // wait before starting animation
			duration: 500 // extra duration after completing scroll
		});
	}
</script>
```

The `scrollToBottom` function returns a Promise that resolves when the scroll animation completes,
allowing you to sequence animations or perform actions after scrolling.
