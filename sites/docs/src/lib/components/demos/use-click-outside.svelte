<script lang="ts">
	import { useClickOutside } from "runed";

	let containerText = $state("Has not clicked yet");
	let el = $state<HTMLDialogElement | undefined>(undefined);

	useClickOutside(
		() => el,
		() => {
			containerText = "Has clicked outside of container";
		}
	);
</script>

<main>
	<dialog open bind:this={el}>
		<p>{containerText}</p>

		<button onclick={() => (containerText = "Has clicked within container")}>
			Button within container
		</button>
	</dialog>
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
