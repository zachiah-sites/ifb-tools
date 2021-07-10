<script context="module" lang="ts">
	export async function load({ page, fetch, session, context }) {
		if (['bible', 'sermons', 'memory', 'soulwinning'].includes(page.params.path)) {
			return {
				props: {
					path: page.params.path
				}
			};
		} else {
			return;
		}
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import { onMount } from 'svelte';

	export let path: 'bible' | 'sermons' | 'memory' | 'soulwinning';

	let client = false;
	onMount(() => {
		client = true;
	});

	$: {
		if (client) {
			const latestPath = localStorage['latest-path-' + path] || `/${path}`;
			goto(latestPath, { replaceState: true });
		}
	}
</script>
