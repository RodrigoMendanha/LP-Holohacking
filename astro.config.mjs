// @ts-check
import { defineConfig } from "astro/config";

// SITE_URL define canonical, Open Graph e sitemap. Fica vazio até existir
// domínio — sem ele, o build continua funcionando e as URLs saem relativas.
const SITE_URL = process.env.SITE_URL || undefined;

export default defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "ignore",
  build: { inlineStylesheets: "auto" },
  compressHTML: true,
});
