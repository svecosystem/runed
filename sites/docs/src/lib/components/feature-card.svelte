<script lang="ts">
	import type { ComponentType } from "svelte";
	import * as Card from "$lib/components/ui/card/index.js";

	export let title: string;
	export let icon: ComponentType;
</script>

<Card.Root class="bg-card/60 flex flex-col p-6 [&>svg]:mb-2 [&>svg]:size-10">
	<div class="mb-2">
		<svelte:component this={icon} class="mb-2 size-10" />
	</div>
	<Card.Title class="mb-1 text-base">
		{title}
	</Card.Title>
	<p class="text-foreground/60 text-[15px]">
		<slot />
	</p>
</Card.Root>
