<script lang="ts">
	import { Persisted } from "runed";
	import Button from "$lib/components/ui/button/button.svelte";
	import DemoContainer from "$lib/components/demo-container.svelte";
	import Callout from "$lib/components/callout.svelte";

	const count = new Persisted("persisted-state-demo-count", 0);
</script>

<DemoContainer>
	<Button variant="brand" size="sm" onclick={() => count.current++}>Increment</Button>
	<Button variant="brand" size="sm" onclick={() => count.current--}>Decrement</Button>
	<Button variant="subtle" size="sm" onclick={() => (count.current = 0)}>Reset</Button>
	<pre class="my-4 bg-transparent p-0 font-mono">Count: {`${count.current}`}</pre>

	<Callout>
		You can refresh this page and/or open it in another tab to see the count state being persisted
		and synchronized across sessions and tabs.
	</Callout>
</DemoContainer>
