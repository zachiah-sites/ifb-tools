<script lang="ts">
	export let posClasses = '';

	let clazz: string =
		'justify-evenly flex bg-blue-800 text-white h-16 fixed w-full items-center z-10';
	export { clazz as class };

	import { fade } from 'svelte/transition';
</script>

<nav transition:fade class="{clazz} {posClasses}">
	<slot />
</nav>
