<script lang="ts">
	import { IsHovered } from "runed";

	let el = $state<HTMLElement>();

	const isHovered = new IsHovered(() => el);
</script>

<div data-testid="hover-target" bind:this={el}>
	{isHovered.current ? "true" : "false"}
</div>
