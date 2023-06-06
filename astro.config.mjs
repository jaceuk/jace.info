import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
	integrations: [react()],
	build: {
		// Example: Generate `page.html` instead of `page/index.html` during build.
		format: 'file'
	}
});
