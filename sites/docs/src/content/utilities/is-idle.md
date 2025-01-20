---
title: IsIdle
description: Track if a user is idle and the last time they were active.
category: Sensors
---

<script>
import Demo from '$lib/components/demos/is-idle.svelte';
</script>

`IsIdle` tracks user activity and determines if they're idle based on a configurable timeout. It
monitors mouse movement, keyboard input, and touch events to detect user interaction.

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { AnimationFrames, IsIdle } from "runed";

	const idle = new IsIdle({ timeout: 1000 });
</script>

<p>Idle: {idle.current}</p>
<p>
	Last active: {new Date(idle.lastActive).toLocaleTimeString()}
</p>
```

## Type Definitions

```ts
interface IsIdleOptions {
	/**
	 * The events that should set the idle state to `true`
	 *
	 * @default ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
	 */
	events?: MaybeGetter<(keyof WindowEventMap)[]>;
	/**
	 * The timeout in milliseconds before the idle state is set to `true`. Defaults to 60 seconds.
	 *
	 * @default 60000
	 */
	timeout?: MaybeGetter<number>;
	/**
	 * Detect document visibility changes
	 *
	 * @default false
	 */
	detectVisibilityChanges?: MaybeGetter<boolean>;
	/**
	 * The initial state of the idle property
	 *
	 * @default false
	 */
	initialState?: boolean;
}

class IsIdle {
	constructor(options?: IsIdleOptions);
	readonly current: boolean;
	readonly lastActive: number;
}
```
