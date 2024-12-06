<script lang="ts">
	import { DocPage } from "@svecodocs/kit";
	let { data } = $props();
</script>

<DocPage component={data.component} {...data.metadata} />
