<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '../../data/db';
	import FormField from '~/components/FormField.svelte';
	import Form from '~/components/Form.svelte';
	import Button from '~/components/Button.svelte';

	let email: string = '';
	let password: string = '';

	$: if ($authStore) {
		goto(localStorage['goto-after-login'] || '/');
	}

	let error: string = null;
</script>

<Form
	{error}
	title="Sign In"
	on:submit={async () => {
		try {
			await authStore.signIn({ email, password });
			goto(localStorage['goto-after-sign-in'] || '/');
		} catch (e) {
			error = e.message;
		}
	}}
>
	<FormField required bind:value={email} label="Email" type="email" />
	<FormField required bind:value={password} label="Password" type="password" />
	<Button type="submit">Sign In</Button>
</Form>
