<script>
	import { onMount, onDestroy } from 'svelte';

	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export let loading = false;
	const progress = tweened(0, {
		easing: cubicOut
	});

	const opacity = tweened(0, { easing: cubicOut });
	function handleLoading() {
		opacity.set(1, { duration: 0 });
		progress.set(0.7, { duration: 3000 });
	}
	function handleLoaded() {
		const duration = 1000;

		progress.set(1, { duration });
		opacity.set(0, { duration: duration / 2, delay: duration / 2 });

		setTimeout(() => {
			progress.set(0, { duration: 0 });
		}, duration);
	}
	$: loading ? handleLoading() : loading === false ? handleLoaded() : undefined;
</script>

<div class="progress-container" style={`opacity: ${$opacity}`}>
	<div class="progress" style={`--width: ${$progress}`} />
</div>

<style>
	.progress-container {
		position: sticky;
		top: 0;
		left: 0;
		width: 100%;
		pointer-events: none;
		contain: paint;
		height: 0.275em;
		z-index: 999;
		will-change: opacity;

		background-color: hsla(345deg, 10%, 18%, 0.3);
	}
	.progress {
		left: 0;
		top: 0;
		height: 100%;
		background-color: #ff0040;
		pointer-events: none;
		transform-origin: left;
		transform: scaleX(var(--width));
	}
</style>
