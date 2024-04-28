<script lang="ts">
	import { box, useStateHistory } from "runed";

	let count = $state(0);
	const history = useStateHistory(
		box.with(
			() => count,
			(c) => (count = c)
		),
		{ capacity: 10 }
	);

	function format(ts: number) {
		return new Date(ts).toLocaleString();
	}
</script>

<p>{count}</p>
<div class="flex items-center gap-2">
	<button
		class="inline-flex items-center justify-center rounded-md border bg-brand/50
		px-3 py-1.5 text-sm font-medium transition-all hover:bg-brand/25 focus:outline-none active:bg-brand/15"
		onclick={() => count++}>Increment</button
	>
	<button
		class="inline-flex items-center justify-center rounded-md border bg-brand/50
		px-3 py-1.5 text-sm font-medium transition-all hover:bg-brand/25 focus:outline-none active:bg-brand/15"
		onclick={() => count--}>Decrement</button
	>
	/
	<button
		class="inline-flex items-center justify-center rounded-md border bg-brand/50 px-3
		py-1.5 text-sm font-medium transition-all hover:bg-brand/25 focus:outline-none active:bg-brand/15 disabled:bg-neutral-800 disabled:text-neutral-400"
		disabled={!history.canUndo}
		onclick={history.undo}>Undo</button
	>
	<button
		class="inline-flex items-center justify-center rounded-md border bg-brand/50 px-3
		py-1.5 text-sm font-medium transition-all hover:bg-brand/25 focus:outline-none active:bg-brand/15 disabled:bg-neutral-800 disabled:text-neutral-400"
		disabled={!history.canRedo}
		onclick={history.redo}>Redo</button
	>
</div>

{#each history.log as event}
	<div class="flex items-center gap-4">
		<span class="font-mono opacity-50">{format(event.timestamp)}</span>
		<span>{`{ value: ${event.snapshot} }`}</span>
	</div>
{/each}
