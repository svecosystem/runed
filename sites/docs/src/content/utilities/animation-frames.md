---
title: AnimationFrames
description: A wrapper for requestAnimationFrame with FPS control and frame metrics
category: Animation
---

<script>
import Demo from '$lib/components/demos/animation-frames.svelte';
</script>

`AnimationFrames` provides a declarative API over the browser's
[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame),
offering FPS limiting capabilities and frame metrics while handling cleanup automatically.

## Demo

<Demo />

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
