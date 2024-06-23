<script lang="ts">
	import { Reproduction } from "runed";
	import { Button } from "../ui/button";
	import DemoContainer from "$lib/components/demo-container.svelte";

	const arr = $state<number[]>([]);
	// eslint-disable-next-line no-new
	new Reproduction(() => arr); // this will not log

	class ReproductionLocal {
		constructor(getter: () => unknown) {
			const received = $derived(getter());
			$inspect({ receivedInLocal: received });
		}
	}

	// eslint-disable-next-line no-new
	new ReproductionLocal(() => arr); // this will log
</script>

<DemoContainer>
	<Button onclick={() => arr.push(1)}>Add</Button>
</DemoContainer>
