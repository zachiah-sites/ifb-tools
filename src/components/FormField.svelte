<script context="module" lang="ts">
	let _id = 0;
</script>

<script lang="ts">
	const id = `form-field-${_id++}`;

	export let type: string;
	export let value;
	export let label: string;

	const handleInput = (e: Event) => (value = (e.target as HTMLInputElement).value);
</script>

<div class="flex flex-col p-4 my-2 {'' + value !== '' ? 'not-empty' : ''}">
	<div class="relative h-20">
		<input
			class="duration-200 w-full h-20 p-2 focus-visible:ring-2 relative opacity-0"
			{value}
			{id}
			{type}
			on:input={handleInput}
		/>
		<label
			class="text-gray-500 bg-white border-b-4 border-blue-400 top-0 duration-200 flex p-2 h-20 absolute w-full content-center"
			for={id}><span class="mr-auto my-auto ml-2">{label}</span></label
		>
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
</style>
