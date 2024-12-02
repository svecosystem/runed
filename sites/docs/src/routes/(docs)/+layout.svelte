<script lang="ts">
	import RunedDark from "$lib/components/logos/runed-dark.svelte";
	import RunedLight from "$lib/components/logos/runed-light.svelte";
	import { DocsLayout } from "@svecodocs/kit";
	import { navigation } from "$lib/config/navigation";

	let { children } = $props();
</script>

<DocsLayout {navigation}>
	{#snippet logo()}
		<RunedDark class="hidden max-h-6 dark:block" />
		<RunedLight class="block max-h-6 dark:hidden" />
		<span class="sr-only">Svecodocs</span>
	{/snippet}

	{@render children?.()}
</DocsLayout>
