import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { katexPlugin } from './src/plugins/katex.mjs';

export default defineConfig({
  site: 'https://metachow.github.io',
  integrations: [sitemap()],
  markdown: {
    // $…$ and $$…$$ in posts are typeset by KaTeX at build time; the stylesheet is
    // imported on the post page.
    processor: satteri({ features: { math: true }, mdastPlugins: [katexPlugin] }),
    shikiConfig: {
      theme: 'github-dark-dimmed',
    },
  },
});
