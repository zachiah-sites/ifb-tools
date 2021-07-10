<script lang="ts">
	export let title: string;
</script>

<section class="self-center m-auto shadow-lg p-8 bg-gray-200">
	<h1 class="text-2xl mb-6">{title}</h1>
	<slot />
</section>
