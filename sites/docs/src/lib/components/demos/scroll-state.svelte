<script lang="ts">
	import { Button, Input, Label } from "@svecodocs/kit";
	import { ScrollState } from "runed";
	import { preventDefault } from "svelte/legacy";

	let el = $state<HTMLElement>();
	let behavior = $state("smooth");
	const scroll = new ScrollState({
		element: () => el,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- for some reason ScrollBehavior is not defined
		behavior: () => behavior as any,
	});

	let x = $derived(scroll.x);
	let y = $derived(scroll.y);
</script>

<div
	class=" dark:bg-primary bg-background dark:ring-primary-hover dark:inset-shadow-muted/20 dark:inset-ring-muted/10 inset-ring-muted/20 ring-muted inset-shadow-muted/20 inset-ring inset-shadow-sm relative mb-4 mt-6 max-w-[760px] overflow-hidden rounded-xl ring"
>
	<!-- we can ditch these if you completely hate them if not remove this comment lol -->
	<div class="bg-background border-border absolute left-0 top-0 h-4 w-full border-b">
		<div class="relative w-full">
			<div class="h-4 bg-[#F64A00]" style="width: {scroll.progress.y}%;"></div>
		</div>
	</div>
	<div class="bg-background border-border absolute left-0 top-0 h-full w-4 border-b">
		<div class="relative h-full">
			<div class="w-4 bg-[#F64A00]" style="height: {scroll.progress.x}%;"></div>
		</div>
	</div>
	<div class="h-[800px] overflow-scroll" bind:this={el}>
		<div class="pattern size-[1200px]"></div>
	</div>
	<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold">
		Scroll me
	</div>
	<div class="bg-muted absolute inset-4 !top-[unset] rounded-lg p-4">
		<h2 class="font-bold">Controls & State</h2>
		<div class="mt-2 flex items-center gap-2">
			<form class="flex flex-col gap-2" onsubmit={preventDefault(() => (scroll.x = x))}>
				<Label for="x">X Position</Label>
				<div class="flex items-center gap-2">
					<Input bind:value={x} type="number" id="x" />
					<Button disabled={x === scroll.x} type="submit">Set</Button>
				</div>
			</form>
			<form class="flex flex-col gap-2" onsubmit={preventDefault(() => (scroll.y = y))}>
				<Label for="x">Y Position</Label>
				<div class="flex items-center gap-2">
					<Input bind:value={y} type="number" id="y" />
					<Button disabled={y === scroll.y} type="submit">Set</Button>
				</div>
			</form>
		</div>
		{#snippet info(label: string, condition: boolean)}
			<div class="flex items-baseline gap-2">
				<span class="text-sm font-medium leading-none">{label}</span>
				<span
					class={[
						"rounded-lg px-1.5 py-0.5  text-xs text-white ",
						condition ? "bg-emerald-700" : "bg-red-900",
					]}
				>
					{condition ? "Yes" : "No"}
				</span>
			</div>
		{/snippet}

		<div class="mt-4 grid grid-cols-5 items-center gap-4">
			<Label class="flex items-center gap-2">
				<span>Smooth Scroll</span>
				<input
					type="checkbox"
					bind:checked={() => behavior === "smooth", (c) => (behavior = c ? "smooth" : "instant")}
				/>
			</Label>
			{@render info("isScrolling", scroll.isScrolling)}
		</div>

		<hr class="border-foreground/10 mt-2 h-px border" />

		<h3 class="mt-2 text-sm font-semibold">Progress</h3>
		<div class="mt-2 grid grid-cols-5 items-center gap-4">
			<div class="flex place-items-center gap-2">
				<span class="text-sm font-medium leading-none">x</span>
				<span class="text-xs text-white">{scroll.progress.x.toFixed(0)}%</span>
			</div>
			<div class="flex place-items-center gap-2">
				<span class="text-sm font-medium leading-none">y</span>
				<span class="text-xs text-white">{scroll.progress.y.toFixed(0)}%</span>
			</div>
		</div>

		<hr class="border-foreground/10 mt-2 h-px border" />

		<h3 class="mt-2 text-sm font-semibold">Arrived</h3>
		<div class="mt-2 grid grid-cols-5 items-center gap-4">
			{@render info("top", scroll.arrived.top)}
			{@render info("right", scroll.arrived.right)}
			{@render info("bottom", scroll.arrived.bottom)}
			{@render info("left", scroll.arrived.left)}
		</div>

		<hr class="border-foreground/10 mt-2 h-px border" />
		<h3 class="mt-2 text-sm font-semibold">Directions</h3>
		<div class="mt-2 grid grid-cols-5 items-center gap-4">
			{@render info("top", scroll.directions.top)}
			{@render info("right", scroll.directions.right)}
			{@render info("bottom", scroll.directions.bottom)}
			{@render info("left", scroll.directions.left)}
		</div>
	</div>
</div>

<style>
	.pattern {
		--bg: transparent;
		--fg: #00000010;
		--size: 1.5px;

		background-color: var(--bg);
		background-image:
			radial-gradient(var(--fg) var(--size), transparent var(--size)),
			radial-gradient(var(--fg) var(--size), var(--bg) var(--size));
		background-size: 20px 20px;
		background-position:
			0 0,
			10px 10px;
	}

	:global(html.dark) .pattern {
		--bg: transparent;
		--fg: #ffffff20;
	}
</style>
