<script lang="ts">
	import { DocPage } from "@svecodocs/kit";
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.metadata.title}</title>
	<meta name="description" content={data.metadata.description} />
</svelte:head>
<DocPage component={data.component} {...data.metadata} />
