<script lang="ts">
	export let posClasses = '';

	let clazz: string = 'justify-evenly flex bg-blue-800 text-white h-16 fixed w-full items-center';
	export { clazz as class };
</script>

<nav class="{clazz} {posClasses}">
	<slot />
</nav>
