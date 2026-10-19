// @ts-check
import { defineConfig } from "astro/config";
import { SITE } from "./src/data/site.ts";

// SITE.url (src/data/site.ts) define canonical, Open Graph absoluto e
// sitemap. Vazio até existir domínio — o build funciona do mesmo jeito.
export default defineConfig({
  site: SITE.url || undefined,
  output: "static",
  trailingSlash: "ignore",
  build: { inlineStylesheets: "auto" },
  compressHTML: true,
});
