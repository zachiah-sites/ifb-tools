<script lang="ts">
	export let sections: { id: string; label: string }[];

	export let activeSectionId: string;
	export let sizeClasses: string = 'h-96 w-96';

	//$: !activeSectionId && (activeSectionId = sections[0].id);

	$: left = activeSectionId === sections[1].id ? 'calc(2rem - 100%)' : '0px';

	let scroller: HTMLElement;

	$: {
		activeSectionId;
		scroller && (scroller.scrollTop = 0);
	}
</script>

<section
	bind:this={scroller}
	class="shadow-2xl rounded-2xl max-w-full  m-auto bg-gray-200 overflow-y-auto max-h-full flex flex-col overflow-x-hidden {sizeClasses}"
>
	<div class="shadow-lg bg-blue-200 rounded-t-2xl p-4 sticky flex">
		{#each sections as section}
			<button
				class="flex-grow"
				on:click={() => {
					console.log('<Tabs> Setting activeSetionId to ', section.id);
					activeSectionId = section.id;
				}}>{section.label}</button
			>
		{/each}
	</div>

	<div class="flex-grow p-4 rounded-b-2xl flex relative duration-100" style="left: {left};">
		<slot />
	</div>
</section>
