<script lang="ts">
	import './sermon-editor.css';
	import { createEventDispatcher, onMount } from 'svelte';
	//import { Autosave } from '@ckeditor/ckeditor5-autosave';

	export let initialData: string;
	export let editor = null;

	const dispatch = createEventDispatcher();

	let toolbarContainer;
	let editable;
	onMount(async () => {
		const DecoupledEditor = (
			await import('@ckeditor/ckeditor5-build-decoupled-document/build/ckeditor.js')
		).default;
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
			{@html initialData ||
				`<ol style="list-style-type:decimal;"><li>Intro<ol style="list-style-type:upper-latin;"><li>Title</li><li>Verse</li><li>Pray</li></ol></li><li>Point 1<ol style="list-style-type:upper-latin;"><li>Subpoint 1</li><li>Subpoint 2</li></ol></li><li>Conclusion</li></ol>`}
		</div>
	</div>
</div>

<style>
</style>
