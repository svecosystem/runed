---
title: useMousePosition
description: Measure cursor position in viewport or a specified element.
category: Sensors
---

<script>
import Demo from '$lib/components/demos/use-mouse-position.svelte';
import { PropField } from '@svecodocs/kit'
</script>

`useMousePosition` measures cursor position in viewport or relative to a specified element. It
exposes read-only position data useful for animations, hover effects, and other interactive
components that depend on cursor location. It tracks pointer events only — touch events are not
included.

## Demo

<Demo />

## Basic Usage

```svelte
<script lang="ts">
	import { useMousePosition } from "runed";

	const mouse = useMousePosition();
</script>

<p>Cursor: {mouse.x}, {mouse.y}</p>
```

### With a Target Element

Pass an element getter as the first argument to get cursor position relative to that element.
`isInside` is a reactive property that indicates whether the cursor is within the element's bounds.

```svelte
<script lang="ts">
	import { useMousePosition } from "runed";

	let el = $state<HTMLDivElement>();
	const mouse = useMousePosition(() => el);
</script>

<div bind:this={el}>
	<p>Element: {mouse.elementX}, {mouse.elementY}</p>
	<p>Inside: {mouse.isInside}</p>
</div>
```

## Advanced Usage

### Out-of-Bounds Tracking

`elementX` and `elementY` are not clamped to the element's boundaries. When the cursor is above or
to the left of the element, values are negative. When beyond the right or bottom edge, values exceed
the element's dimensions. This is useful for proximity-based effects like glow, magnetic snap, or
directional animations.

```svelte
<script lang="ts">
	import { useMousePosition, ElementSize } from "runed";

	let el = $state<HTMLDivElement>();
	const mouse = useMousePosition(() => el);
	const size = new ElementSize(() => el);

	// Distance from nearest edge per axis.
	// Inside: positive (distance to closest edge). Outside: negative.
	const edgeX = $derived(Math.min(mouse.elementX, size.width - mouse.elementX));
	const edgeY = $derived(Math.min(mouse.elementY, size.height - mouse.elementY));
</script>

<div bind:this={el}>
	<p>Edge distance: {Math.round(edgeX)}, {Math.round(edgeY)}</p>
</div>
```

### Controlled Listener

The function returns control methods to programmatically manage the listener, `start` and `stop`,
and a reactive read-only property `enabled` to check the current status of the listener.

```svelte
<script lang="ts">
	import { useMousePosition } from "runed";

	const mouse = useMousePosition(undefined, { immediate: false });
</script>

<p>Cursor: {mouse.x}, {mouse.y}</p>
<p>Enabled: {mouse.enabled}</p>
<button onclick={mouse.start}>Start</button>
<button onclick={mouse.stop}>Stop</button>
```

## Options

<PropField name="target" type="MaybeElementGetter" defaultValue="undefined">

The target element for computing element-relative coordinates. Passed as the first argument. When
provided, `elementX`, `elementY`, and `isInside` are populated.

</PropField>

<PropField name="immediate" type="boolean" defaultValue="true">

Whether the pointer listener is active by default. If set to `false`, the listener will not be
active until `start()` is called.

</PropField>

<PropField name="window" type="Window" defaultValue="window">

The window object to use, defaults to the global window.

</PropField>

## Type Definitions

```ts
export type UseMousePositionOptions = ConfigurableWindow & {
	/**
	 * Whether to start tracking immediately.
	 * If `false`, the listener is not active until `start()` is called.
	 *
	 * @default true
	 */
	immediate?: boolean;
};

/**
 * Reactively tracks the cursor's position, both globally (viewport coordinates)
 * and relative to an optional target element.
 *
 * @param target - Optional element to compute relative coordinates against.
 * @param options - Configuration options.
 *
 * @see {@link https://runed.dev/docs/utilities/use-mouse-position}
 */
export declare function useMousePosition(
	target?: MaybeElementGetter,
	options?: UseMousePositionOptions
): {
	/** Cursor x coordinate relative to the viewport (`clientX`). */
	readonly x: number;
	/** Cursor y coordinate relative to the viewport (`clientY`). */
	readonly y: number;
	/** X coordinate relative to the target element's top-left corner. `0` when no target. */
	readonly elementX: number;
	/** Y coordinate relative to the target element's top-left corner. `0` when no target. */
	readonly elementY: number;
	/** Whether the cursor is currently inside the target element's bounding rect. */
	readonly isInside: boolean;
	/** Whether the listener is currently active. */
	readonly enabled: boolean;
	/** Stop listening for pointer events. */
	stop: () => void;
	/** Start listening for pointer events. */
	start: () => void;
};
```
