<script lang="ts">
	import Nav from '../components/Nav.svelte';
	import '../app.css';

	import { authStore } from '../data/db';
	import Pencil from '~/components/icons/Pencil.svelte';
	import Book from '~/components/icons/Book.svelte';
	import MapMarker from '~/components/icons/MapMarker.svelte';
	import Brain from '~/components/icons/Brain.svelte';
	import { getStores } from '$app/stores';
	import { onMount } from 'svelte';
	import NavLinks from '~/components/NavLinks.svelte';
	import type { NavLinksType } from '~/components/NavLinks.svelte';
	import { goto } from '$app/navigation';
	import NavLink from '~/components/NavLink.svelte';
	import ArrowUp from '~/components/icons/ArrowUp.svelte';
	import 'virtual:windi.css';
	import 'virtual:windi-devtools';

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

	$: pageType = $page.path.split('/')[1];
	$: {
		if (client) {
			const key = `latest-path-${pageType}`;
			const value = $page.path;
			console.log({ key, value });
			localStorage[key] = value;
		}
	}

	const requiresAuth = (path: string) => {
		const r = [/^\/sermons/, /^\/sermons\/.*/];

		for (let r1 of r) {
			if (path.match(r1)) {
				return true;
			}
		}
		return false;
	};
	$: {
		if (client) {
			if (requiresAuth($page.path) && !$authStore) {
				localStorage['goto-after-sign-in'] = $page.path;
				goto('/auth/sign-in');
			} else if ($page.path !== '/auth/sign-in') {
				localStorage['goto-after-sign-in'] = '';
			}
		}
	}

	let scrollY = 0;
</script>

<svelte:window
	on:scroll={() => {
		scrollY = window.scrollY;
	}}
/>

<Nav posClasses="top-0">
	<NavLinks {links} />
</Nav>

<main class="pt-16 pb-16 h-[100vh] flex flex-col">
	<slot />
</main>

{#if scrollY > 60}
	<button
		on:click={() => {
			window.scroll({
				top: 0,
				left: 0,
				behavior: 'smooth'
			});
		}}
		class="fixed bottom-0 mb-28 left-0 right-0 mx-auto opacity-50 hover:opacity-80 active:opacity-80 bg-gray-400 shadow-lg rounded-full p-4 active:bg-gray-500 duration-75"
	>
		<ArrowUp class="h-8" />
	</button>
{/if}

<Nav posClasses="bottom-0">
	<NavLink href="/latest-routes/sermons" active={pageType === 'sermons'}>
		<Pencil class="h-8" />
	</NavLink>

	<NavLink href="/latest-routes/bible" active={pageType === 'bible'}>
		<Book class="h-8" />
	</NavLink>

	<NavLink href="/latest-routes/soulwinning" active={pageType === 'soulwinning'}>
		<MapMarker class="h-8" />
	</NavLink>

	<NavLink href="/latest-routes/memory" active={pageType === 'memory'}>
		<Brain class="h-8" />
	</NavLink>
</Nav>
