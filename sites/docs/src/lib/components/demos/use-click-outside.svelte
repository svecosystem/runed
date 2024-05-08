<script lang="ts">
	import { box, useClickOutside } from "runed";

	let containerText = "Has not clicked yet";

	const container = box<HTMLDivElement | null>(null);

	useClickOutside(container, () => {
		containerText = "Has clicked outside of container";
	});
</script>

<main>
	<div bind:this={container.value}>
		<p>{containerText}</p>

		<button onclick={() => (containerText = "Has clicked within container")}>
			Button within container
		</button>
	</div>
	<button>Button outside container</button>
</main>

<style>
	div {
		padding: 40px;
		border: 1px solid;
		margin-bottom: 16px;
	}

	button {
		border: 1px solid;
		padding-inline: 8px;
	}
</style>
