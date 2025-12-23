<script lang="ts">
	import { useFullscreen } from "runed";
	import { DemoContainer, Button } from "@svecodocs/kit";

	const fullscreen = useFullscreen();
</script>

<DemoContainer class="flex flex-col gap-1">
	<pre>Is Supported: {fullscreen.isSupported}</pre>
	<pre>Is Fullscreen: {fullscreen.isFullscreen}</pre>
	<div class="mt-4 flex items-center gap-2">
		<Button
			size="sm"
			onclick={fullscreen.enter}
			disabled={!fullscreen.isSupported || fullscreen.isFullscreen}>Enter Fullscreen</Button
		>
		<Button
			size="sm"
			onclick={fullscreen.exit}
			disabled={!fullscreen.isSupported || !fullscreen.isFullscreen}>Exit Fullscreen</Button
		>
		<Button size="sm" onclick={fullscreen.toggle} disabled={!fullscreen.isSupported}
			>Toggle Fullscreen</Button
		>
	</div>
</DemoContainer>
