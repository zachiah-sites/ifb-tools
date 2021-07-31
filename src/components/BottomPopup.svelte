<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let open: boolean;

	const fly = (node, { delay = 0, duration = 400 }) => {
		return {
			delay,
			duration,
			css: (t, u) => `transform: translateY(${u * 100}%)`
		};
	};
	const dispatch = createEventDispatcher();
</script>

{#if open}
	<div transition:fly class="fixed z-50 bottom-0 bg-gray-200 w-screen">
		<slot />
		<div class="shadow-inner flex">
			<button
				on:click={() => {
					dispatch('close');
				}}
				class="text-gray-700 p-4 mx-auto">Close</button
			>
		</div>
	</div>
{/if}
