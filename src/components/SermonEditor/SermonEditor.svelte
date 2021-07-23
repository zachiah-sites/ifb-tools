<script lang="ts">
	import './sermon-editor.css';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	//import { Autosave } from '@ckeditor/ckeditor5-autosave';

	export let initialData: string;
	export let editor = null;

	const dispatch = createEventDispatcher();

	let toolbarContainer;
	let editable;
	let showContent = false;
	onMount(async () => {
		const DecoupledEditor = (
			await import('@ckeditor/ckeditor5-build-decoupled-document/build/ckeditor.js')
		).default;
		showContent = true;
		await tick();
		editor = await DecoupledEditor.create(editable, {
			cloudServices: {}
		});

		toolbarContainer.appendChild(editor.ui.view.toolbar.element);
	});
</script>

<div class="document-editor">
	<div class="document-editor__toolbar" bind:this={toolbarContainer} />
	<div class="document-editor__editable-container">
		<div class="document-editor__editable" bind:this={editable}>
			{#if showContent}
				{@html initialData ||
					`<ol style="list-style-type:decimal;"><li>Intro<ol style="list-style-type:upper-latin;"><li>Title</li><li>Verse</li><li>Pray</li></ol></li><li>Point 1<ol style="list-style-type:upper-latin;"><li>Subpoint 1</li><li>Subpoint 2</li></ol></li><li>Conclusion</li></ol>`}
			{/if}
		</div>
	</div>
</div>

<style>
</style>
