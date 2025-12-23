---
title: useFullscreen
description: Reactive access to the browser's Fullscreen API.
category: Browser
---

<script>
import Demo from '$lib/components/demos/use-fullscreen.svelte';
</script>

`useFullscreen` is a reactive wrapper around the browser's
[Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API).

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { useFullscreen } from "runed";

	const fullscreen = useFullscreen();
</script>

<pre>Is Supported: {fullscreen.isSupported}</pre>
<pre>Is Fullscreen: {fullscreen.isFullscreen}</pre>
<button onclick={fullscreen.enter} disabled={!fullscreen.isSupported || fullscreen.isFullscreen}
	>Enter Fullscreen</button>
<button onclick={fullscreen.exit} disabled={!fullscreen.isSupported || !fullscreen.isFullscreen}
	>Exit Fullscreen</button>
<button onclick={fullscreen.toggle} disabled={!fullscreen.isSupported}>Toggle Fullscreen</button>
```

With a specific target element:

```svelte
<script lang="ts">
	import { useFullscreen } from "runed";

	let videoElement: HTMLVideoElement;

	const fullscreen = useFullscreen(() => videoElement);
</script>

<video bind:this={videoElement} controls>
	<source src="/video.mp4" type="video/mp4" />
</video>

<button onclick={fullscreen.enter} disabled={!fullscreen.isSupported || fullscreen.isFullscreen}
	>Enter Fullscreen</button>
<button onclick={fullscreen.exit} disabled={!fullscreen.isSupported || !fullscreen.isFullscreen}
	>Exit Fullscreen</button>
```

## Type Definitions

```ts
type UseFullscreenOptions = {
	/**
	 * Automatically exit fullscreen when component is unmounted
	 *
	 * @default false
	 */
	autoExit?: boolean;
	/**
	 * Custom document instance
	 *
	 * @default defaultDocument
	 */
	document?: Document;
};

type UseFullscreenReturn = {
	readonly isSupported: boolean;
	readonly isFullscreen: boolean;
	enter: () => Promise<void>;
	exit: () => Promise<void>;
	toggle: () => Promise<void>;
};
```
