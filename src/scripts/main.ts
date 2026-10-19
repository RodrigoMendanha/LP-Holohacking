/* ===========================================================================
   O JavaScript da página inteira. Tudo é melhoria progressiva: sem JS, o
   conteúdo aparece completo, o menu vira lista de links e o FAQ (<details>)
   continua funcionando.
   =========================================================================== */

const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- aparição ao rolar ---------- */
function iniciarAparicao() {
  const alvos = document.querySelectorAll<HTMLElement>("[data-reveal], .radar, .triade, [data-converge]");
  if (!("IntersectionObserver" in window) || reduzMovimento) {
    alvos.forEach((el) => el.classList.add("is-visivel"));
    return;
  }
  const io = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-visivel");
        io.unobserve(e.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
  );
  alvos.forEach((el) => io.observe(el));
}

/* ---------- header: fundo sólido depois do topo ---------- */
function iniciarHeader() {
  const header = document.querySelector<HTMLElement>("[data-header]");
  if (!header) return;
  const marcar = () => header.classList.toggle("is-rolado", window.scrollY > 24);
  marcar();
  window.addEventListener("scroll", marcar, { passive: true });
}

/* ---------- menu mobile ---------- */
function iniciarMenu() {
  const botao = document.querySelector<HTMLButtonElement>("[data-menu-botao]");
  const painel = document.querySelector<HTMLElement>("[data-menu-painel]");
  if (!botao || !painel) return;

  const abrir = (sim: boolean) => {
    botao.setAttribute("aria-expanded", String(sim));
    botao.setAttribute("aria-label", sim ? "Fechar menu" : "Abrir menu");
    painel.classList.toggle("is-aberto", sim);
    document.body.classList.toggle("menu-aberto", sim);
    if (sim) painel.querySelector<HTMLElement>("a")?.focus();
  };

  botao.addEventListener("click", () => abrir(botao.getAttribute("aria-expanded") !== "true"));
  painel.addEventListener("click", (ev) => {
    if ((ev.target as HTMLElement).closest("a")) abrir(false);
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && botao.getAttribute("aria-expanded") === "true") {
      abrir(false);
      botao.focus();
    }
  });
  window.matchMedia("(min-width: 900px)").addEventListener("change", (m) => {
    if (m.matches) abrir(false);
  });
}

/* ---------- VSL: o player só carrega quando a pessoa pede ---------- */
function iniciarVsl() {
  const caixa = document.querySelector<HTMLElement>("[data-vsl]");
  if (!caixa) return;
  const botao = caixa.querySelector<HTMLButtonElement>("[data-vsl-play]");
  const modelo = caixa.querySelector<HTMLTemplateElement>("template[data-vsl-embed]");
  const src = caixa.dataset.vslSrc;

  const montarIframe = () => {
    if (!src) return;
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = "Vídeo de apresentação do HoloHacking";
    iframe.allow = "autoplay; fullscreen; picture-in-picture; encrypted-media";
    iframe.allowFullscreen = true;
    iframe.setAttribute("loading", "lazy");
    caixa.querySelector("[data-vsl-palco]")?.replaceChildren(iframe);
    caixa.classList.add("is-tocando");
    rastrear("vsl_play", { location: "vsl" });
  };

  // Código de incorporação do provedor (ex.: VTurb): recria os <script>
  // para que o navegador os execute, e só quando o vídeo chega perto da tela.
  const montarEmbed = () => {
    if (!modelo) return;
    const palco = caixa.querySelector<HTMLElement>("[data-vsl-palco]");
    if (!palco) return;
    const frag = modelo.content.cloneNode(true) as DocumentFragment;
    frag.querySelectorAll("script").forEach((velho) => {
      const novo = document.createElement("script");
      [...velho.attributes].forEach((a) => novo.setAttribute(a.name, a.value));
      novo.textContent = velho.textContent;
      velho.replaceWith(novo);
    });
    palco.replaceChildren(frag);
    caixa.classList.add("is-tocando");
  };

  if (botao && src) botao.addEventListener("click", montarIframe, { once: true });

  if (modelo) {
    if (!("IntersectionObserver" in window)) return montarEmbed();
    const io = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          io.disconnect();
          montarEmbed();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(caixa);
  }
}

/* ---------- medição dos CTAs (só fala com o que estiver carregado) ---------- */
type Dados = Record<string, string | undefined>;
function rastrear(evento: string, dados: Dados) {
  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...a: unknown[]) => void;
    fbq?: (...a: unknown[]) => void;
  };
  if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event: evento, ...dados });
  if (typeof w.gtag === "function") w.gtag("event", evento, dados);
  if (typeof w.fbq === "function" && evento === "cta_click" && dados.mode === "checkout") {
    w.fbq("track", "InitiateCheckout", { content_name: dados.location });
  }
}

function iniciarCtas() {
  document.addEventListener("click", (ev) => {
    const cta = (ev.target as HTMLElement).closest<HTMLElement>("[data-cta]");
    if (!cta) return;
    rastrear("cta_click", { location: cta.dataset.location, mode: cta.dataset.ctaMode });
  });
}

iniciarAparicao();
iniciarHeader();
iniciarMenu();
iniciarVsl();
iniciarCtas();
