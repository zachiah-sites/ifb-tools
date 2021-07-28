<script lang="ts">
	import type { VerseEntity } from '~/data/bible/RawTypes';

	export let verse: VerseEntity;
	export let active: boolean = false;
	export let formatting: string = '';
</script>

<article
	class="flex p-4 duration-200 border-2"
	class:border-black={active}
	class:text-gray-600={active}
	class:border-transparent={!active}
	style="{formatting};"
	on:click
>
	<h2 class="mr-4 p-2 text-xs bg-gray-200 flex items-center cursor-pointer">{verse.verse}</h2>
	<p class="self-center">
		{verse.text}
	</p>
</article>
