<script lang="ts">
	import formatBookName from '~/data/bible/isomorphic/formatBookName';

	import type { VerseEntity } from '~/data/bible/RawTypes';

	export let verse: VerseEntity;
	export let active: boolean = false;
	export let formatting: string = '';
	export let highlightedText: string = null;
	export let search = false;
</script>

<article
	class="flex p-4 duration-200 border-2"
	class:border-black={active}
	class:text-gray-600={active}
	class:border-transparent={!active}
	class:gap-4={!search}
	class:gap-2={search}
	style="{formatting};"
	class:flex-col={search}
	on:click
>
	<h2 class="p-2 text-xs bg-gray-200 flex items-center cursor-pointer">
		{#if search}
			{formatBookName(verse.book)} {verse.chapter}:{verse.verse}
		{:else}
			{verse.verse}
		{/if}
	</h2>
	<p class:self-center={!search}>
		{@html highlightedText || verse.text}
	</p>
</article>
