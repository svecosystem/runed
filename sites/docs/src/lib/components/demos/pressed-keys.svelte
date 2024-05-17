<script lang="ts">
	import { PressedKeys } from "runed";

	const keys = new PressedKeys();
</script>

{#each "abcdefgh".split("") as key}
	<p>{key} pressed: {keys.pressed(key)}</p>
{/each}
