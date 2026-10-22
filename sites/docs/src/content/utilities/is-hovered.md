---
title: IsHovered
description: Handles pointer hover interactions for an element using Svelte attachments.
category: Elements
---

<script>
import Demo from '$lib/components/demos/is-hovered.svelte';
</script>

`IsHovered` handles pointer hover interactions for an element. It normalizes behavior across
browsers and platforms, and ignores emulated mouse events on touch devices.

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { IsHovered } from "runed";

	const hovered = new IsHovered();
</script>

<div {@attach hovered.attach}>
	{#if hovered.current}
		I am hovered!
	{:else}
		Hover me!
	{/if}
</div>
```

## Type Definition

```ts
export class IsHovered {
	constructor(options?: IsHoveredOptions);
	readonly current: boolean;
	readonly attach: Attachment<HTMLElement | SVGElement>;
}

export type IsHoveredHandlers = {
	onHoverStart?: (e: IsHoveredEvent) => void;
	onHoverEnd?: (e: IsHoveredEvent) => void;
	onHoverChange?: (isHovered: boolean) => void;
};

export type IsHoveredOptions = IsHoveredHandlers & {
	isDisabled?: MaybeGetter<boolean>;
};
```
