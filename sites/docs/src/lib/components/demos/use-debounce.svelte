<script lang="ts">
	import { useDebounce } from "runed";

	let count = $state(0);
	let logged = $state("");
	let isFirstTime = $state(true);

	const logCount = useDebounce(() => {
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

<div class="rounded-md bg-card p-8">
	<button
		class="relative z-20 inline-flex items-center justify-center rounded-md border bg-brand/50 px-3 py-1.5 text-sm font-medium transition-all hover:bg-brand/25 focus:outline-none"
		onclick={ding}>DING DING DING</button
	>
	<p>{logged || "Press the button!"}</p>
</div>
