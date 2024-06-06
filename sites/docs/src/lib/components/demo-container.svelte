<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/styles.js";

	let { children, class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	class={cn("not-prose overflow-x-auto rounded-lg border border-border bg-card p-8", className)}
	{...restProps}
>
	{@render children?.()}
</div>
