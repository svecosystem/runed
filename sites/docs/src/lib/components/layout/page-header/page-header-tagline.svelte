<script lang="ts">
	import { cn } from "$lib/utils/index.js";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p class={cn("mb-4 text-sm/6 font-medium capitalize text-accent-foreground", className)}>
	<slot />
</p>
