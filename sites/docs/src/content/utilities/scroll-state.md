---
title: ScrollState
description:
  Track scroll position, direction, and edge states with support for programmatic scrolling.
category: Elements
---

<script>
import Demo from '$lib/components/demos/scroll-state.svelte';
</script>

## Demo

<Demo />

## Overview

`ScrollState` is a reactive utility that lets you:

- Track scroll positions (`x` / `y`)
- Detect scroll direction (`left`, `right`, `top`, `bottom`)
- Determine if the user has scrolled to an edge (`arrived` state)
- Perform programmatic scrolling (`scrollTo`, `scrollToTop`, `scrollToBottom`)
- Listen to scroll and scroll-end events
- Respect flex, RTL, and reverse layout modes

Inspired by [VueUse's `useScroll`](https://vueuse.org/useScroll), this utility is built for Svelte
and works with DOM elements, the `window`, or `document`.

## Usage

```svelte
<script lang="ts">
	import { ScrollState } from "runed";

	let el = $state<HTMLElement>();

	const scroll = new ScrollState({
		element: () => el
	});
</script>

<div bind:this={el} style="overflow: auto; height: 200px;">
	<!-- scrollable content here -->
</div>
```

You can now access:

- `scroll.x` and `scroll.y` — current scroll positions (reactive, get/set)

- `scroll.directions` — active scroll directions

- `scroll.arrived` — whether the scroll has reached each edge

- `scroll.progress` — percentage that the user has scrolled on the x/y axis

- `scroll.scrollTo(x, y)` — programmatic scroll

- `scroll.scrollToTop()` and `scroll.scrollToBottom()` — helpers

## Options

You can configure `ScrollState` via the following options:

| Option                 | Type                                                     | Description                                                            |
| ---------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------- |
| `element`              | `MaybeGetter<HTMLElement \| Window \| Document \| null>` | The scroll container (required).                                       |
| `idle`                 | `MaybeGetter<number \| undefined>`                       | Debounce time (ms) after scroll ends. Default: `200`.                  |
| `offset`               | `{ top?, bottom?, left?, right? }`                       | Pixel thresholds for "arrived" state detection. Default: `0` for all.  |
| `onScroll`             | `(e: Event) => void`                                     | Callback for scroll events.                                            |
| `onStop`               | `(e: Event) => void`                                     | Callback after scrolling stops.                                        |
| `eventListenerOptions` | `AddEventListenerOptions`                                | Scroll listener options. Default: `{ passive: true, capture: false }`. |
| `behavior`             | `ScrollBehavior`                                         | Scroll behavior: `"auto"`, `"smooth"`, etc. Default: `"auto"`.         |
| `onError`              | `(error: unknown) => void`                               | Optional error handler. Default: `console.error`.                      |

## Notes

- Both scroll position (`x`, `y`) and edge arrival state (`arrived`) are reactive values.

- You can programmatically change `scroll.x` and `scroll.y`, and the element will scroll
  accordingly.

- Layout direction and reverse flex settings are respected when calculating edge states.

- Debounced `onStop` is invoked after scrolling ends and the user is idle.
