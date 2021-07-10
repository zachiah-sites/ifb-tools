<script lang="ts">
	export let href;
	let className: string = '';
	export { className as class };
</script>

<a
	class="{className} block rounded-lg shadow-lg bg-blue-800 text-white p-4 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-100 active:text-black duration-200"
	{href}
	on:click
>
	<slot />
</a>
