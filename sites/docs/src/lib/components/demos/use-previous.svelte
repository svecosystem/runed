<script lang="ts">
	import { usePrevious } from "runed";

	let count = $state(0);
	const previous = usePrevious(() => count);
</script>

<div class="rounded-md bg-card p-8">
	<button
		class="bg-brand-btn hover:bg-brand-btn/80 inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-all focus:outline-none active:bg-brand/60"
		onclick={() => count++}>Count: {count}</button
	>

	<pre
		class="m-0 mt-4 bg-transparent p-0 font-mono text-foreground">Previous: {`${previous.value}`}</pre>
</div>
