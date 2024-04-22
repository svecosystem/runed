<script lang="ts">
	import { useEventListener } from "runed";

	let count = $state(0);
	function increment() {
		count++;
	}

	let wrapper = $state<HTMLElement>();
	useEventListener(() => wrapper, "click", increment);
</script>

<div class="select-none rounded-md bg-card p-8" bind:this={wrapper}>
	<p>You've clicked {count} {count === 1 ? "time" : "times"}</p>
</div>
