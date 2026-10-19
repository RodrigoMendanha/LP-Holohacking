/* Uma origem só para todo CTA da página. Ver CHECKOUT_URL em data/site.ts. */
import { CHECKOUT_URL, CTA_FALLBACK_URL } from "../data/site";

export type CtaLocation = "header" | "hero" | "vsl" | "result" | "offer" | "final" | "menu";

export interface CtaTarget {
  /** null = sem destino: o botão é renderizado desativado (só na oferta). */
  href: string | null;
  external: boolean;
  /** "checkout" | "fallback" | "anchor" | "none" — vai para o data-cta-mode. */
  mode: "checkout" | "fallback" | "anchor" | "none";
}

export function resolveCta(location: CtaLocation): CtaTarget {
  if (CHECKOUT_URL) return { href: CHECKOUT_URL, external: isExternal(CHECKOUT_URL), mode: "checkout" };
  if (CTA_FALLBACK_URL) return { href: CTA_FALLBACK_URL, external: isExternal(CTA_FALLBACK_URL), mode: "fallback" };
  // Sem destino comercial: quem clica é levado à oferta. Na própria oferta,
  // não há para onde ir — o botão aparece desativado.
  if (location === "offer") return { href: null, external: false, mode: "none" };
  return { href: "#oferta", external: false, mode: "anchor" };
}

function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
