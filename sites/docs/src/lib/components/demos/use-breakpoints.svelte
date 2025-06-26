<script lang="ts">
	import { useBreakpoints } from "runed";
	import { scale } from "svelte/transition";
	import { DemoContainer } from "@svecodocs/kit";

	const breakpoints = useBreakpoints();
</script>

<DemoContainer>
	<div class="flex flex-col place-items-center justify-center gap-2 rounded-lg p-4">
		{#if breakpoints["2xl"]}
			{@render breakpoint({ name: "2xl" })}
		{:else if breakpoints.xl}
			{@render breakpoint({ name: "xl" })}
		{:else if breakpoints.lg}
			{@render breakpoint({ name: "lg" })}
		{:else if breakpoints.md}
			{@render breakpoint({ name: "md" })}
		{:else if breakpoints.sm}
			{@render breakpoint({ name: "sm" })}
		{:else}
			{@render breakpoint({ name: "-" })}
		{/if}
		<span class="text-muted-foreground text-center text-xs">
			Resize the window to see the breakpoint change.
		</span>
	</div>
</DemoContainer>

{#snippet breakpoint({ name }: { name: string })}
	<span in:scale={{ duration: 300 }} class="text-xl">
		{name}
	</span>
{/snippet}
