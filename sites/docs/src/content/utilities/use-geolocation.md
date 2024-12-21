---
title: useGeolocation
description: Reactive access to the browser's Geolocation API.
category: Sensors
---

<script>
import Demo from '$lib/components/demos/use-geolocation.svelte';
</script>

`useGeolocation` is a reactive wrapper around the browser's
[Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API).

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { useGeolocation } from "runed";

	const location = useGeolocation();
</script>

<pre>Coords: {JSON.stringify(location.position.coords, null, 2)}</pre>
<pre>Located at: {location.position.timestamp}</pre>
<pre>Error: {JSON.stringify(location.error, null, 2)}</pre>
<pre>Is Supported: {location.isSupported}</pre>
<button onclick={location.pause} disabled={location.isPaused}>Pause</button>
<button onclick={location.resume} disabled={!location.isPaused}>Resume</button>
```

## Type Definitions

```ts
type UseGeolocationOptions = Partial<PositionOptions> & {
	/**
	 * Whether to start the watcher immediately upon creation.
	 * If set to `false`, the watcher will only start tracking the position when `resume()` is called.
	 *
	 * @defaultValue true
	 */
	immediate?: boolean;
};

type UseGeolocationReturn = {
	readonly isSupported: boolean;
	readonly position: Omit<GeolocationPosition, "toJSON">;
	readonly error: GeolocationPositionError | null;
	readonly isPaused: boolean;
	pause: () => void;
	resume: () => void;
};
```
