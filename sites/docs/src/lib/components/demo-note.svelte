<script lang="ts">
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<div class="text-muted-foreground flex flex-col gap-1.5 text-center text-xs md:text-right">
	{@render children?.()}
</div>
