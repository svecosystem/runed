<script lang="ts">
	import NavbarLogo from "./navbar-logo.svelte";
	import NavbarNav from "./navbar-nav.svelte";
	import NavbarIcons from "./navbar-icons.svelte";
</script>

<header class="sticky top-0 z-50 -mb-px border-b border-border bg-background/75 backdrop-blur">
	<div class="container flex h-16 max-w-8xl items-center justify-between gap-3">
		<NavbarLogo />
		<NavbarNav />
		<NavbarIcons />
	</div>
</header>
