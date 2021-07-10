<script lang="ts">
	export let type = null;
</script>

<button
	class="rounded-lg shadow-lg w-full bg-blue-800 text-white p-4 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-100 active:text-black duration-200"
	{type}
	on:click
>
	<slot />
</button>
