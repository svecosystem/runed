<script lang="ts">
	import { IsDocumentVisible } from "runed";
	import { DemoContainer } from "@svecodocs/kit";

	const visible = new IsDocumentVisible();

	// Count how many times visibility transitioned from hidden -> visible
	let becameVisibleCount = $state(0);
	let last: boolean | undefined = $state(undefined);

	$effect(() => {
		const current = visible.current;
		if (last !== undefined && last === false && current === true) {
			becameVisibleCount++;
		}
		last = current;
	});
</script>

<DemoContainer>
	<p>Document visible: <b>{visible.current ? "true" : "false"}</b></p>
	<p>Became visible count: <b>{becameVisibleCount}</b></p>
</DemoContainer>
