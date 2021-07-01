<script lang="ts">
	import Nav from '../components/Nav.svelte';
	import type { NavLinks } from '../components/Nav.svelte';
	import '../app.postcss';

	import { authStore } from '../data/db';

	let links: NavLinks;
	$: links = $authStore
		? [{ href: '/', text: 'home' }, '', { href: '/', text: 'sign out' }]
		: [
				{ href: '/', text: 'home' },
				'',
				{ href: '/auth/sign-in', text: 'sign in' },
				{ href: '/auth/sign-up', text: 'sign up' }
		  ];
</script>

<Nav {links} />

<slot />
