/* Converte o VSL_URL em uma URL de iframe, sem amarrar a página a um
   provedor. YouTube e Vimeo são normalizados; Panda Video e qualquer outro
   link de embed passam como estão. */

export interface VslSource {
  provider: "youtube" | "vimeo" | "panda" | "iframe";
  src: string;
}

export function resolveVsl(url: string): VslSource | null {
  const raw = url.trim();
  if (!raw) return null;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "https:") return null;
  const host = u.hostname.replace(/^www\./, "");

  // YouTube (inclusive não listado): watch?v=, youtu.be/, /embed/, /shorts/, /live/
  if (host === "youtu.be" || host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    const id =
      host === "youtu.be"
        ? u.pathname.slice(1)
        : u.searchParams.get("v") || u.pathname.match(/\/(?:embed|shorts|live)\/([^/?#]+)/)?.[1];
    if (!id || !/^[\w-]{6,20}$/.test(id)) return null;
    return {
      provider: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
    };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = u.pathname.match(/(\d{6,})/)?.[1];
    if (!id) return null;
    const h = u.searchParams.get("h") || u.pathname.match(/\/\d{6,}\/([0-9a-f]{6,})/)?.[1];
    return {
      provider: "vimeo",
      src: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1${h ? `&h=${h}` : ""}`,
    };
  }

  if (host.endsWith("pandavideo.com.br") || host.endsWith("pandavideo.com")) {
    return { provider: "panda", src: u.toString() };
  }

  return { provider: "iframe", src: u.toString() };
}
