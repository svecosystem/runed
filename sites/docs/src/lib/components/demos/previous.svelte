<script lang="ts">
	import { Previous } from "runed";
	import DemoContainer from "$lib/components/demo-container.svelte";

	let count = $state(0);
	const previous = new Previous(() => count);
</script>

<DemoContainer>
	<button
		class="inline-flex items-center justify-center rounded-md border bg-brand/50 px-3 py-1.5 text-sm font-medium transition-all hover:bg-brand/25 focus:outline-none active:bg-brand/15"
		onclick={() => count++}
	>
		Count: {count}
	</button>

	<pre class="m-0 mt-4 bg-transparent p-0 font-mono">Previous: {`${previous.current}`}</pre>
</DemoContainer>
