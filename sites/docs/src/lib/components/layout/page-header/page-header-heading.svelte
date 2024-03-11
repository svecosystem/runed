<script lang="ts">
	import { cn } from "$lib/utils/index.js";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<h1 class={cn("mb-6 scroll-m-20 text-4xl font-bold tracking-tight", className)}>
	<slot />
</h1>
