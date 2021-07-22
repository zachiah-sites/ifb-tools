<script lang="ts">
	import { goto } from '$app/navigation';

	import { onMount } from 'svelte';

	onMount(() => {
		goto('/bible/genesis/1');
	});
</script>
