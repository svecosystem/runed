<script lang="ts">
	import { useEventListener } from "runed";

	let count = $state(0);
	function increment() {
		count++;
	}

	useEventListener(() => document, "click", increment);
</script>

<div class="select-none rounded-md bg-card p-8">
	<p>You've clicked {count} {count === 1 ? "Time" : "Times"}</p>
</div>
