<script lang="ts">
	import * as Alert from "$lib/components/ui/alert/index.js";
	import { RocketLaunch, Info, WarningOctagon, Warning } from "$lib/icons/index.js";

	export let type: "note" | "warning" | "danger" | "tip" = "note";
	export let title: string | undefined = type
		.split("")
		.map((c, i) => (i === 0 ? c.toUpperCase() : c))
		.join("");

	const iconMap = {
		note: Info,
		tip: RocketLaunch,
		warning: Warning,
		danger: WarningOctagon,
	} as const;
</script>

<Alert.Root class="mt-4" variant={type}>
	<svelte:component this={iconMap[type]} class="size-6" weight="bold" />

	{#if title}
		<Alert.Title class="text-lg">
			{title}
		</Alert.Title>
	{/if}

	<Alert.Description class="leading-relaxed">
		<p>
			<slot />
		</p>
	</Alert.Description>
</Alert.Root>
