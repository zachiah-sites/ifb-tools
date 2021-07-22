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
	import Select from 'svelte-select';
	import LinkButton from '~/components/LinkButton.svelte';
	import formatBookName from '~/data/bible/isomorphic/formatBookName';

	import { bookNames, getChapterNumbers } from '~/data/bible/RawTypes';
	import type { CompleteChapterEntity } from '~/data/bible/RawTypes';
	import Nav from '~/components/Nav.svelte';
	import NavButton from '~/components/NavButton.svelte';
	import Copy from '~/components/icons/Copy.svelte';
	import { supabase } from '~/supabase';
	import { onMount } from 'svelte';
	import { authStore } from '~/data/db';
	import ArrowLeft from '~/components/icons/ArrowLeft.svelte';
	import Times from '~/components/icons/Times.svelte';
	import copy from '~/util/copyToClipboard';
	import AngleDown from '~/components/icons/AngleDown.svelte';
	import NavLink from '~/components/NavLink.svelte';
	import AngleLeft from '~/components/icons/AngleLeft.svelte';
	import AngleRight from '~/components/icons/AngleRight.svelte';
	import Modal from '~/components/Modal.svelte';
	import Form from '~/components/Form.svelte';
	import { goto } from '$app/navigation';
	import Button from '~/components/Button.svelte';
	import ChapterSelector from '~/components/ChapterSelector.svelte';

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
</script>

<Nav posClasses="top-0">
	<NavButton on:click={() => (selectChapterModalOpen = true)}>
		<span class="mr-4">
			{formatBookName(chapter.book)}
			{chapter.chapter}
		</span>

		<AngleDown class="h-6 ml-2" />
	</NavButton>
</Nav>

<ChapterSelector bind:open={selectChapterModalOpen} initialBook={chapter.book} />

{#if activeVersesArray.length > 0}
	<Nav posClasses="top-0">
		<NavButton on:click={() => (activeVerses = {})}>
			<Times class="h-8" />
		</NavButton>
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
	</Nav>
{/if}

<main class="pb-30">
	{#each chapter.verses as verse}
		<article
			class="flex p-4 duration-200 cursor-pointer border-2"
			class:border-black={activeVerses[verse.verse]}
			class:text-gray-600={activeVerses[verse.verse]}
			class:border-transparent={!activeVerses[verse.verse]}
			style="{highlights?.find((item) => item.verse === verse.verse)?.formatting};"
			on:click={() =>
				(activeVerses = { ...activeVerses, [verse.verse]: !activeVerses[verse.verse] })}
		>
			<h2 class="mr-4 p-2 text-xs bg-gray-200 flex items-center">{verse.verse}</h2>
			<p class="self-center">
				{verse.text}
			</p>
		</article>
	{/each}

	<a
		class="fixed bottom-0 mb-28 left-0 ml-12 bg-gray-400 shadow-lg rounded-full p-4"
		href="/bible/{chapter.previous.book}/{chapter.previous.chapter}"
	>
		<AngleLeft class="h-8" />
	</a>

	<a
		class="fixed bottom-0 mb-28 right-0 mr-12 bg-gray-400 shadow-lg rounded-full p-4"
		href="/bible/{chapter.next.book}/{chapter.next.chapter}"
	>
		<AngleRight class="h-8" />
	</a>
</main>
