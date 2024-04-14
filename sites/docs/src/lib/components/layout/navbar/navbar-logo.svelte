<script lang="ts">
	import RunedLight from "$lib/components/logos/runed-light.svelte";
	import RunedDark from "$lib/components/logos/runed-dark.svelte";
</script>

<div class="flex items-center gap-1.5 lg:flex-1">
	<a
		href="/"
		class="flex flex-shrink-0 items-end gap-1.5 text-xl font-bold text-gray-900 dark:text-white"
	>
		<RunedLight class="block h-7 w-auto dark:hidden" />
		<RunedDark class="hidden h-7 w-auto dark:block" />
		<span class="sr-only"> Home </span>
	</a>
</div>
