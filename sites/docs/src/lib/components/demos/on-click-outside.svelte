<script lang="ts">
	import { Button, DemoContainer } from "@svecodocs/kit";
	import { onClickOutside } from "runed";

	let containerText = $state("Has not clicked outside yet.");
	let container = $state<HTMLElement>()!;

	onClickOutside(
		() => container,
		() => {
			containerText = "Has clicked outside.";
		}
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
		<Button size="sm" onclick={() => (containerText = "Has clicked within container")}>
			Reset
		</Button>
	</div>
</DemoContainer>
