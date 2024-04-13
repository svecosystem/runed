<script lang="ts">
	import { useEventListener } from "runed";

	let count = $state(0);

	$effect(() => {
		useEventListener(document, "click", () => count++);
	});
</script>

<div class="rounded-md bg-card p-8">
	<p>You've clicked {count} {count === 1 ? "Time" : "Times"}</p>
</div>
