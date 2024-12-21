---
title: IsFocusWithin
description:
  A utility that tracks whether any descendant element has focus within a specified container
  element.
category: Elements
---

<script>
import Demo from '$lib/components/demos/is-focus-within.svelte';
</script>

`IsFocusWithin` reactively tracks focus state within a container element, updating automatically
when focus changes.

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { IsFocusWithin } from "runed";

	let formElement = $state<HTMLFormElement>();
	const focusWithinForm = new IsFocusWithin(() => formElement);
</script>

<p>Focus within form: {focusWithinForm.current}</p>
<form bind:this={formElement}>
	<input type="text" />
	<button type="submit">Submit</button>
</form>
```

## Type Definition

```ts
class IsFocusWithin {
	constructor(node: MaybeGetter<HTMLElement | undefined | null>);
	readonly current: boolean;
}
```
