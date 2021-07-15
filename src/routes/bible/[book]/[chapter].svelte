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
	import LinkButton from '~/components/LinkButton.svelte';
	import formatBookName from '~/data/bible/isomorphic/formatBookName';

	import type { CompleteChapterEntity } from '~/data/bible/RawTypes';
	import Nav from '~/components/Nav.svelte';
	import NavButton from '~/components/NavButton.svelte';
	import Copy from '~/components/icons/Copy.svelte';
	import { supabase } from '~/supabase';
	import { onMount } from 'svelte';
	import { authStore } from '~/data/db';
	import ArrowLeft from '~/components/icons/ArrowLeft.svelte';

	export let chapter: CompleteChapterEntity;

	let activeVerses: { [key: number]: boolean } = {};
	$: activeVersesLength = Object.entries(activeVerses).filter(([a, b]) => b).length;

	const highlightColors = ['#9adab9', '#efc082', '#f2a5c4', '#f3e482', '#8bc5e0'];

	let highlights: { formatting: string; verse: number }[];
	onMount(async () => {
		const { data, error } = await supabase
			.from('bible_formatting')
			.select('formatting,verse')
			.filter('book', 'eq', chapter.book)
			.filter('chapter', 'eq', chapter.chapter);
		if (error) throw error;
		highlights = data;
	});

	$: console.log(highlights);
</script>

<Nav posClasses="top-0">
	<LinkButton class="rounded-none" href="/bible/{chapter.previous.book}/{chapter.previous.chapter}">
		Previous
	</LinkButton>

	<h1 class="p-4 whitespace-nowrap bg-blue-800 text-white border-l border-r border-white flex-grow">
		{formatBookName(chapter.book)}
		{chapter.chapter}
	</h1>

	<LinkButton class="rounded-none" href="/bible/{chapter.next.book}/{chapter.next.chapter}">
		Next
	</LinkButton>
</Nav>

{#if activeVersesLength > 0}
	<Nav posClasses="top-0">
		<NavButton>
			<Copy class="h-8" />
		</NavButton>
		{#each highlightColors as color}
			<NavButton
				on:click={async () => {
					const newHighlights = Object.entries(activeVerses)
						.filter(([verse, v]) => v)
						.map(([verse]) => ({
							book: chapter.book,
							chapter: chapter.chapter,
							verse: +verse,
							formatting: `background: ${color}`,
							profile_id: $authStore.id
						}));
					// const { error } = await supabase.from('bible_formatting').upsert(
					// 	newHighlights
					// );

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

<main>
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
</main>
