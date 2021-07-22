<script lang="ts">
	export let sections: { id: string; label: string }[];

	export let activeSectionId: string;
	export let sizeClasses: string = 'h-96 w-96';

	$: !activeSectionId && (activeSectionId = sections[0].id);
	$: activeSectionIndex = sections.find((i) => i.id == activeSectionId);
</script>

<section
	class="shadow-2xl rounded-2xl max-w-full  m-auto bg-gray-200 overflow-y-auto max-h-full flex flex-col overflow-x-hidden {sizeClasses}"
>
	<div class="shadow-lg bg-blue-200 rounded-t-2xl p-4 sticky">
		{#each sections as section}
			<button>{section.label}</button>
		{/each}
	</div>

	<div class="flex-grow p-4 rounded-b-2xl flex">
		<slot />
	</div>
</section>
