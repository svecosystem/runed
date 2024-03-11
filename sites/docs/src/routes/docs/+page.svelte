<script lang="ts">
	import "$lib/styles/markdown.pcss";
	import type { SvelteComponent } from "svelte";
	import type { PageData } from "./$types.js";
	import { PageHeader } from "$lib/components/layout/index.js";

	type Component = $$Generic<typeof SvelteComponent>;

	export let data: PageData;
	$: component = data.component as unknown as Component;
	$: doc = data.metadata;
</script>

<PageHeader.Root>
	<PageHeader.Tagline>{doc.tagline ?? ""}</PageHeader.Tagline>
	<PageHeader.Heading>{doc.title}</PageHeader.Heading>
	<PageHeader.Description>{doc.description}</PageHeader.Description>
</PageHeader.Root>
<div class="markdown prose relative max-w-3xl pt-4 dark:prose-invert" id="sveco-content">
	<svelte:component this={component} />
</div>
