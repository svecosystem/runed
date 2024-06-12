<script lang="ts">
	import { StateHistory } from "runed";
	import Button from "$lib/components/ui/button/button.svelte";
	import DemoContainer from "$lib/components/demo-container.svelte";

	let count = $state(0);
	const history = new StateHistory(
		() => count,
		(c) => (count = c),
		{ capacity: 10 }
	);

	function format(ts: number) {
		return new Date(ts).toLocaleString();
	}
</script>

<DemoContainer class="flex flex-col gap-4">
	<p class="mt-0">{count}</p>
	<div class="flex items-center gap-2">
		<Button size="sm" variant="brand" onclick={() => count++}>Increment</Button>
		<Button size="sm" variant="brand" onclick={() => count--}>Decrement</Button>
		<span class="px-2"> / </span>
		<Button size="sm" variant="subtle" disabled={!history.canUndo} onclick={history.undo}>
			Undo
		</Button>
		<Button size="sm" variant="subtle" disabled={!history.canRedo} onclick={history.redo}>
			Redo
		</Button>
	</div>

	<div class="mt-4">
		<p class="m-0 opacity-75">History (limited to 10 records for demo)</p>
		<div class="mt-2 rounded-md border bg-background p-2">
			{#each history.log.toReversed() as event}
				<div class="flex items-center gap-4">
					<span class="font-mono opacity-50">{format(event.timestamp)}</span>
					<span>{`{ value: ${event.snapshot} }`}</span>
				</div>
			{/each}
		</div>
	</div>
</DemoContainer>
