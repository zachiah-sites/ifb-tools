<script lang="ts">
	export let href;
	export let active = false;
</script>

<a
	{href}
	class:bg-blue-100={active}
	class:text-black={active}
	class="p-4 cursor-pointer active:bg-blue-100 active:text-black duration-200 flex items-center"
	><slot /></a
>
