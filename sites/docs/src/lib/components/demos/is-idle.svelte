<script lang="ts">
	import { AnimationFrames, IsIdle } from "runed";
	import DemoContainer from "../demo-container.svelte";
	import { cn } from "$lib/utils";

	const idle = new IsIdle({ timeout: 1000 });
	let now = $state(Date.now());
	new AnimationFrames(() => {
		now = Date.now();
	});

	const secondsElapsed = $derived(Math.floor((now - idle.lastActive) / 1000));
</script>

<DemoContainer>
	<p>Idle: <b class={cn(idle.current ? "text-green-600" : "text-red-300")}>{idle.current}</b></p>
	<p>
		Last active: <b>{secondsElapsed}s ago</b>
	</p>
</DemoContainer>
<p class="text-right text-xs opacity-50 mb-0" >
	By default, the time of inactivity before marking the user as idle is 1 minute.
</p>
<p class="text-right text-xs opacity-50 mt-1.5">
	In this demo, it's 1 second.
</p>
