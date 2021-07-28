<script lang="ts">
	import NavButton from '~/components/NavButton.svelte';
	import Nav from '~/components/Nav.svelte';
	import AngleDown from '~/components/icons/AngleDown.svelte';
	import ChapterSelector from '~/components/ChapterSelector.svelte';
	import Search from '~/components/icons/Search.svelte';
	import { goto } from '$app/navigation';
	import type { ChapterEntity } from '~/data/bible/RawTypes';
	import NavLink from './NavLink.svelte';

	let selectChapterModalOpen = false;

	let searchText = '';
	export let text;
	export let chapter: ChapterEntity = null;
	export let showSearch = true;
</script>

<Nav posClasses="top-0">
	<NavButton on:click={() => (selectChapterModalOpen = true)} extraClasses="mr-auto">
		<span class="mr-4 whitespace-nowrap">
			{text}
		</span>

		<AngleDown class="h-6 ml-2" />
	</NavButton>

	{#if showSearch}
		<form
			class=" bg-white hidden xs:flex"
			on:submit|preventDefault={() => {
				goto(`/bible/search?text=${searchText}`);
			}}
		>
			<input
				type="text"
				class="py-2 px-4 rounded-l-full text-black"
				placeholder="Search..."
				bind:value={searchText}
			/>
			<button type="submit" class="w-8 text-blue-800 p-2"><Search /></button>
		</form>

		<div class="contents xs:hidden">
			<NavLink href="/bible/search">
				<Search class="h-8" />
			</NavLink>
		</div>
	{/if}
</Nav>

<ChapterSelector
	bind:open={selectChapterModalOpen}
	initialBook={chapter?.book}
	initialChapter={chapter?.chapter}
/>
