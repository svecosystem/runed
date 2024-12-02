<script lang="ts">
	import { useIntersectionObserver } from "runed";
	import { Checkbox, Label, DemoContainer } from "@svecodocs/kit";

	let root = $state<HTMLElement>(null!);
	let target = $state<HTMLElement>(null!);

	let isVisible = $state(false);

	const observer = useIntersectionObserver(
		() => target,
		([entry]) => {
			if (entry) {
				isVisible = entry.isIntersecting;
			} else {
				isVisible = false;
			}
		},
		{
			root: () => root,
		}
	);
</script>

<DemoContainer class="flex flex-col gap-4 text-center">
	<div class="flex items-center justify-center">
		<Checkbox
			id="enabled"
			checked={observer.isActive}
			onCheckedChange={(v) => {
				if (v) {
					observer.resume();
				} else {
					observer.pause();
				}
			}}
		/>
		<Label for="enabled" class="pl-2">Enable</Label>
	</div>
	<div
		bind:this={root}
		class="border-border m-2 h-[200px] overflow-y-scroll border-2 border-dashed pt-4"
	>
		<p class="text-lg italic">Scroll down 👇</p>
		<div bind:this={target} class="border-brand m-6 mt-96 max-h-[150px] border-2 p-2.5">
			<p>I'm the target! 🎯</p>
		</div>
	</div>
	<div class="text-center">
		Element
		<span
			class="font-medium {isVisible ? 'text-green-600 dark:text-green-500' : 'text-destructive'}"
		>
			{isVisible ? "inside" : "outside"}
		</span>
		the viewport
	</div>
</DemoContainer>
