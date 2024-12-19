<script lang="ts">
	import { PersistedState } from "runed";
	import { Button, DemoContainer } from "@svecodocs/kit";

	const count = new PersistedState("persisted-state-demo-count", 0);
</script>

<DemoContainer class="flex flex-col gap-4">
	<div class="flex items-center gap-3">
		<Button variant="brand" size="sm" onclick={() => count.current++}>Increment</Button>
		<Button variant="brand" size="sm" onclick={() => count.current--}>Decrement</Button>
		<Button variant="ghost" size="sm" onclick={() => (count.current = 0)}>Reset</Button>
	</div>
	<pre class="bg-transparent p-0 font-mono">Count: {`${count.current}`}</pre>
</DemoContainer>
