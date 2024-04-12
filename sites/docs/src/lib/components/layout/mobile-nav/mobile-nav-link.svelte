<script lang="ts">
	import type { HTMLAnchorAttributes } from "svelte/elements";
	import { Drawer } from "vaul-svelte";
	import { cn } from "$lib/utils/index.js";
	import { ArrowUpRight } from "$lib/icons/index.js";

	type $$Props = HTMLAnchorAttributes & {
		external?: boolean;
	};

	let className: string | undefined | null = undefined;
	export { className as class };

	export let href: $$Props["href"] = "";
	export let external = false;
</script>

<Drawer.Close asChild let:builder>
	<a
		use:builder.action
		{href}
		{...$$restProps}
		target={external ? "_blank" : undefined}
		class={cn(external ? "flex items-center gap-0.5" : "", className)}
	>
		<slot />
		{#if external}
			<ArrowUpRight class="-mt-2 ml-0.5 h-3 w-3" />
		{/if}
	</a>
</Drawer.Close>
