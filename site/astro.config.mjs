import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
	integrations: [mdx(), preact()],
	site: 'https://aaronczichon.de',
	image: {
		domains: ['api.mapbox.com', 'directus.aaronczichon.de'],
	},
});
