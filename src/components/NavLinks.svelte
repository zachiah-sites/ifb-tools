<script lang="ts" context="module">
	export type NavLinksType = (
		| { href: string; text: string }
		| { onClick: () => void; text: string }
		| { href: string; icon: any }
		| { onClick: () => void; icon: any }
		| ''
	)[];
</script>

<script lang="ts">
	export let links: NavLinksType;

	export let itemClasses: string =
		'p-4 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-100 active:text-black duration-200';
</script>

{#each links as link}
	{#if link === ''}
		<span class="flex-grow" />
	{:else if link['onClick']}
		<button class={itemClasses} on:click={link['onClick']}>
			{#if link['text']}
				{link['text']}
			{:else}
				<svelte:component this={link['icon']} class="h-8" />
			{/if}
		</button>
	{:else}
		<a class={itemClasses} href={link['href']}>
			{#if link['text']}
				{link['text']}
			{:else}
				<svelte:component this={link['icon']} class="h-8" />
			{/if}
		</a>
	{/if}
{/each}
