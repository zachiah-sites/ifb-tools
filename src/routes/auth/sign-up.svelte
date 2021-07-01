<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '../../data/db';
	import FormField from '~/components/FormField.svelte';
	import Form from '~/components/Form.svelte';
	import Button from '~/components/Button.svelte';

	let email: string = '';
	let password: string = '';
	let passwordConfirmation = '';

	const submit = async () => {
		hasAttemptedSubmit = true;
		if (password === passwordConfirmation) {
			console.log('Signing Up');
			await authStore.signUp({ email, password });
			console.log('Signed Up');
		}
	};

	$: if ($authStore) {
		goto('/');
	}

	let hasAttemptedSubmit = false;

	$: error =
		password !== passwordConfirmation && hasAttemptedSubmit
			? 'Password Must Match Password Confirmation'
			: null;
</script>

<Form {error} title="Sign Up" on:submit={submit}>
	<FormField required bind:value={email} label="Email" type="email" />
	<FormField required bind:value={password} label="Password" type="password" />
	<FormField
		required
		bind:value={passwordConfirmation}
		label="Password Confirmation"
		type="password"
	/>
	<Button type="submit">Sign Up</Button>
</Form>
