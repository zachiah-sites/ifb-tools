<script lang="ts">
	import { slide } from 'svelte/transition';
	import ExlamationCircle from './icons/ExlamationCircle.svelte';

	export let title: string | undefined = undefined;
	export let error = '';
</script>

<form
	on:submit|preventDefault
	class="shadow-2xl rounded-2xl max-w-full w-96 m-auto bg-gray-200 p-4"
>
	{#if title}
		<h2 class="bg-gray-500 text-white shadow-lg rounded-lg p-4 text-3xl text-center text">
			{title}
		</h2>
	{/if}

	{#if error}
		<p transition:slide class="flex bg-red-800 text-white p-4 mt-6 rounded-lg">
			<ExlamationCircle class="w-6 mr-4" />
			<span>{error}</span>
		</p>
	{/if}

	<slot />
</form>
