<script lang="ts">
	import { usePrevious } from "runed";

	let count = $state(0);
	const previous = usePrevious(() => count);
</script>

<div class="rounded-md bg-card p-8">
	<button
		class="inline-flex items-center justify-center rounded-md border bg-brand/50
px-3 py-1.5 text-sm font-medium transition-all hover:bg-brand/25 focus:outline-none active:bg-brand/15"
		onclick={() => count++}>Count: {count}</button
	>

	<pre class="m-0 mt-4 bg-transparent p-0 font-mono">Previous: {`${previous.value}`}</pre>
</div>
