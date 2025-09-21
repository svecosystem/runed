<script lang="ts">
	import { useInterval } from "runed";
	import { Input, Label, Button, DemoContainer } from "@svecodocs/kit";

	let count = $state(0);
	let intervalMs = $state(500);

	const interval = useInterval(
		() => count++,
		() => intervalMs
	);

	function reset() {
		count = 0;
	}
</script>

<DemoContainer class="flex flex-col gap-6">
	<div class="flex flex-col gap-2.5">
		<Label for="interval">Interval duration (ms)</Label>
		<Input id="interval" type="number" bind:value={intervalMs} min="100" step="100" />
	</div>

	<div class="flex items-center gap-4">
		<Button variant="brand" size="sm" onclick={interval.pause} disabled={!interval.isActive}
			>Pause</Button
		>
		<Button variant="brand" size="sm" onclick={interval.resume} disabled={interval.isActive}
			>Resume</Button
		>
		<Button variant="ghost" size="sm" onclick={reset}>Reset Count</Button>
	</div>

	<div class="flex flex-col gap-2">
		<p><strong>Count:</strong> {count}</p>
		<p><strong>Status:</strong> {interval.isActive ? "Running" : "Paused"}</p>
	</div>
</DemoContainer>
