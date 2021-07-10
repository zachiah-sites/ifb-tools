<script lang="ts">
	import Nav from '../components/Nav.svelte';
	import '../app.postcss';

	import { authStore } from '../data/db';
	import Pencil from '~/components/icons/Pencil.svelte';
	import Book from '~/components/icons/Book.svelte';
	import MapMarker from '~/components/icons/MapMarker.svelte';
	import Brain from '~/components/icons/Brain.svelte';
	import { getStores } from '$app/stores';
	import { onMount } from 'svelte';
	import NavLinks from '~/components/NavLinks.svelte';
	import type { NavLinksType } from '~/components/NavLinks.svelte';

	let links: NavLinksType;
	$: links = $authStore
		? [
				{ href: '/', text: 'home' },
				'',
				{
					async onClick() {
						await authStore.signOut();
					},
					text: 'sign out'
				}
		  ]
		: [
				{ href: '/', text: 'home' },
				'',
				{ href: '/auth/sign-in', text: 'sign in' },
				{ href: '/auth/sign-up', text: 'sign up' }
		  ];

	const { page } = getStores();
	let client = false;
	onMount(() => {
		client = true;
	});

	$: {
		if (client) {
			const key = `latest-path-${$page.path.split('/')[1]}`;
			const value = $page.path;
			console.log({ key, value });
			localStorage[key] = value;
		}
	}
</script>

<Nav posClasses="top-0">
	<NavLinks {links} />
</Nav>

<main class="pt-16 pb-16 h-[100vh] flex flex-col">
	<slot />
</main>

<Nav posClasses="bottom-0">
	<NavLinks
		links={[
			{ href: '/latest-routes/sermons', icon: Pencil },
			{ href: '/latest-routes/bible', icon: Book },
			{ href: '/latest-routes/soulwinning', icon: MapMarker },
			{ href: '/latest-routes/memory', icon: Brain }
		]}
	/>
</Nav>
