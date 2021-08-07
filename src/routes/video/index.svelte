<!-- <script lang="ts" context="module">
	//https://infinite-wave-91540.herokuapp.com/
	export async function load({ page, fetch, session, context }) {
		const links = (await (await fetch('https://bannedbutnotboundbot.herokuapp.com/')).json())
			?.links;

		return {
			props: { links }
		};
	}
</script>

<script lang="ts">
	export let links: string[];

	$: parsedLinks = links.map((link) => {
		link = link.replace(/https:\/\/mandrillapp\.com\/track\/click\/[0-9]+\//, 'https://');
		if (link.includes('bitchute')) {
			return link.replace('?p=', '/embed/');
		}
		return link;
	});

	$: console.log(links);
	$: console.log(parsedLinks);
</script>

{#each parsedLinks as link}
	<iframe src={link} title="Video from Banned But not Bound" />
{/each} -->
<script lang="ts">
	import Jumbotron from '~/components/Jumbotron.svelte';
</script>

<Jumbotron title="Coming Soon">
	I haven't implemented this yet please help on <a
		class="text-blue-800"
		href="https://github.com/zachiah-sites/ifb-tools">Github</a
	> if you are interested!
</Jumbotron>
