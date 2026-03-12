// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: "https://tnpscfuhrer.pages.dev",
  output: "server",
  adapter: cloudflare({
    imageService: 'cloudflare'
  }),
  integrations: [mdx(), sitemap()]
});