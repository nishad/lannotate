<script>
	import '../app.pcss';
	import Navbar from '$lib/components/ui/Navbar.svelte';
	import Footer from '$lib/components/ui/Footer.svelte';
	import { ProgressBar } from '@prgm/sveltekit-progress-bar';
</script>

<ProgressBar class="text-red-500" />

<Navbar />
<div class="mx-4 my-8 min-h-lvh lg:mx-12 lg:my-12">
	<slot />
</div>
<Footer />
