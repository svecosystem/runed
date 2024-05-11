<script lang="ts">
	import { useEventListener } from "runed";

	let count = $state(0);
	useEventListener(document.body, "click", () => count++);
</script>

<div class="select-none rounded-md bg-card p-8">
	<p>You've clicked the document {count} {count === 1 ? "time" : "times"}</p>
</div>
