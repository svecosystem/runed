<script lang="ts">
	import { AnimationFrames, IsIdle } from "runed";
	import { DemoContainer } from "@svecodocs/kit";
	import DemoNote from "../demo-note.svelte";

	const idle = new IsIdle({ timeout: 1000 });
	let now = $state(Date.now());
	new AnimationFrames(() => {
		now = Date.now();
	});

	const secondsElapsed = $derived(Math.floor((now - idle.lastActive) / 1000));
</script>

<DemoContainer class="flex flex-col gap-3">
	<p>
		Idle: <span
			class="font-medium {idle.current ? 'text-green-600 dark:text-green-500' : 'text-destructive'}"
			>{idle.current}</span
		>
	</p>
	<p>
		Last active: <span class="font-medium">{secondsElapsed}s ago</span>
	</p>
</DemoContainer>
<DemoNote>
	<p>By default, the time of inactivity before marking the user as idle is 1 minute.</p>
	<p>In this demo, it's 1 second.</p>
</DemoNote>
