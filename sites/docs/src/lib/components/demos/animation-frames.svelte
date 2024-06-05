<script lang="ts">
	import { AnimationFrames } from "runed";

	let frames = $state(0);
	let fpsLimit = $state(10);
	let delta = $state(0);
	const animation = new AnimationFrames(
		(args) => {
			frames++;
			delta = args.delta;
		},
		{ fpsLimit: () => fpsLimit }
	);

	const sprites = 10;
	const sheetCols = 3;
	const sheetRows = Math.ceil(sprites / sheetCols);
	const currentSprite = $derived(sprites - 1 - (frames % sprites));
	const currentCol = $derived(currentSprite % sheetCols);
	const currentRow = $derived(Math.floor(currentSprite / sheetCols));
	const spriteSize = 64;
</script>

<div class="rounded-md bg-card p-8">
	<div
		style="
		width: {spriteSize}px;
		height: {spriteSize}px;
		background: url('/bunny_sprite.png');
		background-size: {64 * sheetCols}px {64 * sheetRows}px;
		background-position-x: {-currentCol * 64}px;
		background-position-y: {-currentRow * 64}px;
	"
	></div>
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
