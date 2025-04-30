---
title: TextareaAutosize
description: Automatically adjust a textarea's height based on its content.
category: Elements
---

<script>
import Demo from '$lib/components/demos/textarea-autosize.svelte';
</script>

## Demo

<Demo />

## Overview

`TextareaAutosize` is a utility that makes `<textarea>` elements grow or shrink automatically based
on their content, without causing layout shifts. It:

- Mirrors the actual textarea off-screen for accurate measurement
- Syncs dimensions when the content, width, or element changes
- Prevents overflow until a maximum height (if configured)
- Supports both reactive state and static values

## Usage

```svelte
<script lang="ts">
	import { TextareaAutosize } from "runed";

	let el = $state<HTMLTextAreaElement>(null!);
	let value = $state("");

	new TextareaAutosize({
		element: () => el,
		input: () => value
	});
</script>

<textarea bind:this={el} bind:value></textarea>
```

As you type, the textarea will automatically resize vertically to fit the content.

## Options

You can customize behavior via the following options:

| Option      | Type                               | Description                                                                                                |
| ----------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `element`   | `Getter<HTMLElement \| undefined>` | The target textarea (required).                                                                            |
| `input`     | `Getter<string>`                   | Reactive input value (required).                                                                           |
| `onResize`  | `() => void`                       | Called whenever the height is updated.                                                                     |
| `styleProp` | `"height"` \| `"minHeight"`        | CSS property to control size. `"height"` resizes both ways. `"minHeight"` grows only. Default: `"height"`. |
| `maxHeight` | `number`                           | Maximum height in pixels before scroll appears. Default: unlimited.                                        |

## Behavior

Internally, `TextareaAutosize`:

- Creates an invisible, off-screen `<textarea>` clone
- Copies computed styles from the actual textarea
- Measures scroll height of the clone to determine needed height
- Applies the height (or `minHeight`) to the real textarea
- Recalculates on content changes, element resizes, and width changes

## Examples

### Grow-only Behavior

```ts
new TextareaAutosize({
	element: () => el,
	input: () => value,
	styleProp: "minHeight"
});
```

This lets the textarea expand as needed, but won't shrink smaller than its current size.
