---
title: IsFocusWithin
description: Determine if focus is within a specific element.
category: Utilities
---

<script>
import Demo from '$lib/components/demos/is-focus-within.svelte';
</script>

## Demo

<Demo />

## Usage

```svelte
<script lang="ts">
	import { IsFocusWithin } from "runed";

	let formElement = $state<HTMLFormElement | undefined>();
	const focusWithinForm = new IsFocusWithin(() => formElement);
</script>

<p>Focus within form: {focusWithinForm.current}</p>
<form bind:this={formElement}>
	<input type="text" />
	<button type="submit">Submit</button>
</form>
```
