const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			spacing: {
				112: '26rem',
				128: '28rem',
				144: '30rem'
			}
		}
	},
	plugins: []
};

module.exports = config;
