<script lang="ts">
	import { Button, DemoContainer } from "@svecodocs/kit";
	import { onClickOutside } from "runed";

	let containerText = $state("Has not clicked outside yet.");
	let container = $state<HTMLElement>()!;

	const clickOutside = onClickOutside(
		() => container,
		() => (containerText = "Clicked outside!")
	);
</script>

<DemoContainer>
	<div bind:this={container} class="border-foreground relative mb-4 rounded-lg border p-4">
		<span
			class="bg-foreground text-background absolute right-0 top-0 select-none rounded-bl-md rounded-tr-md px-2.5 py-1 font-mono text-xs"
		>
			container
		</span>
		<p class="select-none pb-4">{containerText}</p>
		<p class="mb-3 font-mono">
			Status: <span class={clickOutside.enabled ? "text-green-500" : "text-destructive"}
				>{clickOutside.enabled ? "Enabled" : "Disabled"}</span
			>
		</p>
		<div class="flex items-center gap-3">
			<Button disabled={clickOutside.enabled} size="sm" onclick={clickOutside.start}>Start</Button>
			<Button disabled={!clickOutside.enabled} size="sm" onclick={clickOutside.stop}>Stop</Button>
			<Button size="sm" onclick={() => (containerText = "Has not clicked outside yet.")}>
				Reset
			</Button>
		</div>
	</div>
</DemoContainer>
