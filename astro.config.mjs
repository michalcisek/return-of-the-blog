import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';

export default defineConfig({
  site: 'https://michalcisek.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkReadingTime, remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false }]],
    shikiConfig: {
      themes: {
        light: 'catppuccin-latte',
        dark: 'catppuccin-mocha',
      },
    },
  },
});
