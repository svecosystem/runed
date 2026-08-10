<script lang="ts">
	import { beforeNavigate } from "$app/navigation";
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
		createdAt: { type: "date", default: new Date("2023-01-01T00:00:00Z"), dateFormat: "date" },
		updatedAt: { type: "date", default: new Date("2023-12-31T23:59:59Z") },
	});

	const options: SearchParamsOptions = {
		...(mode === "default" && {}),
		...(mode === "show-default" && { showDefaults: true }),
		...(mode === "nopush" && { pushHistory: false }),
		...(mode === "debounce" && { debounce: 200 }),
		...(mode === "compress" && { compress: true }),
		...(mode === "memory" && { updateURL: false }),
		...(mode === "no-scroll" && { noScroll: true }),
		...(mode === "date-format-options" && {
			dateFormats: { createdAt: "date", updatedAt: "datetime" },
		}),
	};

	const paramsObj = useSearchParams(schema, options);
	let navigationCount = $state(0);

	beforeNavigate(() => {
		navigationCount += 1;
	});

	function inc() {
		paramsObj.page += 1;
	}
	function resetParams() {
		paramsObj.reset();
	}
	function setBoth() {
		paramsObj.update({ page: 5, filter: "bar" });
	}
	function setCreatedAt() {
		paramsObj.createdAt = new Date("2023-06-15T10:30:00Z");
	}
	function setUpdatedAt() {
		paramsObj.updatedAt = new Date("2023-06-20T18:00:00Z");
	}
	function setCoercionEquivalent() {
		Reflect.set(paramsObj, "page", "1");
	}
	function updateCoercionEquivalent() {
		paramsObj.update({ page: "1" as unknown as number });
	}
	function setEquivalentDate() {
		paramsObj.updatedAt = new Date("2023-12-31T23:59:59Z");
	}

	// Create a derived value to avoid potential infinite loops
	let createdAtString = $derived(
		paramsObj.createdAt instanceof Date ? paramsObj.createdAt.toISOString() : "Invalid Date"
	);
	let updatedAtString = $derived(
		paramsObj.updatedAt instanceof Date ? paramsObj.updatedAt.toISOString() : "Invalid Date"
	);
</script>

<input data-testid="filter-input" bind:value={paramsObj.filter} />
<button data-testid="inc" onclick={inc}>Inc</button>
<button data-testid="reset" onclick={resetParams}>Reset</button>
<button data-testid="setBoth" onclick={setBoth}>Set both</button>
<button data-testid="setCreatedAt" onclick={setCreatedAt}>Set createdAt</button>
<button data-testid="setUpdatedAt" onclick={setUpdatedAt}>Set updatedAt</button>
<button data-testid="setCoercionEquivalent" onclick={setCoercionEquivalent}
	>Set equivalent page</button
>
<button data-testid="updateCoercionEquivalent" onclick={updateCoercionEquivalent}
	>Update equivalent page</button
>
<button data-testid="setEquivalentDate" onclick={setEquivalentDate}>Set equivalent date</button>
<span data-testid="page">{paramsObj.page}</span>
<span data-testid="filter">{paramsObj.filter}</span>
<span data-testid="createdAt">{createdAtString}</span>
<span data-testid="updatedAt">{updatedAtString}</span>
<span data-testid="navigationCount">{navigationCount}</span>
