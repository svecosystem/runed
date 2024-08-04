<script lang="ts">
	import { IsHovered } from "runed";
	import Button from "../ui/button/button.svelte";
	import DemoContainer from "$lib/components/demo-container.svelte";

	let el = $state<HTMLElement>();

	const isHovered = new IsHovered(() => el);
</script>

<DemoContainer>
	<span bind:this={el}>
		<Button variant={!isHovered.current ? "brand" : "subtle"}>
			{!isHovered.current ? "Hover me!" : "Unhover me!"}
		</Button>
	</span>

	<p class="mt-2">
		Is hovered: <span class="font-bold text-brand">{isHovered.current ? "true" : "false"}</span>
	</p>
</DemoContainer>
