/* Enquanto SITE.indexable = false, a página pede para não ser indexada
   (aqui e no <meta name="robots">). */
import type { APIRoute } from "astro";
import { SITE } from "../data/site";

export const GET: APIRoute = () => {
  const base = SITE.url.replace(/\/$/, "");
  const linhas = ["User-agent: *", SITE.indexable ? "Allow: /" : "Disallow: /"];
  if (base && SITE.indexable) linhas.push("", `Sitemap: ${base}/sitemap.xml`);
  return new Response(linhas.join("\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
