<script lang="ts">
	import { usePreferredColorScheme } from "runed";
	import { DemoContainer } from "@svecodocs/kit";

	const colorScheme = usePreferredColorScheme();
</script>

<DemoContainer>
	<note class="mb-2"> Preferred Color Scheme: </note>
	<code>{{ colorScheme: colorScheme.current }}</code>
</DemoContainer>
