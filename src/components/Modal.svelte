<script lang="ts">
	import { onMount } from 'svelte';

	import { fade } from 'svelte/transition';

	export let open = false;
</script>

<svelte:head>
	{#if open}
		<style>
			body {
				overflow: hidden !important;
			}
		</style>
	{/if}
</svelte:head>

{#if open}
	<div
		transition:fade
		class="fixed h-[100vh] w-[100vw] bg-opacity-80 bg-gray-800 flex flex-col top-0 z-50"
	>
		<section
			class="m-auto w-full p-6 max-h-[100vh] overflow-auto"
			on:click={(e) => e.target === e.currentTarget && (open = false)}
		>
			<slot />
		</section>
	</div>
{/if}
