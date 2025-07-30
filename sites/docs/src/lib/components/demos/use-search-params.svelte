<script lang="ts">
	import { useSearchParams, createSearchParamsSchema } from "runed/kit";
	import { Button, DemoContainer, Input } from "@svecodocs/kit";
	const params = useSearchParams(
		createSearchParamsSchema({
			fields: {
				type: "object",
				default: {},
				objectType: {} as Record<string, string>,
			},
		})
	);
	const newField = $state({ key: "", value: "" });
	function addField() {
		if (newField.key.trim() && newField.value.trim()) {
			params.fields = { ...params.fields, [newField.key]: newField.value };
			newField.key = "";
			newField.value = "";
		}
	}
	function removeField(key: string) {
		const newFields = { ...params.fields };
		delete newFields[key];
		params.fields = newFields;
	}
</script>

<DemoContainer class="flex flex-col gap-4">
	{#each Object.entries(params.fields) as [key, _value] (key)}
		<div class="flex items-center gap-3">
			<Input class="flex-1" value={key} placeholder="Key" readonly />
			<Input class="flex-1" bind:value={params.fields[key]} placeholder="Value" />
			<Button class="shrink-0" variant="brand" onclick={() => removeField(key)}>Remove</Button>
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
		<Button variant="brand" class="shrink-0" type="submit">Add Field</Button>
	</form>
</DemoContainer>
