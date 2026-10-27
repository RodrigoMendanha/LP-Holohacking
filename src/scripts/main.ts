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

/* ---------- visualizador das telas do produto ----------
   Sempre há como sair: botão Fechar, "Voltar à página", tecla Esc, clique
   fora da imagem e o botão voltar do navegador/celular. O foco volta para a
   miniatura que abriu. Sem JS, o link abre a imagem na mesma aba e o
   "voltar" do navegador traz de volta à página. */
function iniciarZoom() {
  // um visualizador por grupo (galeria do produto, prints dos depoimentos…)
  document.querySelectorAll<HTMLDialogElement>("dialog[data-zoom-dialog]").forEach(iniciarZoomGrupo);
}

function iniciarZoomGrupo(dialogo: HTMLDialogElement) {
  const grupo = dialogo.dataset.zoomDialog || "";
  const item = dialogo.dataset.zoomItem || "Tela";
  const gatilhos = [...document.querySelectorAll<HTMLAnchorElement>(`a[data-zoom="${grupo}"]`)];
  if (!gatilhos.length || typeof dialogo.showModal !== "function") return;

  const img = dialogo.querySelector<HTMLImageElement>("[data-zoom-img]")!;
  const titulo = dialogo.querySelector<HTMLElement>("[data-zoom-titulo-alvo]")!;
  const legenda = dialogo.querySelector<HTMLElement>("[data-zoom-legenda-alvo]")!;
  const contador = dialogo.querySelector<HTMLElement>("[data-zoom-contador]")!;
  const anterior = dialogo.querySelector<HTMLButtonElement>("[data-zoom-anterior]")!;
  const proxima = dialogo.querySelector<HTMLButtonElement>("[data-zoom-proxima]")!;
  let atual = 0;
  let origem: HTMLElement | null = null;
  let comHistorico = false;
  let yAberto = 0;
  // só o grupo que abriu por último devolve a rolagem no popstate
  let devolverRolagem = false;
  // fechar chama history.back(); o navegador tentaria restaurar a rolagem
  // de uma entrada antiga (ex.: a seção de um link clicado antes). A posição
  // de quando a imagem abriu é que vale.
  const voltarAoLugar = () => {
    window.scrollTo({ top: yAberto, behavior: "instant" as ScrollBehavior });
    origem?.focus({ preventScroll: true });
  };
  // Em alguns históricos o navegador ainda rola por conta própria logo
  // depois do popstate. Rolagem suave desligada e a posição reaplicada até
  // ele terminar.
  const fixarLugar = () => {
    const html = document.documentElement;
    html.style.scrollBehavior = "auto";
    voltarAoLugar();
    requestAnimationFrame(voltarAoLugar);
    [60, 160, 320].forEach((ms) => setTimeout(voltarAoLugar, ms));
    setTimeout(() => {
      html.style.scrollBehavior = "";
      devolverRolagem = false;
      if ("scrollRestoration" in history) history.scrollRestoration = "auto";
    }, 360);
  };

  const mostrar = (i: number) => {
    atual = (i + gatilhos.length) % gatilhos.length;
    const g = gatilhos[atual];
    img.src = g.getAttribute("href") || "";
    img.alt = g.dataset.zoomAlt || "";
    titulo.textContent = g.dataset.zoomTitulo || "";
    legenda.textContent = g.dataset.zoomLegenda || "";
    contador.textContent = `${item} ${atual + 1} de ${gatilhos.length}`;
  };
  const umaSo = gatilhos.length < 2;
  anterior.hidden = umaSo;
  proxima.hidden = umaSo;

  const abrir = (i: number, de: HTMLElement) => {
    origem = de;
    yAberto = window.scrollY;
    devolverRolagem = true;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    mostrar(i);
    dialogo.showModal();
    document.body.classList.add("zoom-aberto");
    // Sem a âncora (#secao) na entrada atual: ao voltar para ela, o navegador
    // rolaria até a seção do último link clicado.
    // Em páginas isoladas (iframe/sandbox) o histórico pode ser bloqueado:
    // aí o visualizador só não responde ao "voltar"; os outros jeitos de
    // fechar continuam.
    try {
      history.replaceState(history.state, "", location.pathname + location.search);
      // o "voltar" do celular fecha o visualizador em vez de sair da página
      history.pushState({ zoom: true }, "");
      comHistorico = true;
    } catch {
      comHistorico = false;
    }
    dialogo.querySelector<HTMLElement>(".zoom-fechar")?.focus();
  };

  const fechar = () => {
    if (dialogo.open) dialogo.close();
  };

  dialogo.addEventListener("close", () => {
    document.body.classList.remove("zoom-aberto");
    document.documentElement.style.scrollBehavior = "auto";
    if (comHistorico) {
      comHistorico = false;
      try {
        history.back(); // o popstate abaixo devolve a rolagem
      } catch {
        /* sem histórico: fixarLugar() abaixo já devolve a posição */
      }
    }
    fixarLugar();
  });

  window.addEventListener("popstate", () => {
    if (dialogo.open) {
      comHistorico = false; // o navegador já voltou
      dialogo.close();
      return;
    }
    if (devolverRolagem && history.scrollRestoration === "manual") fixarLugar();
  });

  gatilhos.forEach((g, i) =>
    g.addEventListener("click", (ev) => {
      ev.preventDefault();
      abrir(i, g);
    }),
  );
  dialogo.querySelectorAll("[data-zoom-fechar]").forEach((b) => b.addEventListener("click", fechar));
  anterior.addEventListener("click", () => mostrar(atual - 1));
  proxima.addEventListener("click", () => mostrar(atual + 1));

  // clique fora da imagem e dos botões (no fundo escuro) fecha
  dialogo.addEventListener("click", (ev) => {
    const alvo = ev.target as HTMLElement;
    if (alvo === dialogo || alvo.classList.contains("zoom-caixa") || alvo.classList.contains("zoom-figura")) fechar();
  });

  dialogo.addEventListener("keydown", (ev) => {
    if (umaSo) return;
    if (ev.key === "ArrowLeft") mostrar(atual - 1);
    if (ev.key === "ArrowRight") mostrar(atual + 1);
  });
}

/* ---------- carrossel de depoimentos ----------
   O trilho rola sozinho por toque/trackpad (scroll-snap); as setas andam
   um slide, os indicadores mostram onde se está. Sem JS, o trilho continua
   rolável para o lado. */
function iniciarCarrossel() {
  document.querySelectorAll<HTMLElement>("[data-carrossel]").forEach((raiz) => {
    const trilho = raiz.querySelector<HTMLElement>("[data-carrossel-trilho]");
    const anterior = raiz.querySelector<HTMLButtonElement>("[data-carrossel-anterior]");
    const proximo = raiz.querySelector<HTMLButtonElement>("[data-carrossel-proximo]");
    const contador = raiz.querySelector<HTMLElement>("[data-carrossel-contador]");
    const pontos = [...raiz.querySelectorAll<HTMLElement>("[data-carrossel-pontos] .ponto")];
    if (!trilho || !anterior || !proximo) return;
    const slides = [...trilho.children] as HTMLElement[];
    if (!slides.length) return;

    const inicio = () => parseFloat(getComputedStyle(trilho).paddingLeft) || 0;
    const posicao = (s: HTMLElement) =>
      trilho.scrollLeft + s.getBoundingClientRect().left - trilho.getBoundingClientRect().left - inicio();

    const atual = () => {
      let melhor = 0;
      let dist = Infinity;
      slides.forEach((s, i) => {
        const d = Math.abs(posicao(s) - trilho.scrollLeft);
        if (d < dist) {
          dist = d;
          melhor = i;
        }
      });
      return melhor;
    };

    const atualizar = () => {
      const i = atual();
      const fim = trilho.scrollLeft + trilho.clientWidth >= trilho.scrollWidth - 4;
      anterior.disabled = trilho.scrollLeft <= 4;
      proximo.disabled = fim;
      const mostrado = fim ? slides.length - 1 : i;
      pontos.forEach((p, k) => p.classList.toggle("ativo", k === mostrado));
      if (contador) contador.textContent = `${mostrado + 1} de ${slides.length}`;
    };

    const irPara = (i: number) => {
      const alvo = slides[Math.max(0, Math.min(slides.length - 1, i))];
      trilho.scrollTo({ left: posicao(alvo), behavior: reduzMovimento ? "auto" : "smooth" });
    };

    anterior.addEventListener("click", () => irPara(atual() - 1));
    proximo.addEventListener("click", () => irPara(atual() + 1));
    trilho.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowRight") {
        ev.preventDefault();
        irPara(atual() + 1);
      }
      if (ev.key === "ArrowLeft") {
        ev.preventDefault();
        irPara(atual() - 1);
      }
    });
    let pendente = 0;
    trilho.addEventListener(
      "scroll",
      () => {
        cancelAnimationFrame(pendente);
        pendente = requestAnimationFrame(atualizar);
      },
      { passive: true },
    );
    window.addEventListener("resize", atualizar);
    atualizar();
  });
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
iniciarZoom();
iniciarCarrossel();
iniciarCtas();
