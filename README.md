# LP HoloHacking

Landing page oficial do **HoloHacking** — a plataforma clínica da Nutrição Holística.

A página é a versão comercial e editorial da mesma marca do produto: cores, fontes, raio, sombra e a
geometria do radar HOLOSCAN vêm do repositório principal (`RodrigoMendanha/HoloHacking`), usado só
como referência visual.

> **Status:** V1 em revisão. `SITE.indexable = false` — a página pede para não ser indexada até a
> publicação oficial. Nenhum deploy foi feito.

---

## Stack

| | |
| --- | --- |
| Framework | [Astro 5](https://astro.build) — site 100% estático |
| Estilo | CSS próprio (tokens em `src/styles/tokens.css`), sem framework de CSS |
| JavaScript | um único script pequeno (`src/scripts/main.ts`), melhoria progressiva |
| Fontes | Cormorant Garamond + Jost, servidas pelo próprio site (`@fontsource-variable`) |
| Dependências | só `astro` e as duas fontes |

Sem React, sem bibliotecas de animação, sem scripts de terceiros (até que um ID de analytics seja
configurado).

## Instalação e uso

Requer Node 18.20.8+ (testado com Node 22).

```bash
npm install
npm run dev       # http://localhost:4321 — recarrega ao salvar
npm run build     # gera o site estático em dist/
npm run preview   # serve o dist/ localmente para conferir o build
```

---

## Onde editar cada coisa

Quase tudo o que é decisão comercial mora em **um arquivo só: `src/data/site.ts`**. Campo vazio
nunca quebra a página — ele vira um estado neutro e honesto.

| O que | Onde | Se ficar vazio |
| --- | --- | --- |
| VSL (YouTube, Vimeo, Panda ou link de iframe) | `VSL_URL` | placeholder "Vídeo de apresentação em breve." |
| VSL por código de incorporação (ex.: VTurb) | `VSL_EMBED_HTML` (cole o código como o provedor entrega) | idem |
| Capa do vídeo | `VSL_POSTER` (imagem 16:9 em `public/`) | capa padrão com o botão de play |
| Checkout | `CHECKOUT_URL` | todos os CTAs rolam até a oferta; o botão da oferta aparece desativado ("Acesso em breve") |
| Destino alternativo (lista de espera, WhatsApp comercial) | `CTA_FALLBACK_URL` — usado só se não houver checkout | — |
| Texto dos botões | `CTA_LABEL`, `CTA_LABEL_FINAL` | — |
| Oferta | `PLAN_NAME`, `PRICE`, `INSTALLMENTS`, `ACCESS_DURATION`, `GUARANTEE`, `SUPPORT`, `UPDATES`, `BONUSES` | "Condições de acesso serão apresentadas em breve." — cada linha vazia simplesmente não aparece |
| Números do produto na copy | `HOLOSCAN_QUESTIONS` (81), `PLAYBOOK_STRATEGIES` (75) | — |
| Criador | `CREATOR_NAME`, `CREATOR_ROLE`, `CREATOR_BIO` (parágrafos), `CREATOR_IMAGE` | texto institucional sobre o método, com o símbolo da marca |
| Depoimentos | `TESTIMONIALS` | **a seção inteira some** |
| Capturas do produto | `PRODUCT_SHOTS[].src` e `.alt` | moldura ilustrativa com o selo "Captura do produto em breve" |
| Perguntas frequentes | `FAQ` | — |
| Termos, Privacidade, Contato | `LEGAL_URLS` | o item aparece sem link |
| Razão social, CNPJ, endereço, e-mail | `COMPANY` | a linha não aparece |
| Analytics | `ANALYTICS_IDS` (`GTM`, `GA4`, `META_PIXEL`) | nenhum script é carregado |
| Domínio, canonical, sitemap | `SITE.url` | URLs relativas; sitemap vazio |
| Liberar indexação | `SITE.indexable = true` | `noindex` no `<meta>` e `Disallow: /` no robots.txt |

### Copy das seções

O texto de cada seção está no próprio componente, em `src/components/sections/`:

| Seção | Arquivo |
| --- | --- |
| Header | `src/components/Header.astro` |
| Hero | `Hero.astro` |
| VSL | `VideoSection.astro` |
| Problema | `ProblemSection.astro` |
| Nova forma de atender (6 movimentos) | `MechanismSection.astro` |
| Jornada completa | `JourneySection.astro` |
| Mapeamento Holístico | `MappingSection.astro` |
| HOLOSCAN (sistemas, tríade, aviso) | `HoloscanSection.astro` |
| Ferramentas | `ToolsSection.astro` |
| Playbook | `PlaybookSection.astro` |
| Resultado HOLOS + PDF/WhatsApp | `ResultSection.astro` |
| Evolução | `EvolutionSection.astro` |
| Benefícios | `BenefitsSection.astro` |
| Não substitui o profissional | `ProfessionalControlSection.astro` |
| Para quem é / não é | `AudienceSection.astro` |
| Produto por dentro | `ProductGallery.astro` |
| Depoimentos | `Testimonials.astro` |
| Sobre o criador | `CreatorSection.astro` |
| Oferta | `OfferSection.astro` |
| FAQ | `FAQ.astro` (conteúdo em `site.ts`) |
| CTA final | `FinalCTA.astro` |
| Rodapé | `src/components/Footer.astro` |

### Imagens

```
public/
  favicon.svg, favicon-32.png, apple-touch-icon.png
  images/
    brand/     logo-holohacking.png (logo oficial, copiado do produto)
    product/   capturas do produto  → referencie em PRODUCT_SHOTS
    creator/   retrato do criador   → referencie em CREATOR_IMAGE
    social/    og-holohacking.png (1200×630, compartilhamento)
```

**Capturas do produto:** use 16:10 (ex.: 1600×1000, `.webp`), sempre com **paciente fictício** —
nenhum nome, dado clínico ou registro real.

**Trocar o logo:** substitua `public/images/brand/logo-holohacking.png` mantendo o nome (ou ajuste o
caminho em `src/components/ui/Logo.astro`). Hoje existe só o PNG de 256 px — ver "Pendências".

---

## Design system

Tokens em `src/styles/tokens.css`, derivados do `:root` do produto:

- **Cor:** `--verde-noite #06231a`, `--verde-escuro #0b3325`, `--verde-medio #14503b`,
  `--verde-suave #2c6a51`, `--dourado #c9a35a`, `--dourado-claro #e2c98a`, `--dourado-escuro #8a6f32`,
  `--creme #f4efe3`, `--creme-claro #faf7ee`, `--tinta #1d3a2e`, `--tinta-suave #4f6a5d`.
- **Dourado para texto pequeno sobre creme:** `--dourado-texto #7a612b` (5,1:1). O dourado da marca
  mede ~2,2:1 no creme — o produto resolve isso do mesmo jeito, com um passo mais escuro.
- **Fontes:** Cormorant Garamond (títulos, números, destaques) e Jost (texto, rótulos, botões).
- **Forma:** `--raio 18px` (painéis), `--raio-card 14px`, `--raio-botao 10px`, sombra longa
  esverdeada (`--sombra`), foco dourado de 2 px.
- **Ritmo:** seções alternam verde-noite (`.tema-escuro`) e creme (`.secao--clara`,
  `.secao--creme-claro`).
- **Breakpoints:** 640 / 900 / 1200 px (mobile-first).

Peças visuais reutilizáveis em `src/components/ui/`: `Radar.astro` (radar HOLOSCAN com anéis em
proporção áurea e pentagrama, opção "antes" tracejado), `Triad.astro` (Corpo · Mente · Espírito),
`Icon.astro` (ícones lineares), `CtaButton.astro`, `Logo.astro`.

**Todos os valores dos gráficos são fictícios** e aparecem rotulados como ilustração.

## Analytics

Com IDs em `ANALYTICS_IDS`, o `Analytics.astro` injeta GTM, GA4 e/ou Meta Pixel. Os CTAs disparam:

- `cta_click` com `location` (`header`, `menu`, `hero`, `vsl`, `result`, `offer`, `final`) e `mode`
  (`checkout`, `fallback`, `anchor`) — no `dataLayer` e no `gtag`;
- `InitiateCheckout` no Pixel, só quando o clique leva ao checkout;
- `vsl_play` quando o vídeo é aberto.

Cada CTA tem `data-cta` e `data-location` para gatilhos no GTM.

## Publicação (futura)

O `npm run build` gera `dist/`, que pode ir para qualquer hospedagem estática (Vercel, Netlify,
Cloudflare Pages, GitHub Pages). Antes de publicar:

1. preencher `SITE.url` com o domínio final;
2. preencher `CHECKOUT_URL`, oferta, `LEGAL_URLS` e `COMPANY`;
3. trocar `SITE.indexable` para `true`;
4. configurar `ANALYTICS_IDS`, se for medir;
5. rodar `npm run build` e conferir com `npm run preview`.

Na Vercel/Netlify: comando de build `npm run build`, pasta de saída `dist`.

---

## Pendências e decisões em aberto

- **Logo vetorial:** só existe `logo-holohacking.png` (256 px); o `favicon.svg` embute esse mesmo PNG.
  Falta um SVG oficial para nitidez em telas grandes.
- **Número de perguntas do HOLOSCAN:** a LP usa **81** (briefing). Um comentário no CSS do produto
  fala em "84 perguntas". Confirmar e, se preciso, ajustar `HOLOSCAN_QUESTIONS`.
- **Respostas do FAQ a confirmar:** "Como recebo o acesso?", "Funciona no celular?" e "Posso gerar
  PDF?" descrevem o funcionamento esperado — confirmar antes de publicar.
- **PDF / WhatsApp:** a copy diz que o Resultado é salvo em PDF e enviado pelo canal que a
  nutricionista já usa. Não promete envio automático.
- **Nomes das ferramentas:** "OQ³ — O Que Quer · Precisa · Consegue" e "PQQ — Escada dos Porquês"
  seguem o briefing; no produto aparecem como "OQ3" e "PQQ — Pra Que Que?". As descrições vêm do produto.
- **Cores dos cinco sistemas:** existem nos dados do produto, mas não aparecem na interface. A LP
  mantém tudo monocromático, como o produto.
