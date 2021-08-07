<script lang="ts">
	import { goto } from '$app/navigation';

	import Button from '~/components/Button.svelte';
	import Nav from '~/components/Nav.svelte';
	import Jumbotron from '~/components/Jumbotron.svelte';
	import Form from '~/components/Form.svelte';
	import FormField from '~/components/FormField.svelte';
	import Modal from '~/components/Modal.svelte';
	import { authStore } from '~/data/db';
	import { supabase } from '~/supabase';
	import Plus from '~/components/icons/Plus.svelte';
	import Loader from '~/components/Loader.svelte';
	import Trash from '~/components/icons/Trash.svelte';
	import { onMount } from 'svelte';

	const fetchSermons = async () => {
		const { error, data } = await supabase.from('sermons').select(`
            title,id
        `);

		if (error) {
			throw error;
		}

		return data;
	};

	let modalOpen = false;
	let newSermonTitle = '';
	let modalError = null;

	let sermons: { id; title }[] = null;

	onMount(async () => {
		sermons = await fetchSermons();
	});

	const createSermon = async () => {
		console.log('creating sermon');
		const { error, data } = await supabase
			.from('sermons')
			.insert([{ title: newSermonTitle, profile_id: $authStore.id }]);
		if (error) {
			modalError = error.message;
		} else {
			goto(`/sermons/${data[0].id}`);
		}
	};

	const deleteSermon = async (id) => {
		console.log('deleting sermon', id);
		const { error, data } = await supabase.from('sermons').delete().match({ id: id });

		if (error) {
			// TODO: Better Error HANDLING HERE AND ABOVE
		} else {
			sermons = sermons.filter((item) => item.id !== id);
		}
	};
</script>

{#if !sermons}
	<Loader />
{:else if sermons.length === 0}
	<Jumbotron title="You Don't Have Any Sermons">
		<Button on:click={() => (modalOpen = true)}>Create One</Button>
	</Jumbotron>
{:else}
	<ul>
		{#each sermons as sermon}
			<li class="flex bg-white border-b items-center">
				<a href="/sermons/{sermon.id}" class="p-4 border-r text-blue-800">{sermon.title}</a>

				<button
					class="h-full w-12 ml-auto p-4 border-l"
					on:click={() => {
						deleteSermon(sermon.id);
					}}
				>
					<Trash />
				</button>
			</li>
		{/each}
	</ul>
{/if}

<Nav posClasses="top-0">
	<h1 class="p-4 whitespace-nowrap bg-blue-800 text-white flex-grow mr-auto">Sermons</h1>
</Nav>

<div class="w-12 h-12 fixed bottom-0 mb-24 right-0 mr-8">
	<Button on:click={() => (modalOpen = true)}>
		<Plus />
	</Button>
</div>

<Modal bind:open={modalOpen}>
	<Form title="New Sermon" on:submit={createSermon} error={modalError}>
		<FormField bind:value={newSermonTitle} type="text" label="Title" required />
		<Button type="submit">Create</Button>
	</Form>
</Modal>
