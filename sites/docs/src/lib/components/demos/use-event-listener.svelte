<script lang="ts">
	import { useEventListener } from "runed";
	import { DemoContainer } from "@svecodocs/kit";

	let count = $state(0);
	useEventListener(
		() => document.body,
		"click",
		() => count++
	);
</script>

<DemoContainer class="select-none">
	<p>You've clicked the document {count} {count === 1 ? "time" : "times"}</p>
</DemoContainer>
