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
		<NavBrand href="/">
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
				>Lannotate</span
			>
		</NavBrand>
		<div class="flex md:order-2">
			<ToolbarLink
				class="hidden hover:text-gray-900 dark:hover:text-white sm:inline-block"
				name="View on GitHub"
				href="https://github.com/nishad/lannotate"
			>
				<GitHub />
			</ToolbarLink>
			<DarkMode size="lg" class="inline-block hover:text-gray-900 dark:hover:text-white" />
			<Tooltip class="dark:bg-gray-900" placement="bottom-end">Toggle dark mode</Tooltip>
			<NavHamburger />
		</div>
		<NavUl {activeUrl} class="order-1">
			<NavLi href="https://nishad.github.io/lannotae">Home</NavLi>
			<NavLi href="https://nishad.github.io/lannotae/ner">NER</NavLi>
			<NavLi href="https://nishad.github.io/lannotae/full-text-search">Full-text Search</NavLi>
		</NavUl>
	</Navbar>
</div>
