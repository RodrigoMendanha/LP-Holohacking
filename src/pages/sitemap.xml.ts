/* Página única: o sitemap lista só a raiz. Sem SITE.url, sai vazio —
   sitemap exige URL absoluta. */
import type { APIRoute } from "astro";
import { SITE } from "../data/site";

export const GET: APIRoute = () => {
  const base = SITE.url.replace(/\/$/, "");
  const url = base ? `\n  <url><loc>${base}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>` : "";
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${url}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
