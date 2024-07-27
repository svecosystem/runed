<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/styles.js";

	let { children, class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	class={cn("not-prose border-border bg-card overflow-x-auto rounded-lg border p-8", className)}
	{...restProps}
>
	{@render children?.()}
</div>
