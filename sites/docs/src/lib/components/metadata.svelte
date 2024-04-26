<script lang="ts">
	import { page } from "$app/stores";
	import { siteConfig } from "$lib/config/site";

	const title = $derived(
		// eslint-disable-next-line svelte/valid-compile
		$page.data?.title ? `${$page.data.title} - ${siteConfig.name}` : siteConfig.name
	);
	const description = $derived($page.data?.description ?? siteConfig.description);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={siteConfig.keywords} />
	<meta name="author" content={siteConfig.author} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={siteConfig.url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={siteConfig.ogImage.url} />
	<meta name="twitter:image:alt" content={siteConfig.name} />
	<meta name="twitter:creator" content={siteConfig.author} />
	<meta property="og:title" content={title} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={siteConfig.url + $page.url.pathname} />
	<meta property="og:image" content={siteConfig.ogImage.url} />
	<meta property="og:image:alt" content={siteConfig.name} />
	<meta property="og:image:width" content={siteConfig.ogImage.width} />
	<meta property="og:image:height" content={siteConfig.ogImage.height} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content={siteConfig.name} />
	<meta property="og:locale" content="EN_US" />
	<link rel="shortcut icon" href="/favicon-16x16.png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>
