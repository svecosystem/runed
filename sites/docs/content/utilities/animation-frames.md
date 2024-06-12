---
title: AnimationFrames
description:
  A wrapper over `requestAnimationFrame`, with controls for limiting FPS, and information about the
  current frame.
category: Browser
---

<script>
import Demo from '$lib/components/demos/animation-frames.svelte';
</script>

## Demo

<Demo />
<p class="text-xs opacity-50 text-right">
    Mouse sprite extracted from <a target="_blank" href="https://www.animalwell.net/">Animal Well</a>
</p>

## Description

`AnimationFrames` wraps over
[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame).
While it is not necessary to use it to use `requestAnimationFrame`, it removes some of the
boilerplate, and adds common utilities for it.

- Automatically interrupts the requestAnimationFrame loop once the component is unmounted
- Lets you set an FPS limit
- Lets you get information about the current frame, such as its current timestamp, and the
  difference in ms between the last frame and the current one
- Returns information about current FPS

## Usage

```svelte
<script lang="ts">
	import { AnimationFrames } from "runed";
	import { Slider } from "../ui/slider"; // Check out shadcn-svelte!

	let frames = $state(0);
	let fpsLimit = $state(10);
	let delta = $state(0);
	const animation = new AnimationFrames(
		(args) => {
			frames++;
			delta = args.delta;
		},
		{ fpsLimit: () => fpsLimit }
	);

	const stats = $derived(
		`Frames: ${frames}\nFPS: ${animation.fps.toFixed(0)}\nDelta: ${delta.toFixed(0)}ms`
	);
</script>

<pre>{stats}</pre>
<button onclick={toggle}>
	{animation.running ? "Stop" : "Start"}
</button>
<p>
	FPS limit: <b>{fpsLimit}</b><i>{fpsLimit === 0 ? " (not limited)" : ""}</i>
</p>
<Slider
	value={[fpsLimit]}
	onValueChange={(value) => (fpsLimit = value[0] ?? 0)}
	min={0}
	max={144} />
```
