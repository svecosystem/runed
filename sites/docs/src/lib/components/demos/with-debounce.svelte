<script lang="ts">
	import { withDebounce } from "withrunes";

	let count = $state(0);
	let logged = $state("");
	let isFirstTime = $state(true);

	const logCount = withDebounce(() => {
		if (isFirstTime) {
			isFirstTime = false;
			logged = `You pressed the button ${count} times!`;
		} else {
			logged = `You pressed the button ${count} times since last time!`;
		}
		count = 0;
	}, 1000);

	function ding() {
		count++;
		logCount();
	}
</script>

<div class="bg-card rounded-md p-8">
	<button
		class="bg-brand/50 hover:bg-brand/25 relative z-20 inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium transition-all focus:outline-none"
		onclick={ding}>DING DING DING</button
	>
	<p>{logged || "Press the button!"}</p>
</div>
