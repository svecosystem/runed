<script lang="ts">
	import { AnimationFrames } from "runed";

	let frames = $state(0);
	let fpsLimit = $state(60);
	let delta = $state(0);
	const animation = new AnimationFrames(
		(args) => {
			frames++;
			delta = args.delta;
		},
		{ fpsLimit: () => fpsLimit }
	);
</script>

<div class="rounded-md bg-card p-8">
	<p>Frames: {frames}</p>
	<p>FPS: {animation.fps.toFixed(0)}</p>
	<p>Delta: {delta.toFixed(0)}</p>
	<button onclick={() => (animation.running = !animation.running)}>
		{animation.running ? "Stop" : "Start"}
	</button>
	<br />
	<label for="fpsLimit">FPS limit (0 to remove limits)</label>
	<input type="range" min="0" max="60" name="fpsLimit" bind:value={fpsLimit} />
</div>
