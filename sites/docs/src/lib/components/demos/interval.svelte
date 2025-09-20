<script lang="ts">
	import { Interval } from "runed";
	import { Input, Label, Button, DemoContainer } from "@svecodocs/kit";

	let intervalMs = $state(500);
	let message = $state("");

	const interval = new Interval(() => intervalMs, {
		callback: (count) => {
			message = `Tick ${count} at ${new Date().toLocaleTimeString()}`;
		},
	});
</script>

<DemoContainer class="flex flex-col gap-6">
	<div class="flex flex-col gap-2.5">
		<Label for="interval">Interval duration (ms)</Label>
		<Input id="interval" type="number" bind:value={intervalMs} min="100" step="100" />
	</div>

	<div class="flex items-center gap-4">
		<Button variant="brand" size="sm" onclick={() => interval.pause()} disabled={!interval.isActive}
			>Pause</Button
		>
		<Button variant="brand" size="sm" onclick={() => interval.resume()} disabled={interval.isActive}
			>Resume</Button
		>
		<Button variant="ghost" size="sm" onclick={() => interval.reset()}>Reset Counter</Button>
	</div>

	<div class="flex flex-col gap-2">
		<p><strong>Counter:</strong> {interval.counter}</p>
		<p><strong>Status:</strong> {interval.isActive ? "Running" : "Paused"}</p>
		{#if message}
			<p><strong>Last tick:</strong> {message}</p>
		{/if}
	</div>
</DemoContainer>
