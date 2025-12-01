<script lang="ts">
	import { usePrefersDark } from "runed";
	import { DemoContainer } from "@svecodocs/kit";

	const darkMode = usePrefersDark();

	// Track how many times the preference changed
	let changeCount = $state(0);
	let last: boolean | undefined = $state(undefined);

	$effect(() => {
		const current = darkMode.current;
		if (last !== undefined && last !== current) {
			changeCount++;
		}
		last = current;
	});
</script>

<DemoContainer>
	<p>Dark mode preferred: <b>{darkMode.current ? "true" : "false"}</b></p>
	<p>Preference changes: <b>{changeCount}</b></p>
	<p class="hint">Try changing your system dark mode preference to see this update!</p>
</DemoContainer>

<style>
	.hint {
		font-size: 0.875rem;
		opacity: 0.8;
		margin-top: 0.5rem;
	}
</style>
