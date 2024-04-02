<script lang="ts">
	import type { ComponentType } from "svelte";
	import * as Card from "$lib/components/ui/card/index.js";

	export let title: string;
	export let icon: ComponentType;
</script>

<Card.Root class="flex flex-col bg-card/60 p-6 [&>svg]:mb-2 [&>svg]:size-10">
	<div class="mb-2">
		<svelte:component this={icon} class="mb-2 size-10" />
	</div>
	<Card.Title class="mb-1 text-base">
		{title}
	</Card.Title>
	<p class="text-[15px] text-foreground/60">
		<slot />
	</p>
</Card.Root>
