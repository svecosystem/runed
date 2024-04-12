<script lang="ts">
	import { getTabsCtx } from "./index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";

	const { items } = getTabsCtx();

	export let label: string;

	items.update((prev) => {
		prev.push(label);
		return prev;
	});
</script>

<Tabs.Content
	value={label}
	class="relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-semibold"
>
	<slot />
</Tabs.Content>
