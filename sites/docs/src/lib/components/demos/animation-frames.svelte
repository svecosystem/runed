<script lang="ts">
	import { AnimationFrames } from "runed";
	import { Pause, Play } from "phosphor-svelte";
	import { Slider } from "../ui/slider";

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

	const stats = $derived(
		`Frames: ${frames}\nFPS: ${animation.fps.toFixed(0)}\nDelta: ${delta.toFixed(0)}ms`
	);
</script>

<div class="relative flex flex-col items-center gap-4 rounded-md bg-card p-8">
	<pre class="text-mono absolute left-2 top-2 m-0 p-2 text-xs">{stats}</pre>
	<div
		style="
		width: {spriteSize}px;
		height: {spriteSize}px;
		background: url('/mouse_sprite.png');
		background-size: {64 * sheetCols}px {64 * sheetRows}px;
		background-position-x: {-currentCol * 64}px;
		background-position-y: {-currentRow * 64}px;
	"
		aria-label="spinning ghost mouse"
	></div>
	<button
		class="inline-flex items-center justify-center gap-1 rounded-md border bg-brand/50
		px-3 py-1.5 text-sm font-medium transition-all hover:bg-brand/25 focus:outline-none active:bg-brand/15"
		onclick={animation.toggle}
	>
		{#if animation.running}
			<Pause size={16} weight="fill" />
		{:else}
			<Play size={16} weight="fill" />
		{/if}
		{animation.running ? "Stop" : "Start"}
	</button>
	<p class="m-0 text-center text-sm">
		FPS limit: <b>{fpsLimit}</b><i>{fpsLimit === 0 ? " (not limited)" : ""}</i>
	</p>
	<Slider
		class="w-[300px]"
		value={[fpsLimit]}
		onValueChange={(value) => (fpsLimit = value[0] ?? 0)}
		min={0}
		max={144}
	/>
</div>
