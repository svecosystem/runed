<script lang="ts">
	import { SearchParams, Store } from "runed";
	import { Button } from "../ui/button";
	import DemoContainer from "$lib/components/demo-container.svelte";
	import { page as page_store } from "$app/stores";
	import { goto } from "$app/navigation";

	let params = SearchParams.all();
	const page = new Store(page_store);

	function setPage() {
		const currentUrl = page.current.url.href.split("?")[0];
		goto(`${currentUrl}?a=1&b=${Math.random()}&c=${Math.random()}`);
	}

	function setParams() {
		params.a = 2;
		params.b = Math.random();
		params.c = Math.random();
	}

	const pageParams = $derived(page.current.url.href.split("?")[1]);
	const count = SearchParams.single("count", { defaultValue: 0, decode: (v) => Number(v ?? 0) });
</script>

<DemoContainer>
	<pre>{JSON.stringify(pageParams, null, 2)}</pre>
	<pre>{JSON.stringify(params, null, 2)}</pre>
	<Button onclick={setPage}>set with page store</Button>
	<Button onclick={setParams}>set with SearchParams</Button>
	<Button onclick={() => count.current++}>increment count {count.current} {typeof count.current}</Button>
</DemoContainer>
