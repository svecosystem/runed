---
title: IsIdle
description: Determine if a user is idle, and when was the last time they were active.
category: Utilities
---

<script>
import Demo from '$lib/components/demos/is-idle.svelte';
</script>

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
