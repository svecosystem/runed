<script lang="ts">
	import NavbarLogo from "./navbar-logo.svelte";
	import NavbarNav from "./navbar-nav.svelte";
	import NavbarIcons from "./navbar-icons.svelte";
</script>

<header class="border-border bg-background/75 sticky top-0 z-50 -mb-px border-b backdrop-blur">
	<div class="max-w-8xl container flex h-16 items-center justify-between gap-3">
		<NavbarLogo />
		<NavbarNav />
		<NavbarIcons />
	</div>
</header>
