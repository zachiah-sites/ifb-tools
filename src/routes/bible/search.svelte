<script context="module" lang="ts">
	export async function load({ page, fetch, session, context }) {
		const text: string = page.query.get('text');

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

		const url = `/api/bible/search.json?text=${text}&wholeWordsOnly=${wholeWordsOnly}&exactMatch=${exactMatch}`;
		console.log({ url });
		const res = await fetch(url);

		if (res.ok) {
			return {
				props: {
					results: (await res.json()).results,
					text,
					exactMatch,
					wholeWordsOnly
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

	export let results: { verse: VerseEntity; highlightedText: string }[] = [];
	export let text: string;
	export let wholeWordsOnly: boolean;
	export let exactMatch: boolean;

	let tempText = text;
	let tempWholeWordsOnly = wholeWordsOnly;
	let tempExactMatch = exactMatch;

	$: hasChanges = !(
		tempText === text &&
		tempWholeWordsOnly === wholeWordsOnly &&
		tempExactMatch === exactMatch
	);
</script>

<BibleTopBar text="Browse the Bible" showSearch={false} />

<form
	class="bg-gray-200"
	on:submit|preventDefault={() =>
		hasChanges &&
		goto(
			`/bible/search?text=${tempText}&wholeWordsOnly=${tempWholeWordsOnly}&exactMatch=${tempExactMatch}`
		)}
>
	<div class="bg-white shadow-lg m-4 flex px-2">
		<input
			type="text"
			bind:value={tempText}
			class="text-lg p-2 mr-auto flex-grow bg-transparent"
			placeholder="Search..."
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
	</div>

	<div class="flex m-4 gap-4">
		<div>
			<input type="checkbox" bind:checked={tempWholeWordsOnly} /> Whole Words Only
		</div>
		<div>
			<input type="checkbox" bind:checked={tempExactMatch} /> Exact Match
		</div>
	</div>
</form>

{#if results.length}
	<main class="pb-48">
		{#each results as result}
			<Verse verse={result.verse} highlightedText={result.highlightedText} />
		{/each}
	</main>
{:else if text.trim() === ''}
	<Jumbotron title="No Results">Type Your Search Query</Jumbotron>
{:else}
	<Jumbotron title="No Results">Please try something else</Jumbotron>
{/if}
