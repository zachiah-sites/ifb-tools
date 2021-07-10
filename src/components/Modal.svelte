<script lang="ts">
	import { fade } from 'svelte/transition';

	export let open = false;

	$: console.log({ open });
</script>

{#if open}
	<div
		transition:fade
		class="fixed h-[100vh] w-[100vw] bg-opacity-80 bg-gray-800 flex flex-col top-0 z-50"
	>
		<section class="m-auto w-full">
			<slot />
		</section>
	</div>
{/if}
