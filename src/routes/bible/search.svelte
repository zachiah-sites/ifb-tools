<script context="module" lang="ts">
	export async function load({ page, fetch, session, context }) {
		const text = page.query.get('text');

		let exactMatch;
		let wholeWordsOnly;
		try {
			exactMatch = !!JSON.parse(page.query.get('exactMatch') || 'false');
			wholeWordsOnly = !!JSON.parse(page.query.get('wholeWordsOnly') || 'false');
		} catch {
			exactMatch = exactMatch || false;
			wholeWordsOnly = wholeWordsOnly || false;
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

	import Button from '~/components/Button.svelte';
	import Form from '~/components/Form.svelte';
	import FormField from '~/components/FormField.svelte';
	import Search from '~/components/icons/Search.svelte';
	import Jumbotron from '~/components/Jumbotron.svelte';
	import Nav from '~/components/Nav.svelte';
	import Verse from '~/components/Verse.svelte';
	import type { VerseEntity } from '~/data/bible/RawTypes';

	export let results: { verse: VerseEntity }[];
	export let text: string;
	export let wholeWordsOnly: boolean;
	export let exactMatch: boolean;
</script>

<form
	class="bg-gray-200"
	on:submit|preventDefault={() =>
		goto(`/bible/search?text=${text}&wholeWordsOnly=${wholeWordsOnly}&exactMatch=${exactMatch}`)}
>
	<div class="bg-white shadow-lg m-4 flex px-2">
		<input
			type="text"
			bind:value={text}
			class="text-lg p-2 mr-auto flex-grow bg-transparent"
			placeholder="Search..."
		/>
		<button type="submit" class="text-black cursor-pointer w-8 p-2">
			<Search />
		</button>
	</div>

	<div class="flex m-4 gap-4">
		<div>
			<input type="checkbox" bind:checked={wholeWordsOnly} />Whole Words Only
		</div>
		<div>
			<input type="checkbox" bind:checked={exactMatch} /> Exact Match
		</div>
	</div>
</form>

{#if results.length}
	<main class="pb-48">
		{#each results as result}
			<Verse verse={result.verse} />
		{/each}
	</main>
{:else}
	<Jumbotron title="No Results">Please try something else</Jumbotron>
{/if}
