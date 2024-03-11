<script lang="ts">
	import { cn } from "$lib/utils/index.js";

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<h2
	class={cn("mt-12 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0", className)}
	{...$$restProps}
>
	<slot />
</h2>
