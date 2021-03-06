<script context="module" lang="ts">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		const { book, chapter } = page.params;
		const response = await fetch(`/api/bible/${book}/${chapter}.json`);

		if (response.ok) {
			return {
				props: {
					chapter: await response.json()
				}
			};
		} else {
			return {
				status: response.status,
				error: new Error(`Page not found`)
			};
		}
	}
</script>

<script lang="ts">
	import formatBookName from '~/data/bible/isomorphic/formatBookName';
	import type { CompleteChapterEntity } from '~/data/bible/RawTypes';
	import NavButton from '~/components/NavButton.svelte';
	import Copy from '~/components/icons/Copy.svelte';
	import { supabase } from '~/supabase';
	import { onMount } from 'svelte';
	import { authStore, bibleProgressStore } from '~/data/db';
	import copy from '~/util/copyToClipboard';
	import AngleLeft from '~/components/icons/AngleLeft.svelte';
	import AngleRight from '~/components/icons/AngleRight.svelte';
	import Button from '~/components/Button.svelte';
	import Verse from '~/components/Verse.svelte';
	import BibleTopBar from '~/components/BibleTopBar.svelte';
	import BottomPopup from '~/components/BottomPopup.svelte';
	import { goto } from '$app/navigation';

	export let chapter: CompleteChapterEntity;

	let activeVerses: { [key: number]: boolean } = {};
	$: activeVersesArray = Object.entries(activeVerses)
		.filter(([k, v]) => v)
		.map(([k, v]) => +k);

	const highlightColors = ['#9adab9', '#efc082', '#f2a5c4', '#f3e482', '#8bc5e0'];

	let highlights: { formatting: string; verse: number }[];

	let mounted = false;
	onMount(() => (mounted = true));

	$: {
		mounted &&
			(async () => {
				highlights = null;
				const { data, error } = await supabase
					.from('bible_formatting')
					.select('formatting,verse')
					.filter('book', 'eq', chapter.book)
					.filter('chapter', 'eq', chapter.chapter);
				if (error) throw error;
				highlights = data;
			})();
	}

	$: console.log(highlights);

	let selectChapterModalOpen = false;

	$: {
		chapter;
		activeVerses = {};
	}

	let searchText;
</script>

<BibleTopBar text="{formatBookName(chapter.book)} {chapter.chapter}" {chapter} />

<main class="pb-48 flex flex-col">
	{#each chapter.verses as verse}
		<Verse
			on:click={() => {
				activeVerses = { ...activeVerses, [verse.verse]: !activeVerses[verse.verse] };
			}}
			{verse}
			active={activeVerses[verse.verse]}
			formatting={highlights?.find((item) => item.verse === verse.verse)?.formatting}
		/>
	{/each}

	{#if $authStore}
		<Button
			class="w-max !mx-auto !mt-2"
			on:click={async () => {
				$bibleProgressStore[`${chapter.book}-${chapter.chapter}`] =
					($bibleProgressStore[`${chapter.book}-${chapter.chapter}`] || 0) + 1;
				const { data, error } = await supabase
					.from('bible_progress')
					.update({ data: $bibleProgressStore });

				if (error) {
					console.error(error);
					//TODO: Better Error Handling here
					//TODO: Show loader for users until supabase is done updating
				}

				goto(`/bible/${chapter.next.book}/${chapter.next.chapter}`);
			}}
		>
			<span>Mark as Read</span>
			<span class="opacity-70 ml-2">
				({$bibleProgressStore?.[`${chapter.book}-${chapter.chapter}`] || 0})
			</span>
		</Button>
	{/if}
	<a
		class="fixed bottom-0 mb-28 left-0 ml-12 bg-gray-400 shadow-lg rounded-full p-4 active:bg-gray-500 duration-75"
		href="/bible/{chapter.previous.book}/{chapter.previous.chapter}"
	>
		<AngleLeft class="h-8" />
	</a>

	<a
		class="fixed bottom-0 mb-28 right-0 mr-12 bg-gray-400 shadow-lg rounded-full p-4 active:bg-gray-500 duration-75"
		href="/bible/{chapter.next.book}/{chapter.next.chapter}"
	>
		<AngleRight class="h-8" />
	</a>
</main>

<BottomPopup open={activeVersesArray.length > 0} on:close={() => (activeVerses = {})}>
	<NavButton
		on:click={() => {
			let x = activeVersesArray
				.map((verse) => {
					const fullVerse = chapter.verses[+verse - 1];
					return `${formatBookName(fullVerse.book)} ${fullVerse.chapter}:${fullVerse.verse}\n${
						fullVerse.text
					}\n\n`;
				})
				.join('');
			copy(x);
		}}
	>
		<Copy class="h-8" />
	</NavButton>
	<div class="overflow-auto flex shadow-inner">
		{#each highlightColors as color}
			<NavButton
				on:click={async () => {
					const newHighlights = activeVersesArray.map((verse) => ({
						book: chapter.book,
						chapter: chapter.chapter,
						verse: verse,
						formatting: `background: ${color}`,
						profile_id: $authStore.id
					}));

					const error = await Promise.all(
						newHighlights.map(async (d) => {
							const { error } = await supabase
								.from('bible_formatting')
								.update(d)
								.eq('book', d.book)
								.eq('chapter', d.chapter)
								.eq('verse', d.verse);

							let error2;
							if (error) {
								error2 = (await supabase.from('bible_formatting').insert(d)).error;
							}

							console.log({ error, error2 });
							return error2;
						})
					);
					//TODO: Better Error Handling Especially for no network
					if (error.filter((i) => i).length) throw error;
					highlights = [
						...Object.entries(activeVerses)
							.filter(([a, v]) => v)
							.map(([verse]) => ({
								verse: +verse,
								formatting: `background: ${color}`
							})),
						...highlights
					];
				}}
			>
				<div class="h-8 w-8 rounded-full" style="background: {color}" />
			</NavButton>
		{/each}
	</div>
</BottomPopup>
