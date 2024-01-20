<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Tooltip, DarkMode } from 'flowbite-svelte';

	import GitHub from '$lib/components/icons/Github.svelte';
	import ToolbarLink from '$lib/components/utils/ToolbarLink.svelte';
	$: activeUrl = $page.url.pathname;
</script>

<div class="container mx-auto">
	<Navbar fluid="false">
		<NavBrand href="{base}/">
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
				>Lannotate</span
			>
		</NavBrand>
		<div class="flex md:order-2">
			<ToolbarLink
				class="hidden hover:text-gray-900 dark:hover:text-white sm:inline-block"
				name="View on GitHub"
				href="{base}/"
			>
				<GitHub />
			</ToolbarLink>
			<DarkMode size="lg" class="inline-block hover:text-gray-900 dark:hover:text-white" />
			<Tooltip class="dark:bg-gray-900" placement="bottom-end">Toggle dark mode</Tooltip>
			<NavHamburger />
		</div>
		<NavUl {activeUrl} class="order-1">
			<NavLi href="{base}/">Home</NavLi>
			<NavLi href="{base}/ner/">NER</NavLi>
			<NavLi href="{base}/full-text-search/">Full-text Search</NavLi>
			<NavLi href="{base}/vector-search/">Vector Search</NavLi>
		</NavUl>
	</Navbar>
</div>
