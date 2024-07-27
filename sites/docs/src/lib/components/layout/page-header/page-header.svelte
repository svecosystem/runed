<script lang="ts">
	import { cn } from "$lib/utils/index.js";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<header
	class={cn(
		"prose border-border dark:prose-invert relative mb-4 max-w-3xl border-b pb-8",
		className
	)}
>
	<slot />
</header>
