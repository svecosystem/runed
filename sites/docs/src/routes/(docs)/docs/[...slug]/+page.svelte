<script lang="ts">
	import { DocPage } from "@svecodocs/kit";
	let { data } = $props();

	const ogUrl = $derived(
		`https://runed.dev/og?title=${encodeURIComponent(data.metadata.title)}&description=${encodeURIComponent(data.metadata.description)}`
	);
</script>

<svelte:head>
	<title>{data.metadata.title}</title>
	<meta name="description" content={data.metadata.description} />
</svelte:head>

<DocPage
	component={data.component}
	{...data.metadata}
	metadata={{ ogImage: { url: ogUrl, width: "1200", height: "630" } }}
/>
