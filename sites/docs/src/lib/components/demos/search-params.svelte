<script lang="ts">
	import { useSearchParams, createSearchParamsSchema } from "runed/kit";
	import { Button, DemoContainer, Input,  } from "@svecodocs/kit";

	const params = useSearchParams(
		createSearchParamsSchema({
			fields: {
				type: "array",
				arrayType: {
					key: "",
					value: "",
				},
				default: [],
			},
		})
	);

	const newField = $state({ key: "", value: "" });

	function addField() {
		// Should be able to use .push() here
		params.fields = [...params.fields, $state.snapshot(newField)];
		newField.key = "";
		newField.value = "";
	}
</script>

<DemoContainer class="flex flex-col gap-4">
	{#each params.fields as _field, i (i)}
		<div class="flex items-center gap-3">
			<Input class="flex-1" bind:value={params.fields[i]!.key} placeholder="Key" />
			<Input class="flex-1" bind:value={params.fields[i]!.value} placeholder="Value" />
			<Button class="shrink-0" variant="brand" onclick={() => params.fields.splice(i, 1)}>Remove</Button>
		</div>
	{/each}
	<form
		class="flex items-center gap-3"
		onsubmit={(e) => {
			e.preventDefault();
			addField();
		}}
	>
		<Input class="flex-1" bind:value={newField.key} placeholder="Key" />
		<Input class="flex-1" bind:value={newField.value} placeholder="Value" />
		<Button variant="brand" class="shrink-0" type="submit" >Add Field</Button>
	</form>
</DemoContainer>
