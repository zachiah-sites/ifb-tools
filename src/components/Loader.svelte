<script lang="ts">
	import {
		BarLoader,
		Chasing,
		Circle,
		Circle2,
		Circle3,
		DoubleBounce,
		Firework,
		Jellyfish,
		Jumper,
		Pulse,
		Rainbow,
		RingLoader,
		ScaleOut,
		Shadow,
		SpinLine,
		Stretch,
		Wave,
		SyncLoader,
		Square,
		Moon
	} from 'svelte-loading-spinners';

	const loaders = [
		BarLoader,
		Chasing,
		Circle,
		Circle2,
		Circle3,
		DoubleBounce,
		Firework,
		Jellyfish,
		Jumper,
		Pulse,
		Rainbow,
		RingLoader,
		ScaleOut,
		Shadow,
		SpinLine,
		Stretch,
		Wave,
		SyncLoader,
		Square,
		Moon
	];

	const Loader = loaders[Math.floor(Math.random() * loaders.length)];
</script>

<div class="h-full w-full flex items-center justify-center">
	<svelte:component this={Loader} />
</div>
