<script lang="ts">
	import { FiniteStateMachine } from "runed";
	import { DemoContainer, Button, Switch } from "@svecodocs/kit";
	import Play from "phosphor-svelte/lib/Play";
	import Pause from "phosphor-svelte/lib/Pause";

	type myStates = "disabled" | "idle" | "running";
	type myEvents = "toggleEnabled" | "start" | "stop";
	const f = new FiniteStateMachine<myStates, myEvents>("disabled", {
		disabled: {
			toggleEnabled: "idle",
		},
		idle: {
			toggleEnabled: "disabled",
			start: "running",
		},
		running: {
			_enter: () => {
				f.debounce(2000, "stop");
			},
			stop: "idle",
			toggleEnabled: "disabled",
		},
	});
	const descriptionText = $derived.by(() => {
		switch (f.current) {
			case "disabled":
				return "Toggle the switch to enable.";
			case "idle":
				return "Click the Run button to run for two seconds.";
			case "running":
				return "Running for two seconds. Click the Stop button or toggle the switch.";
		}
	});
</script>

<DemoContainer class="flex flex-col gap-4">
	<h1 class="text-xl font-bold">
		Now: <code>{f.current}</code>
	</h1>
	<p>{descriptionText}</p>
	<div class="flex items-center gap-4">
		<Switch
			class="mt-0.5"
			checked={f.current !== "disabled"}
			onCheckedChange={() => f.send("toggleEnabled")}
		/>
		<Button
			variant="brand"
			size="sm"
			disabled={f.current === "disabled"}
			onclick={() => (f.current === "running" ? f.send("stop") : f.send("start"))}
			class="gap-2"
		>
			{#if f.current === "running"}
				<Pause size={16} weight="fill" /> Stop
			{:else}
				<Play size={16} weight="fill" /> Run
			{/if}
		</Button>

		{#if f.current === "running"}
			<div class="bg-muted relative h-6 w-40 overflow-clip rounded-md">
				<div class="progress bg-brand absolute h-full w-full"></div>
			</div>
		{/if}
	</div>
</DemoContainer>

<style lang="postcss">
	.progress {
		animation: 2s linear progressAnimation;
	}
	@keyframes progressAnimation {
		0% {
			right: 100%;
		}
		100% {
			right: 0;
		}
	}
</style>
