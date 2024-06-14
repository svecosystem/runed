---
title: IsIdle
description: Determine if a user is active.
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
 import { IsIdle } from "runed";
 import { cn } from "$lib/utils";

 const isIdle = new IsIdle();
</script>

<div class="rounded-md bg-card p-8">
 <p>
  <span>
    Idle: 
  </span>
  <b class={cn(isIdle.current ? "text-green-600" : "text-red-500")}>
    {isIdle.current}
  </b>
 </p>
</div>
```
