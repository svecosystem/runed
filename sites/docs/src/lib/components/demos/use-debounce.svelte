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
	<Button variant="brand" size="sm" onclick={ding}>DING DING DING</Button>
	<p>{logged || "Press the button!"}</p>
</DemoContainer>
