<script lang="ts">
	import { cn } from "$lib/utils/index.js";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p class={cn("mt-2 text-balance text-lg text-muted-foreground", className)}>
	<slot />
</p>
