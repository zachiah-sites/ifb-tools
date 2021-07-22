<script lang="ts">
	export let grow = false;
</script>

<button
	on:click
	class="p-4 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-100 active:text-black duration-200 flex items-center"
	class:flex-grow={grow}><slot /></button
>
