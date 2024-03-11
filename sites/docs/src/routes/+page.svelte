<script lang="ts">
	import {
		GitHubIcon,
		PersonArmsSpread,
		FileHTML,
		Circuitry,
		FileTS,
		UsersThree,
		Hammer,
	} from "$lib/icons/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import FeatureCard from "$lib/components/feature-card.svelte";
	import A from "$lib/components/markdown/a.svelte";
</script>

<span class="hero-gradient"></span>
<div class="container relative mx-auto max-w-5xl py-20 sm:py-28 md:py-32">
	<h1
		class="text-balance text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
	>
		Resizable panes have never been easier.
	</h1>
	<p class="mx-auto mt-6 max-w-3xl text-balance text-center text-base sm:text-lg">
		Resizable pane components for Svelte.
	</p>
	<div class="mt-8 flex items-center justify-center gap-4">
		<Button href="/docs" variant="brand" size="lg">Get Started</Button>
		<Button
			href="https://github.com/huntabyte/formsnap"
			target="_blank"
			variant="outline"
			size="lg"
		>
			<GitHubIcon class="mr-2 h-4 w-4" />
			View on GitHub
		</Button>
	</div>
</div>
<section class="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-32 lg:px-8">
	<h2 class="mb-10 text-balance text-center text-3xl font-bold tracking-tight lg:text-4xl">
		What's included
	</h2>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
		<FeatureCard title="Accessible Defaults" icon={PersonArmsSpread}>
			ARIA-attributes and wiring are included by default, following the <A
				href="https://www.w3.org/TR/wai-aria-practices-1.2/">WAI-ARIA Authoring Practices</A
			>.
		</FeatureCard>
		<FeatureCard title="Composable APIs" icon={Circuitry}>
			Designed with composition in mind, enabling you to extend and bend the components to your
			will.
		</FeatureCard>
		<FeatureCard title="HTML Standard" icon={FileHTML}>
			Utilizes appropriate HTML elements for compatibility and accessibility.
		</FeatureCard>
		<FeatureCard title="Fully Typed" icon={FileTS}>
			Each component is fully typed with TypeScript, so you can move fast without breaking things.
		</FeatureCard>
		<FeatureCard title="Dope Community" icon={UsersThree}>
			A community of developers who are always willing to lend a helping hand. Join the <A
				href="https://discord.gg/8z3rPdJ">Discord</A
			> to get involved.
		</FeatureCard>
		<FeatureCard title="Built by Builders" icon={Hammer}>
			Built & maintained by the same team responsible for <A href="https://shadcn-svelte.com"
				>shadcn-svelte</A
			>, <A href="https://bits-ui.com">Bits UI</A>, <A href="https://melt-ui.com">Melt UI</A>, and
			more!
		</FeatureCard>
	</div>
</section>
