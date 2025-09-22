<script lang="ts">
	import { page } from "$app/state";
	import { DocPage } from "@svecodocs/kit";
	let { data } = $props();

	const ogUrl = $derived(
		`${page.url.origin}/og?title=${encodeURIComponent(data.metadata.title)}&description=${encodeURIComponent(data.metadata.description)}`
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
