<script lang="ts">
	import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document/build/ckeditor';
	import './sermon-editor.css';
	import { createEventDispatcher, onMount } from 'svelte';
	//import { Autosave } from '@ckeditor/ckeditor5-autosave';

	export let initialData: string;
	export let editor = null;

	const dispatch = createEventDispatcher();

	let toolbarContainer;
	let editable;
	onMount(async () => {
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
			{@html initialData}
		</div>
	</div>
</div>

<style>
</style>
