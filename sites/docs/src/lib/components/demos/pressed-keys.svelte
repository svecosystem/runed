<script lang="ts">
	import { PressedKeys } from "runed";
	import { cubicOut } from "svelte/easing";
	import RunedIcon from "$lib/components/logos/runed-icon.svelte";

	const keys = new PressedKeys();
	const toPress = "Runed".split("");
	const allPressed = $derived(keys.pressed(...toPress));

	let guessedCorrectly = $state(false);
	$effect(() => {
		if (allPressed) {
			guessedCorrectly = true;
		}
	});

	function blur(
		node: HTMLElement,
		{ delay = 0, duration = 300, start = 0, opacity = 0, maxBlur = 16 } = {}
	) {
		const style = getComputedStyle(node);
		const target_opacity = +style.opacity;
		const transform = style.transform === "none" ? "" : style.transform;
		const sd = 1 - start; // Scale delta
		const od = target_opacity * (1 - opacity); // Opacity delta

		return {
			delay,
			duration,
			easing: cubicOut,
			css: (_t: number, u: number) => `
            transform: ${transform} scale(${1 - sd * u});
            opacity: ${target_opacity - od * u};
            filter: blur(${maxBlur * u}px);
        `,
		};
	}
</script>

<div class="rounded-md bg-card p-8">
	<div class="relative mx-auto flex w-min items-center justify-center gap-2">
		{#if allPressed}
			<div
				transition:blur={{ start: 0.75 }}
				class="absolute left-0 top-1/2 -translate-y-1/2 translate-x-[calc(-100%-0.5rem)]"
			>
				<RunedIcon class="size-11 " />
			</div>
		{/if}
		{#each toPress as key}
			<div
				class="grid size-12 place-items-center rounded-lg border transition-all duration-200
				{allPressed ? 'border-brand' : 'border-border'} bg-background"
			>
				<span
					class="duration-250 text-xl font-bold text-foreground transition-all
					{keys.pressed(key) ? '' : 'opacity-0'}"
				>
					{key}
				</span>
			</div>
		{/each}
	</div>
	<p class="text-center">{guessedCorrectly ? 'You did it! 🎉' : 'Try and guess the password 👀'} </p>
</div>
