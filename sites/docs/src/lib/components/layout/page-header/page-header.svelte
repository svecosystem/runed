<script lang="ts">
	import { cn } from "$lib/utils/index.js";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<header
	class={cn(
		"prose relative mb-4 max-w-3xl border-b border-border pb-8 dark:prose-invert",
		className
	)}
>
	<slot />
</header>
