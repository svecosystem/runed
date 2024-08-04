<script lang="ts">
	import { writable } from "svelte/store";
	import { setTabsCtx } from ".";
	import * as Tabs from "$lib/components/ui/tabs/index.js";

	const items = writable([]);

	setTabsCtx({ items });
</script>

<Tabs.Root class="relative mt-6 w-full">
	<Tabs.List class="w-full justify-start rounded-none border-b bg-transparent p-0">
		{#each $items as item}
			<Tabs.Trigger
				class="text-muted-foreground data-[state=active]:border-b-brand data-[state=active]:text-foreground relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold shadow-none transition-none data-[state=active]:shadow-none"
				value={item}
			>
				{item}
			</Tabs.Trigger>
		{/each}
	</Tabs.List>
	<slot />
</Tabs.Root>
