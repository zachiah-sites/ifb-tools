<script lang="ts">
	export let title: string;
</script>

<div class="p-8 flex h-full">
	<section class="rounded-lg self-center m-auto shadow-lg p-8 bg-gray-200">
		<h1 class="text-2xl mb-6 text-gray-900">{title}</h1>
		<slot />
	</section>
</div>
