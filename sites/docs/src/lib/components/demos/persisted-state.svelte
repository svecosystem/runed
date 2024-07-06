<script lang="ts">
	import { PersistedState } from "runed";

	import Button from "$lib/components/ui/button/button.svelte";
	import DemoContainer from "$lib/components/demo-container.svelte";

	const count = new PersistedState("persisted-state-demo-count", 0);
</script>

<DemoContainer>
	<Button variant="brand" size="sm" onclick={() => count.current++}>count.current++</Button>
	<pre class="my-4 bg-transparent p-0 font-mono">count.current: {`${count.current}`}</pre>
</DemoContainer>
