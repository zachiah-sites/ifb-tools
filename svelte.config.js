import preprocess from 'svelte-preprocess';
import path from 'path';
import node from '@sveltejs/adapter-node';
import WindiCSS from 'vite-plugin-windicss';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess({})],

	kit: {
		vite: {
			plugins: [WindiCSS.default()],
			resolve: {
				alias: {
					'~': path.resolve('./src')
				}
			},
			optimizeDeps: {}
		},
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: node()
	}
};

export default config;
