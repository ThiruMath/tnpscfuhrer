// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: "https://tnpscfuhrer.pages.dev",
  output: "static",
  integrations: [mdx(), sitemap(), react()]
});