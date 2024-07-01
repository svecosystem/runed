<script lang="ts">
	import { useDebounce } from "runed";
	import DemoContainer from "$lib/components/demo-container.svelte";
	import { Button } from "$lib/components/ui/button";

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

<DemoContainer>
	<div class="flex items-center gap-4">
		<Button variant="brand" size="sm" onclick={ding}>DING DING DING</Button>
		<Button variant="subtle" size="sm" onclick={logCount.cancel} disabled={!logCount.pending}
			>Cancel message</Button
		>
	</div>
	<p class="mt-4">{logged || "Press the button!"}</p>
</DemoContainer>
