<script lang="ts">
	import Modal from '~/components/Modal.svelte';
	import Form from '~/components/Form.svelte';
	import Tabs from './Tabs.svelte';
	import TabPane from './TabPane.svelte';
	import { bookNames, getChapterNumbers } from '~/data/bible/RawTypes';
	import type { BookName } from '~/data/bible/RawTypes';
	import formatBookName from '~/data/bible/isomorphic/formatBookName';

	export let open: boolean;
	export let initialBook: BookName = null;
	export let initialChapter: number = null;

	let book: BookName;
	let activeSectionId: string = 'book';

	$: {
		open;
		activeSectionId = 'book';
	}

	$: {
		book = initialBook || 'genesis';
	}

	$: {
		console.log(activeSectionId);
	}

	$: chapters = getChapterNumbers(book);

	//     on:submit={() => {
	// selectChapterModalOpen = false;
	// goto(`/bible/${selectChapterBook}/${selectChapterChapter}`);
</script>

<Modal bind:open>
	<Tabs
		sizeClasses="h-full w-full"
		sections={[
			{ id: 'book', label: formatBookName(book) },
			{ id: 'chapter', label: 'Chapter' }
		]}
		bind:activeSectionId
	>
		<TabPane>
			<div class="flex flex-wrap">
				{#each bookNames as bookName}
					<button
						class="w-1/3 p-4 bg-gray-200"
						on:click={() => {
							book = bookName;
							activeSectionId = 'chapter';
						}}>{formatBookName(bookName)}</button
					>
				{/each}
			</div>
		</TabPane>
		<TabPane>
			<div class="flex flex-wrap">
				{#each chapters as chapter}
					<a
						class="w-1/4 p-4 bg-gray-200 text-center"
						on:click={() => {
							open = false;
						}}
						href="/bible/{book}/{chapter}">{chapter}</a
					>
				{/each}
			</div>
		</TabPane>
	</Tabs>
</Modal>
