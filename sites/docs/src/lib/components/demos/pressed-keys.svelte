<script lang="ts">
	import { PressedKeys, watch } from "runed";
	import { fade, scale } from "svelte/transition";
	import RunedIcon from "$lib/components/logos/runed-icon.svelte";
	import DemoContainer from "$lib/components/demo-container.svelte";

	const keys = new PressedKeys();
	const toPress = "Runed".split("");
	const allPressed = $derived(keys.has(...toPress));

	let guessedCorrectly = $state(false);
	$effect(() => {
		if (allPressed) {
			guessedCorrectly = true;
		}
	});

	let triedInputting = $state(false);

	watch(
		() => keys.all,
		() => {
			triedInputting = false;
		}
	);

	$inspect(guessedCorrectly);
</script>

<DemoContainer class="flex flex-col gap-4">
	<div
		class="relative mx-auto flex w-min items-center justify-center gap-2 transition-all duration-300
		{allPressed ? 'translate-x-[1.625rem]' : ''}"
	>
		{#if allPressed}
			<div
				transition:scale={{ start: 0.75, duration: 300 }}
				class="absolute left-0 top-1/2 -translate-y-1/2 translate-x-[calc(-100%-0.5rem)]"
			>
				<RunedIcon class="size-11 " />
			</div>
		{/if}
		{#each toPress as key}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="grid size-12 place-items-center rounded-lg border transition-all duration-200
				{allPressed ? 'border-brand' : 'border-border'} bg-background"
				onclick={() => (triedInputting = true)}
			>
				{#if keys.has(key)}
					<span
						class="duration-250 text-foreground text-xl font-bold transition-all"
						transition:fade={{ duration: 100 }}
					>
						{key}
					</span>
				{/if}
			</div>
		{/each}
	</div>
	<p class="text-center">{guessedCorrectly ? "You did it! 🎉" : "Try and guess the password 👀"}</p>

	{#if !guessedCorrectly && triedInputting}
		<p
			transition:fade={{ duration: 300 }}
			class="text-foreground/50 absolute bottom-2 right-2 mb-0 text-center text-sm"
		>
			Press any key to start, no need to select anything
		</p>
	{/if}
</DemoContainer>
