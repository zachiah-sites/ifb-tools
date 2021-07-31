<script lang="ts">
	let clazz = '';
	/**
	 * USE ! at the end for important!
	 */
	export { clazz as class };
	export let type = null;
</script>

<button
	class="{clazz} rounded-lg shadow-lg w-full bg-blue-800 text-white p-4 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-100 active:text-black duration-200"
	{type}
	on:click
>
	<slot />
</button>
