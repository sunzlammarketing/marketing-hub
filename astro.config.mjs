import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://marketing-hub.example.com',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
