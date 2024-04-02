<script lang="ts">
	import SidebarNavItem from "./sidebar-nav-item.svelte";
	import { navigation } from "$lib/config";
</script>

<ul>
	{#each navigation.sidebar as navItem}
		<li class="mt-8">
			<SidebarNavItem {navItem} />
		</li>
	{/each}
</ul>
