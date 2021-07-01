<script context="module" lang="ts">
	let _id = 0;
</script>

<script lang="ts">
	import Asterisk from './icons/Asterisk.svelte';

	const id = `form-field-${_id++}`;

	export let type: string;
	export let value;
	export let label: string;
	export let required: boolean = false;

	const handleInput = (e: Event) => (value = (e.target as HTMLInputElement).value);

	let hadFocus = false;
</script>

<div
	class="rounded-lg shadow-lg flex flex-col my-6 {'' + value !== 'not-empty' ? 'not-empty' : ''}"
>
	<div class="relative h-20">
		<input
			{required}
			class="rounded-b-lg duration-200 w-full h-20 p-2 focus-visible:bg-gray-200 relative opacity-0"
			{value}
			{id}
			{type}
			on:input={handleInput}
			on:focus={() => (hadFocus = true)}
		/>
		<label
			class="rounded-t-lg text-gray-500 bg-white border-b-4 border-blue-400 top-0 duration-200 flex p-2 h-20 absolute w-full content-center"
			for={id}><span class="mr-auto my-auto ml-2">{label}</span></label
		>

		{#if required}
			<div class="required flex items-center absolute top-2 right-4 text-red-800 duration-200">
				<Asterisk class="w-4 h-4 mr-2" /> Required
			</div>
		{/if}
	</div>
</div>

<style type="postcss">
	input:focus + label,
	.not-empty label {
		@apply h-10 text-white bg-gray-500 border-b-0;
	}

	input:focus,
	.not-empty input {
		@apply top-10 opacity-100 h-10;
	}

	input:focus ~ .required,
	.not-empty .required {
		@apply text-black;
	}
</style>
