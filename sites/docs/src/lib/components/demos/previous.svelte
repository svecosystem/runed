<script lang="ts">
	import { Previous } from "runed";
	import Button from "$lib/components/ui/button/button.svelte";
	import DemoContainer from "$lib/components/demo-container.svelte";

	let count = $state(0);
	const previous = new Previous(() => count);
</script>

<DemoContainer>
	<Button variant="brand" onclick={() => count++}>
		Count: {count}
	</Button>

	<pre class="m-0 mt-4 bg-transparent p-0 font-mono">Previous: {`${previous.current}`}</pre>
</DemoContainer>
