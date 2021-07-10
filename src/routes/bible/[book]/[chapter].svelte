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

	export let chapter: CompleteChapterEntity;
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

<main>
	{#each chapter.verses as verse}
		<article class="flex p-4">
			<h2 class="mr-4 p-2 text-xs bg-gray-200 flex items-center">{verse.verse}</h2>
			<p class="self-center">
				{verse.text}
			</p>
		</article>
	{/each}
</main>
