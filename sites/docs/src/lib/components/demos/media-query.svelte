<script lang="ts">
	import { MediaQuery } from "runed";
	import { DemoContainer, NativeSelect, Label } from "@svecodocs/kit";

	let media = $state("(min-width: 640px)");
	const query = new MediaQuery(() => media);
</script>

<DemoContainer class="flex flex-col gap-4">
	<div class="flex flex-col gap-3">
		<Label for="query">Current media query:</Label>
		<NativeSelect id="query" bind:value={media} class="max-w-xs">
			<option value="(min-width: 640px)">(min-width: 640px)</option>
			<option value="(min-width: 320px)">(min-width: 320px)</option>
			<option value="(min-width: 1080px)">(min-width: 1080px)</option>
			<option value="(prefers-color-scheme: dark)">(prefers-color-scheme: dark)</option>
			<option value="(prefers-color-scheme: light)">(prefers-color-scheme: light)</option>
		</NativeSelect>
	</div>
	<p class="mb-0">
		The result of the media query <code>{media}</code> is
		<code>{query.matches}</code>
	</p>
</DemoContainer>
