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
</script>

{#await fetchSermons()}
	Loading...
{:then data}
	{#if data.length === 0}
		<Jumbotron title="You Don't Have Any Sermons">
			<Button on:click={() => (modalOpen = true)}>Create One</Button>
		</Jumbotron>
	{:else}
		<ul>
			{#each data as sermon}
				<li class="flex">
					<a
						href="/sermons/{sermon.id}"
						class="mt-4 text-blue-800 p-2 block border-b-2 border-transparent hover:border-blue-800 active:text-blue-600"
						>{sermon.title}</a
					>
				</li>
			{/each}
		</ul>
	{/if}
{/await}

<Nav posClasses="top-0">
	<h1
		class="p-4 whitespace-nowrap bg-blue-800 text-white border-l border-r border-white flex-grow mr-auto"
	>
		Sermons
	</h1>
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
