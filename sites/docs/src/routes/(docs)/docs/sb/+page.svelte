<script>
	import { useSearchParams } from "runed/kit";
	import * as v from "valibot";

	export const clientSearchSchema = v.object({
		search: v.optional(v.fallback(v.string(), ""), ""),
	});

	const params = useSearchParams(clientSearchSchema, {
		debounce: 2000,
		pushHistory: false,
		showDefaults: false,
	});

	let searchInput = $derived(params.search);

	function handleInput(event) {
		const input = event.target;
		params.update({ search: input.value });
	}
</script>

<input type="text" bind:value={params.search} placeholder="Search something" />
<input type="text" bind:value={searchInput} oninput={handleInput} placeholder="Search something" />

Search value:{params.search}
