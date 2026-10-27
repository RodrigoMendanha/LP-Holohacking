/* ===========================================================================
   CONFIGURAÇÃO CENTRAL DA LP

   Tudo o que é decisão comercial mora aqui — e só aqui. Nenhum componente
   tem preço, link, nome ou depoimento escrito direto no HTML.

   Regra: campo vazio ("" ou []) = a página mostra um estado neutro e
   honesto, nunca um valor inventado nem um link quebrado.
   =========================================================================== */

/* ---------------------------------------------------------------------------
   SITE / SEO
--------------------------------------------------------------------------- */
export const SITE = {
  name: "HoloHacking",
  /** Grafia oficial: HoloHacking (dois H maiúsculos). */
  descriptor: "a plataforma clínica da Nutrição Holística",
  title: "HoloHacking | Atendimento Holístico Estruturado para Nutricionistas",
  description:
    "Organize Mapeamento Holístico, HOLOSCAN, ferramentas, estratégias, Resultado HOLOS e Evolução em uma única jornada profissional.",
  /** URL pública definitiva, sem barra no final. Ex.: "https://holohacking.com.br".
   *  Vazio = sem canonical absoluto e sem sitemap (normal antes do domínio). */
  url: "",
  locale: "pt_BR",
  ogImage: "/images/social/og-holohacking.png",
  ogImageAlt: "HoloHacking — plataforma profissional para nutricionistas, com o radar HOLOSCAN em dourado.",
  /** false enquanto a página estiver em revisão: gera noindex. */
  indexable: false,
};

/* ---------------------------------------------------------------------------
   VSL
   Preencha UM dos dois:
   - VSL_URL: link de YouTube (inclusive não listado), Panda Video, Vimeo
     ou qualquer URL de embed em iframe.
   - VSL_EMBED_HTML: o código de incorporação completo do provedor
     (ex.: VTurb), colado como está.
   Os dois vazios = placeholder "Vídeo de apresentação em breve."
--------------------------------------------------------------------------- */
/** false = a seção do vídeo não aparece na página (nem o CTA dela).
 *  Ligue quando o vídeo existir e preencha VSL_URL ou VSL_EMBED_HTML. */
export const SHOW_VSL = false;
export const VSL_URL = "";
export const VSL_EMBED_HTML = "";
/** Imagem de capa opcional para o vídeo (16:9), em /public. */
export const VSL_POSTER = "";

/* ---------------------------------------------------------------------------
   CTA
   Todos os botões de compra da página leem daqui.
   - CHECKOUT_URL preenchido: todo CTA leva ao checkout.
   - CHECKOUT_URL vazio e CTA_FALLBACK_URL preenchido (lista de espera,
     WhatsApp comercial…): todo CTA leva para lá.
   - Os dois vazios: os CTAs rolam até a seção de oferta, e o botão da
     própria oferta aparece desativado. Nenhum link quebrado.
--------------------------------------------------------------------------- */
export const CHECKOUT_URL = "";
export const CTA_FALLBACK_URL = "";
export const CTA_LABEL = "Conhecer o HoloHacking";
export const CTA_LABEL_FINAL = "Quero conhecer o HoloHacking";

/** CTA do topo (header e hero).
 *  "navegacao" = "Ver como funciona", rola até o mecanismo (uso atual,
 *  enquanto não existe ação comercial definida).
 *  "comercial" = usa o mesmo destino e texto dos CTAs comerciais acima. */
export const TOP_CTA_MODE: "navegacao" | "comercial" = "navegacao";
export const TOP_CTA_NAV_LABEL = "Ver como funciona";
export const TOP_CTA_NAV_HREF = "#como-funciona";

/* ---------------------------------------------------------------------------
   OFERTA — nada é inventado. Vazio = "Condições de acesso serão
   apresentadas em breve."
--------------------------------------------------------------------------- */
export const PLAN_NAME = "";
/** Texto exibido como está. Ex.: "R$ 1.997" */
export const PRICE = "";
/** Ex.: "ou 12x de R$ 199,70" */
export const INSTALLMENTS = "";
/** Ex.: "Acesso por 12 meses" */
export const ACCESS_DURATION = "";
/** Ex.: "Garantia incondicional de 7 dias" */
export const GUARANTEE = "";
/** Ex.: "Suporte por e-mail em dias úteis" */
export const SUPPORT = "";
/** Ex.: "Atualizações da plataforma incluídas durante o acesso" */
export const UPDATES = "";
export const BONUSES: string[] = [];
/** Ex.: "Pix, boleto ou cartão" */
export const PAYMENT_METHODS = "";
/** Ex.: "Acesso enviado por e-mail logo após a confirmação" */
export const ACCESS_INFO = "";

/* ---------------------------------------------------------------------------
   HOLOSCAN — números que aparecem na copy.
--------------------------------------------------------------------------- */
export const HOLOSCAN_QUESTIONS = 81;
export const PLAYBOOK_SYSTEMS = 5;
export const PLAYBOOK_FOCI = 15;
export const PLAYBOOK_STRATEGIES = 75;

/* ---------------------------------------------------------------------------
   RODRIGO / ORIGEM — [CONTEÚDO DO RODRIGO SERÁ ADICIONADO]
   Nada aqui é inventado. Enquanto CREATOR_NAME estiver vazio, a seção
   mostra só o texto institucional sobre o método (sem biografia).
--------------------------------------------------------------------------- */
export const CREATOR_NAME = "";
export const CREATOR_ROLE = "";
/** Caminho em /public, ex.: "/images/creator/rodrigo.jpg" (retrato 4:5). */
export const CREATOR_IMAGE = "";
/** A história: um ou mais parágrafos. */
export const CREATOR_BIO: string[] = [];
/** A origem do método: um ou mais parágrafos. */
export const CREATOR_METHOD_ORIGIN: string[] = [];
/** Por que criou o HoloHacking: um ou mais parágrafos. */
export const CREATOR_WHY: string[] = [];
/** Formação e credenciais, uma por linha. Ex.: "Nutricionista — CRN X 0000" */
export const CREATOR_CREDENTIALS: string[] = [];

/* ---------------------------------------------------------------------------
   PROVA SOCIAL — "Quem atende com HoloHacking". Só depoimentos reais e
   autorizados (de 3 a 6). Lista vazia = seção oculta na página.
--------------------------------------------------------------------------- */
export interface Testimonial {
  quote: string;
  name: string;
  /** Ex.: "Nutricionista · São Paulo" */
  role?: string;
  /** Caminho em /public. Opcional. */
  image?: string;
}
export const TESTIMONIALS: Testimonial[] = [];

/* ---------------------------------------------------------------------------
   PRODUTO POR DENTRO — capturas reais do app, feitas no modo demonstração
   com a paciente fictícia "Marina Alves" (caso-marina.js do produto).
   Nunca usar paciente real.
   src vazio = moldura ilustrativa com o aviso "Captura do produto em breve".
--------------------------------------------------------------------------- */
export interface ProductShot {
  id: "dashboard" | "holoscan" | "ferramentas" | "playbook" | "resultado" | "evolucao";
  title: string;
  caption: string;
  /** Caminho em /public, ex.: "/images/product/holoscan.webp" (16:10). */
  src: string;
  alt: string;
}
export const PRODUCT_SHOTS: ProductShot[] = [
  {
    id: "dashboard",
    title: "Ficha do paciente",
    caption: "Cada paciente com a sua jornada, da pré-consulta ao retorno.",
    src: "/images/product/dashboard.webp",
    alt: "Ficha da paciente fictícia Marina Alves no HoloHacking, com ações rápidas, resumo e a jornada clínica.",
  },
  {
    id: "holoscan",
    title: "HOLOSCAN",
    caption: "O radar dos cinco territórios e a ordem do que pede mais investigação.",
    src: "/images/product/holoscan.webp",
    alt: "Tela do HOLOSCAN com o radar dos cinco sistemas e a lista “Onde olhar primeiro”.",
  },
  {
    id: "ferramentas",
    title: "Ferramentas",
    caption: "OQ³, uma das ferramentas de Corpo: desejo, necessidade e capacidade.",
    src: "/images/product/ferramentas.webp",
    alt: "Ferramenta OQ³ do módulo Corpo, com as três perguntas: quer, precisa e consegue.",
  },
  { id: "playbook", title: "Playbook HOLOS", caption: "Focos e estratégias possíveis, para apoiar a sua decisão.", src: "", alt: "" },
  { id: "resultado", title: "Resultado HOLOS", caption: "O documento que o paciente leva, construído por você.", src: "", alt: "" },
  {
    id: "evolucao",
    title: "Evolução",
    caption: "Antes e Agora lado a lado, sem cálculo automático de melhora ou piora.",
    src: "/images/product/evolucao.webp",
    alt: "Tela de evolução do HOLOSCAN comparando duas aplicações, com radar tracejado e preenchido e as notas de cada sistema.",
  },
];

/* ---------------------------------------------------------------------------
   FAQ — revisar as respostas marcadas com [CONFIRMAR] no README.
--------------------------------------------------------------------------- */
export interface FaqItem {
  q: string;
  a: string;
}
export const FAQ: FaqItem[] = [
  {
    q: "Preciso instalar alguma coisa?",
    a: "Não. O HoloHacking funciona no navegador, sem instalar programas.",
  },
  {
    q: "Funciona no celular?",
    a: "Sim, pelo navegador. A interface se adapta a telas menores.",
  },
  {
    q: "O HOLOSCAN faz diagnóstico?",
    a: "Não. O HOLOSCAN organiza os relatos do atendimento em cinco territórios e ajuda a visualizar onde vale investigar com mais atenção. Não é diagnóstico e não substitui exames nem o julgamento profissional.",
  },
  {
    q: "A plataforma decide a conduta?",
    a: "Não. O HOLOSCAN e o Playbook HOLOS reúnem informações e possibilidades. Quem interpreta, escolhe as estratégias e define a conduta é sempre a nutricionista.",
  },
  {
    q: "Preciso aplicar todas as ferramentas?",
    a: "Não. Você escolhe as ferramentas de acordo com cada atendimento e aprofunda apenas onde fizer sentido.",
  },
  {
    q: "Como funciona o Resultado HOLOS?",
    a: "Ao final do atendimento, você organiza o que foi compreendido — momento atual, foco desta fase, estratégias escolhidas e próximos passos — em um documento claro para o paciente, com apoio do Playbook HOLOS.",
  },
  {
    q: "Como funciona o retorno?",
    a: "O contexto fica registrado na ficha do paciente. No retorno, Antes e Agora aparecem lado a lado para apoiar a sua leitura do que mudou. O sistema não calcula melhora ou piora.",
  },
  {
    q: "Posso gerar PDF?",
    a: "Sim. O Resultado HOLOS pode ser gerado em PDF e compartilhado pelo canal que você já usa com o paciente, como o WhatsApp.",
  },
  {
    q: "Como recebo o acesso?",
    a: "A forma de acesso será apresentada junto com as condições de acesso.",
  },
  {
    q: "O paciente usa o sistema?",
    a: "O paciente participa pelo link do Mapeamento Holístico e recebe o Resultado HOLOS, sem precisar criar conta. A condução do atendimento na plataforma é feita pela nutricionista.",
  },
];

/* ---------------------------------------------------------------------------
   RODAPÉ / LEGAL — sem CNPJ inventado. Vazio = não aparece.
--------------------------------------------------------------------------- */
export const LEGAL_URLS = {
  terms: "",
  privacy: "",
  contact: "",
};
export const COMPANY = {
  legalName: "",
  cnpj: "",
  address: "",
  email: "",
};

/* ---------------------------------------------------------------------------
   ANALYTICS — IDs vazios = nenhum script de terceiros é carregado.
--------------------------------------------------------------------------- */
export const ANALYTICS_IDS = {
  /** Ex.: "GTM-XXXXXXX". Se houver GTM, prefira configurar GA4 e Pixel dentro dele. */
  GTM: "",
  /** Ex.: "G-XXXXXXXXXX" */
  GA4: "",
  /** Ex.: "123456789012345" */
  META_PIXEL: "",
};
