<script lang="ts">
	import "$lib/styles/app.pcss";
	import { ModeWatcher } from "mode-watcher";
	import TwIndicator from "$lib/components/dev/tw-indicator.svelte";
	import { Navbar } from "$lib/components/layout/navbar/index.js";
	import { Metadata } from "$lib/components/index.js";
	import { Footer } from "$lib/components/layout";
	import { Toaster } from "$lib/components/ui/sonner";
</script>

<Toaster />
<TwIndicator />
<Metadata />
<ModeWatcher />
<Navbar />
<div class="flex min-h-[calc(100vh-4rem)] flex-col">
	<div class="flex-grow">
		<slot />
	</div>
	<Footer />
</div>
