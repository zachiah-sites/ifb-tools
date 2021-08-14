<script context="module" lang="ts">
	export async function load({ page, fetch, session, context }) {
		const text: string = page.query.get('text') || '';
		const pageNumber: number = +page.query.get('page') || 1;

		let exactMatch;
		let wholeWordsOnly;
		try {
			exactMatch = !!JSON.parse(page.query.get('exactMatch') || 'false');
			wholeWordsOnly = !!JSON.parse(page.query.get('wholeWordsOnly') || 'false');
		} catch {
			exactMatch = exactMatch || false;
			wholeWordsOnly = wholeWordsOnly || false;
		}
		if (text.trim() === '') {
			return {
				props: {
					text: '',
					wholeWordsOnly,
					exactMatch
				}
			};
		}

		const url = `/api/bible/search.json?text=${text}&wholeWordsOnly=${wholeWordsOnly}&exactMatch=${exactMatch}&page=${pageNumber}`;
		console.log({ url });
		const res = await fetch(url);
		const res2 = await res.json();

		if (res.ok) {
			return {
				props: {
					res: res2,
					text,
					exactMatch,
					wholeWordsOnly,
					page: pageNumber
				}
			};
		}
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import Search from '~/components/icons/Search.svelte';
	import Jumbotron from '~/components/Jumbotron.svelte';
	import BibleTopBar from '~/components/BibleTopBar.svelte';
	import Verse from '~/components/Verse.svelte';
	import type { VerseEntity } from '~/data/bible/RawTypes';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Times from '~/components/icons/Times.svelte';
	import AngleLeft from '~/components/icons/AngleLeft.svelte';
	import AngleRight from '~/components/icons/AngleRight.svelte';

	export let res: {
		results: { verse: VerseEntity; highlightedText: string }[];
		pages: number;
		total: number;
	};

	$: results = res.results;
	$: pages = res.pages;
	$: total = res.total;

	export let text: string;
	export let wholeWordsOnly: boolean;
	export let exactMatch: boolean;
	export let page: number;

	let tempText = text;
	let tempWholeWordsOnly = wholeWordsOnly;
	let tempExactMatch = exactMatch;

	$: hasChanges = !(
		tempText === text &&
		tempWholeWordsOnly === wholeWordsOnly &&
		tempExactMatch === exactMatch
	);

	const submit = () => hasChanges && submitNQA();

	const submitNQA = (page: number = 1) =>
		goto(
			`/bible/search?text=${tempText}&wholeWordsOnly=${tempWholeWordsOnly}&exactMatch=${tempExactMatch}&page=${page}`
		);

	let focused = false;

	let mounted = false;
	let searchHistory: string[] = [];

	let updatedHistory = false;
	$: text && (updatedHistory = false);
	onMount(() => {
		mounted = true;
	});

	$: {
		if (mounted && !updatedHistory) {
			console.log('updating history');
			updatedHistory = true;
			searchHistory = [
				...new Set([text, ...JSON.parse(localStorage.getItem('searchHistory') || '[]')])
			].filter((i) => i.trim() !== '');
			localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
		}
	}
</script>

<BibleTopBar text="Browse the Bible" showSearch={false} />

<form class="bg-gray-200" on:submit|preventDefault={submit}>
	<div class="bg-white shadow-lg m-4 flex px-2 relative">
		<input
			type="text"
			bind:value={tempText}
			class="text-lg p-2 mr-auto flex-grow bg-transparent"
			placeholder="Search..."
			on:focus={() => {
				focused = true;
			}}
			on:blur={() => {
				focused = false;
			}}
		/>
		<button
			type="submit"
			disabled={!hasChanges}
			class="text-black w-8 p-2 duration-200"
			class:text-gray-200={!hasChanges}
			class:cursor-pointer={hasChanges}
			class:cursor-default={!hasChanges}
		>
			<Search />
		</button>

		{#if focused && searchHistory.length}
			<div
				transition:fade
				class="absolute p-2 shadow-lg w-full left-0 -bottom-12 transform translate-y-full bg-gray-100 flex flex-col gap-2 max-h-72 overflow-auto"
				tabindex="0"
				on:focus={() => {
					focused = true;
				}}
				on:blur={() => {
					focused = false;
				}}
			>
				{#each searchHistory as searchHistoryItem}
					<span class="flex gap-2">
						<button
							on:focus={() => {
								focused = true;
							}}
							on:blur={() => {
								focused = false;
							}}
							on:click={() => {
								tempText = searchHistoryItem;
								focused = false;
							}}
							class="bg-white text-black text-sm p-2 cursor-pointer active:bg-gray-200 duration-200 focus:bg-gray-300 flex-grow"
							style="-webkit-tap-highlight-color: transparent;"
						>
							{searchHistoryItem}
						</button>
						<button
							on:focus={() => {
								focused = true;
							}}
							on:blur={() => {
								focused = false;
							}}
							on:click={() => {
								console.log('Removing', searchHistoryItem);
								searchHistory = searchHistory.filter((i) => {
									console.log(i, searchHistoryItem);
									return i !== searchHistoryItem;
								});

								localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
							}}
							class="bg-white text-black text-sm p-2 cursor-pointer active:bg-gray-200 duration-200 focus:bg-gray-300"
							style="-webkit-tap-highlight-color: transparent;"
						>
							<Times class="w-2" />
						</button>
					</span>
				{/each}
			</div>
		{/if}
	</div>

	<div class="flex m-4 gap-4">
		<div>
			<input type="checkbox" bind:checked={tempWholeWordsOnly} /> Whole Words Only
		</div>
		<div>
			<input type="checkbox" bind:checked={tempExactMatch} /> Exact Match
		</div>
	</div>

	<p class="px-4 pt-4 pb-2">Showing {results.length} of {total} for search "{text}"</p>
	<p class="px-4 pb-4">Page {page} of {pages}</p>
</form>

{#if results.length}
	<main class="pb-48">
		{#each results as result}
			<Verse verse={result.verse} highlightedText={result.highlightedText} search />
		{/each}

		{#if pages > 1}
			<button
				disabled={page === 1}
				class:cursor-default={page === 1}
				class:bg-gray-400!={page === 1}
				class:text-gray-500={page === 1}
				class="fixed bottom-0 mb-28 left-0 ml-12 bg-gray-400 shadow-lg rounded-full p-4 active:bg-gray-500 duration-75"
				on:click={() => submitNQA(page - 1)}
			>
				<AngleLeft class="h-8" />
			</button>

			<button
				disabled={page === pages}
				class:cursor-default={page === pages}
				class:bg-gray-400!={page === pages}
				class:text-gray-500={page === pages}
				class="fixed bottom-0 mb-28 right-0 mr-12 bg-gray-400 shadow-lg rounded-full p-4 active:bg-gray-500 duration-75"
				on:click={() => submitNQA(page + 1)}
			>
				<AngleRight class="h-8" />
			</button>
		{/if}
	</main>
{:else if text.trim() === ''}
	<Jumbotron title="No Results">Type Your Search Query</Jumbotron>
{:else}
	<Jumbotron title="No Results">Please try something else</Jumbotron>
{/if}
