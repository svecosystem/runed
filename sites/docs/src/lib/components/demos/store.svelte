<script lang="ts">
	import { Store } from "runed";
	import { writable } from "svelte/store";

	const store = writable(0);
	const runeStore = new Store(store);
</script>

<div class="rounded-md bg-card p-8">
	<button
		class="inline-flex items-center justify-center rounded-md border bg-brand/50
px-3 py-1.5 text-sm font-medium transition-all hover:bg-brand/25 focus:outline-none active:bg-brand/15"
		onclick={() => runeStore.current++}>runeStore.current++</button
	>
	<pre class="my-4 bg-transparent p-0 font-mono">runeStore.current: {`${runeStore.current}`}</pre>
	<button
		class="inline-flex items-center justify-center rounded-md border bg-brand/50
px-3 py-1.5 text-sm font-medium transition-all hover:bg-brand/25 focus:outline-none active:bg-brand/15"
		onclick={() => ($store = $store + 1)}>$store = $store + 1</button
	>
	<pre class="m-0 mt-4 bg-transparent p-0 font-mono">$store: {`${$store}`}</pre>
</div>
