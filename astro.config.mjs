import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://marketing-hub-flax.vercel.app',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
