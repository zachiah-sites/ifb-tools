<script lang="ts">
	export let grow = false;
	export let active = false;
</script>

<button
	on:click
	class:bg-blue-100={active}
	class:text-black={active}
	class="p-4 cursor-pointer active:bg-blue-100 active:text-black duration-200 flex items-center"
	class:flex-grow={grow}><slot /></button
>
