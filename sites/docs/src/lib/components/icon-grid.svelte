<script lang="ts">
	import * as Icon from "$lib/icons/index.js";

	function getIcon(name: keyof typeof Icon) {
		return Icon[name];
	}

	const iconKeys = Object.keys(Icon) as (keyof typeof Icon)[];
</script>

<div class="grid grid-cols-5 gap-4">
	{#each iconKeys as icon}
		<div class="flex flex-col justify-between gap-3 rounded-lg border border-border p-4">
			<div class="flex items-center justify-center">
				<svelte:component this={getIcon(icon)} class="size-6" />
			</div>
			<div class="text-center text-xs">{icon}</div>
		</div>
	{/each}
</div>
