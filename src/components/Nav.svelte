<script lang="ts" context="module">
	export type NavLinks = (
		| { href: string; text: string }
		| { onClick: () => void; text: string }
		| ''
	)[];
</script>

<script lang="ts">
	export let links: NavLinks;
</script>

<nav class="flex bg-blue-800 text-white sticky mb-4">
	{#each links as link}
		{#if link === ''}
			<span class="flex-grow" />
		{:else if link['onClick']}
			<button
				class="p-4 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-100 active:text-black duration-200"
				on:click={link['onClick']}
			>
				{link.text}
			</button>
		{:else}
			<a
				class="p-4 hover:bg-blue-200 hover:text-blue-800 active:bg-blue-100 active:text-black duration-200"
				href={link['href']}>{link.text}</a
			>
		{/if}
	{/each}
</nav>
