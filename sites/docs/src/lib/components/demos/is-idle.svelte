<script lang="ts">
	import { AnimationFrames, IsIdle } from "runed";
	import DemoContainer from "../demo-container.svelte";

	const idle = new IsIdle({ timeout: 1000 });
	let now = $state(Date.now());
	// eslint-disable-next-line no-new
	new AnimationFrames(() => {
		now = Date.now();
	});

	const secondsElapsed = $derived(Math.floor((now - idle.lastActive) / 1000));
</script>

<DemoContainer>
	<p>
		Idle: <b class={idle.current ? "text-success" : "text-destructive"}>{idle.current}</b>
	</p>
	<p>
		Last active: <b>{secondsElapsed}s ago</b>
	</p>
</DemoContainer>
<p class="mb-0 text-right text-xs opacity-50">
	By default, the time of inactivity before marking the user as idle is 1 minute.
</p>
<p class="mt-1.5 text-right text-xs opacity-50">In this demo, it's 1 second.</p>
