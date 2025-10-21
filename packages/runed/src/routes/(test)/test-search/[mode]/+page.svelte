<script lang="ts">
	import { page } from "$app/state";
	import {
		createSearchParamsSchema,
		useSearchParams,
		type SearchParamsOptions,
	} from "$lib/utilities/use-search-params/use-search-params.svelte";
	const mode = page.params.mode;

	const schema = createSearchParamsSchema({
		page: { type: "number", default: 1 },
		filter: { type: "string", default: "" },
		createdAt: { type: "date", default: new Date("2023-01-01T00:00:00Z") },
	});

	const options: SearchParamsOptions = {
		...(mode === "default" && {}),
		...(mode === "show-default" && { showDefaults: true }),
		...(mode === "nopush" && { pushHistory: false }),
		...(mode === "debounce" && { debounce: 200 }),
		...(mode === "compress" && { compress: true }),
		...(mode === "memory" && { updateURL: false }),
		...(mode === "no-scroll" && { noScroll: true }),
	};

	const paramsObj = useSearchParams(schema, options);

	function inc() {
		paramsObj.page += 1;
	}
	function resetParams() {
		paramsObj.reset();
	}
	function setBoth() {
		paramsObj.update({ page: 5, filter: "bar" });
	}
	function setDate() {
		paramsObj.createdAt = new Date("2023-06-15T10:30:00Z");
	}

	// Create a derived value to avoid potential infinite loops
	let createdAtString = $derived(
		paramsObj.createdAt instanceof Date ? paramsObj.createdAt.toISOString() : "Invalid Date"
	);
</script>

<input data-testid="filter-input" bind:value={paramsObj.filter} />
<button data-testid="inc" onclick={inc}>Inc</button>
<button data-testid="reset" onclick={resetParams}>Reset</button>
<button data-testid="setBoth" onclick={setBoth}>Set both</button>
<button data-testid="setDate" onclick={setDate}>Set date</button>
<span data-testid="page">{paramsObj.page}</span>
<span data-testid="filter">{paramsObj.filter}</span>
<span data-testid="createdAt">{createdAtString}</span>
