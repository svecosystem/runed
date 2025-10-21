<script lang="ts">
	import { useSearchParams } from "$lib/utilities/use-search-params/use-search-params.svelte";
	import { z } from "zod";

	// Create a codec that converts between ISO date string (YYYY-MM-DD) and Date object
	const stringToDate = z.codec(
		z.iso.date(), // input schema: ISO date string (YYYY-MM-DD only)
		z.date(), // output schema: Date object
		{
			decode: (isoString) => new Date(isoString), // ISO string → Date
			encode: (date) => date.toISOString().split("T")[0]!, // Date → YYYY-MM-DD
		}
	);

	// Create a codec for full datetime
	const stringToDatetime = z.codec(
		z.iso.datetime(), // input schema: full ISO datetime string
		z.date(), // output schema: Date object
		{
			decode: (isoString) => new Date(isoString), // ISO string → Date
			encode: (date) => date.toISOString(), // Date → Full ISO string
		}
	);

	const schema = z.object({
		createdAt: stringToDate.default(() => new Date("2023-01-01T00:00:00Z")),
		updatedAt: stringToDatetime.default(() => new Date("2023-12-31T23:59:59Z")),
		filter: z.string().default(""),
	});

	const paramsObj = useSearchParams(schema);

	function setCreatedAt() {
		paramsObj.createdAt = new Date("2024-06-15T10:30:00Z");
	}

	function setUpdatedAt() {
		paramsObj.updatedAt = new Date("2024-06-20T18:00:00Z");
	}

	function resetParams() {
		paramsObj.reset();
	}

	// Create derived values for display
	let createdAtString = $derived(
		paramsObj.createdAt instanceof Date ? paramsObj.createdAt.toISOString() : "Invalid Date"
	);
	let updatedAtString = $derived(
		paramsObj.updatedAt instanceof Date ? paramsObj.updatedAt.toISOString() : "Invalid Date"
	);
</script>

<div>
	<h1>Zod Codec Test Page</h1>

	<div class="controls">
		<input data-testid="filter-input" bind:value={paramsObj.filter} placeholder="Filter..." />
		<button data-testid="setCreatedAt" onclick={setCreatedAt}>Set createdAt</button>
		<button data-testid="setUpdatedAt" onclick={setUpdatedAt}>Set updatedAt</button>
		<button data-testid="reset" onclick={resetParams}>Reset</button>
	</div>

	<div class="output">
		<div>
			<strong>Filter:</strong>
			<span data-testid="filter">{paramsObj.filter}</span>
		</div>
		<div>
			<strong>CreatedAt (date-only format):</strong>
			<span data-testid="createdAt">{createdAtString}</span>
		</div>
		<div>
			<strong>UpdatedAt (datetime format):</strong>
			<span data-testid="updatedAt">{updatedAtString}</span>
		</div>
	</div>
</div>

<style>
	.controls {
		display: flex;
		gap: 0.5rem;
		margin: 1rem 0;
	}

	.output {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 1rem 0;
	}
</style>
