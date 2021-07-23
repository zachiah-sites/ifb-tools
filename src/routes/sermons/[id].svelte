<script lang="ts">
	import Nav from '~/components/Nav.svelte';
	import NavLink from '~/components/NavLink.svelte';
	import NavButton from '~/components/NavButton.svelte';
	import Check from '~/components/icons/Check.svelte';
	import Jumbotron from '~/components/Jumbotron.svelte';

	import { page } from '$app/stores';
	import { supabase } from '~/supabase';
	import LinkButton from '~/components/LinkButton.svelte';
	import ArrowLeft from '~/components/icons/ArrowLeft.svelte';
	import { onMount } from 'svelte';
	import Loader from '~/components/Loader.svelte';
	import SermonEditor from '~/components/SermonEditor/SermonEditor.svelte';

	const id = $page.params.id;

	const getSermon = async () => {
		const { error, data } = await supabase.from('sermons').select('title,content,id').eq('id', id);

		if (error) {
			throw error;
		}

		if (data.length === 0) {
			return { 404: true };
		}

		return data[0];
	};

	let editor = null;
	const save = async () => {
		//TODO: Do Something With this Error
		const { error } = await supabase
			.from('sermons')
			.update({ content: editor.getData() })
			.eq('id', id);

		if (!error) {
			hasChanges = false;
		}
	};

	let hasChanges = false;
</script>

{#await getSermon()}
	<Loader />
{:then sermon}
	{#if sermon[404]}
		<Jumbotron title="Sermon Not Found" />
	{:else}
		<Nav posClasses="top-0">
			<NavLink href="/sermons"><ArrowLeft class="h-8" /></NavLink>
			<h1 class="p-4 whitespace-nowrap bg-blue-800 text-white  flex-grow mr-auto">
				{sermon.title}
			</h1>
			{#if hasChanges}
				<NavButton on:click={save}>
					<Check class="h-8" />
				</NavButton>
			{/if}
		</Nav>
		<SermonEditor
			bind:editor
			on:change={() => {
				hasChanges = true;
			}}
			on:save={(e) => {
				console.log(e);
			}}
			initialData={sermon.content}
		/>
	{/if}
{/await}
