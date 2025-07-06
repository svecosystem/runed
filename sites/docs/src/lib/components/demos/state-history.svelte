<script lang="ts">
	import { StateHistory } from "runed";
	import { Button, DemoContainer } from "@svecodocs/kit";

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
	<p class="mt-0">Count: {count}</p>
	<div class="flex items-center gap-2">
		<Button size="sm" variant="brand" onclick={() => count++}>Increment</Button>
		<Button size="sm" variant="brand" onclick={() => count--}>Decrement</Button>
		<span class="px-2"> / </span>
		<Button size="sm" variant="ghost" disabled={!history.canUndo} onclick={history.undo}>
			Undo
		</Button>
		<Button size="sm" variant="ghost" disabled={!history.canRedo} onclick={history.redo}>
			Redo
		</Button>
	</div>

	<div class="mt-4">
		<p class="text-muted-foreground m-0 select-none">History (limited to 10 records for demo)</p>
		<div class="bg-background-secondary mt-2 rounded-md border px-3 py-2">
			{#each history.log.toReversed() as event, i (`${event}-${i}`)}
				<div class="flex items-center gap-4 font-mono">
					<span class="text-muted-foreground/75">{format(event.timestamp)}</span>
					<span>{`{ value: ${event.snapshot} }`}</span>
				</div>
			{/each}
		</div>
	</div>
</DemoContainer>
