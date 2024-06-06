<script lang="ts">
	import { setMode } from "mode-watcher";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { MoonStars } from "$lib/icons/index.js";

	const modes = ["light", "dark", "system"] as const;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		aria-label="Change theme"
		class={buttonVariants({ variant: "ghost", size: "icon" })}
	>
		<MoonStars class="size-6" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="z-[100]">
		{#each modes as themeMode}
			<DropdownMenu.Item on:click={() => setMode(themeMode)} class="capitalize"
				>{themeMode}</DropdownMenu.Item
			>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
