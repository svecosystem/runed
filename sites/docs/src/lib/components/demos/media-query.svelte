<script lang="ts">
	import { MediaQuery } from "runed";
	import { DemoContainer, NativeSelect } from "@svecodocs/kit";

	let media = $state("(min-width: 640px)");
	const query = new MediaQuery(() => media);
</script>

<DemoContainer class="flex flex-col gap-4">
	<label>
		Current media query:
		<div class="bg-primary inline-flex items-center justify-center rounded-md px-2 py-1.5">
			<NativeSelect bind:value={media}>
				<option value="(min-width: 640px)">(min-width: 640px)</option>
				<option value="(min-width: 320px)">(min-width: 320px)</option>
				<option value="(min-width: 1080px)">(min-width: 1080px)</option>
				<option value="(prefers-color-scheme: dark)">(prefers-color-scheme: dark)</option>
				<option value="(prefers-color-scheme: light)">(prefers-color-scheme: light)</option>
			</NativeSelect>
		</div>
	</label>
	<p class="mb-0">
		The result of the media query <code class="text-brand">{media}</code> is
		<code class="text-brand">{query.matches}</code>
	</p>
</DemoContainer>
