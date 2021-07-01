<script lang="ts">
	import { authStore } from '../../data/db';
	import FormField from '~/components/FormField.svelte';
	import Form from '~/components/Form.svelte';

	let email: string = '';
	let password: string = '';
</script>

<Form>
	<FormField bind:value={email} label="Email" type="email" />
	<FormField bind:value={password} label="Password" type="password" />

	<button type="submit" on:click|preventDefault={() => authStore.signIn({ email, password })}
		>Sign In</button
	>
</Form>
