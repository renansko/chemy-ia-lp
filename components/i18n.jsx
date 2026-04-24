// components/i18n.jsx — bilingual copy

window.I18N = {
  pt: {
    nav: { product: "Produto", features: "Recursos", ia: "IA", customers: "Clientes", pricing: "Preços" },
    cta: { demo: "Agendar demo", trial: "Teste grátis", signin: "Entrar", talk: "Falar com vendas" },
    hero: {
      eyebrow: "Motor de operações para fábricas de tintas",
      title_pre: "O sistema que ",
      title_em: "faz sua fábrica",
      title_post: " vender, produzir e entregar.",
      sub: "Do pedido do balcão ao batelado na linha. Chemy unifica vendas, estoque por lote, produção e força de campo em uma só plataforma — com IA que sugere pedidos antes do cliente pedir.",
      cta_primary: "Assistir demo",
      cta_secondary: "Ver produto ao vivo",
      stats: [
        { k: "+32%", v: "pedidos por representante" },
        { k: "−4 dias", v: "no ciclo de produção" },
        { k: "98%", v: "rastreabilidade de lote" }
      ]
    },
    logos: "Fábricas que já operam com chemy",
    pillars: {
      eyebrow: "Módulos",
      title: "Uma plataforma. Toda a operação da tinta.",
      items: [
        { tag: "01", t: "Pedidos & Pipeline", d: "CRM de revendas, pintores e construtoras. Pipeline visual, cotação com tabela multi-nível, aprovação de desconto no WhatsApp." },
        { tag: "02", t: "Lote & Estoque", d: "Rastreabilidade por batelada. Matéria-prima ligada ao produto final. FEFO automático. Alerta de validade de resina e pigmento." },
        { tag: "03", t: "Produção", d: "Ordens de fabricação geradas do pedido. Fórmulas versionadas. Apontamento no chão de fábrica. Custo real por litro." },
        { tag: "04", t: "Força de vendas", d: "App offline para o representante. Rota inteligente, histórico do cliente, catálogo com leque de cores e simulador de ambiente." },
        { tag: "05", t: "IA Chemy", d: "Sugere o próximo pedido por sazonalidade. Prevê ruptura de pigmento. Detecta revenda que parou de comprar." },
        { tag: "06", t: "Financeiro", d: "Faturamento, boleto, comissão do representante e repasse do misturador. ERP nativo ou integrado ao seu." }
      ]
    },
    ia: {
      eyebrow: "Chemy IA",
      title: "Sua fábrica, antecipada.",
      sub: "Chemy IA lê seu histórico de 18 meses e te diz o que pedir, o que produzir e quem ligar — hoje.",
      examples: [
        { time: "08:14", t: "Casa das Tintas — Fortaleza", body: "Não compra há 23 dias. Média de ciclo: 18 dias. Sugestão: ligar hoje. Proposta pronta: 180L Branco Neve + 40L Cinza Urbano." },
        { time: "09:02", t: "Produção — Linha 2", body: "Ruptura projetada de resina acrílica em 6 dias. Pedido sugerido ao fornecedor Ômega (8.400L) já no carrinho." },
        { time: "14:30", t: "Sazonalidade — litoral SC", body: "Vermelho Goiaba sobe 34% em novembro (3 anos). Sugestão: programar 2 bateladas extras a partir de 05/11." }
      ]
    },
    customers: {
      eyebrow: "Clientes",
      title: "Fabricantes que operam com chemy",
      quote: "A gente parou de perder venda por falta de um tom que o depósito já tinha. Em quatro meses, nosso representante virou dois representantes.",
      by: "Marília Tavares, Diretora Comercial — Tintas Horizonte"
    },
    pricing: {
      eyebrow: "Planos",
      title: "Do balcão ao multinacional.",
      plans: [
        { name: "Linha", price: "R$ 890", unit: "/mês", desc: "Até 5 usuários. Pedidos, estoque e catálogo.", cta: "Começar" },
        { name: "Fábrica", price: "R$ 2.490", unit: "/mês", desc: "Produção, lotes, força de vendas, IA básica.", cta: "Mais escolhido", highlight: true },
        { name: "Indústria", price: "Sob consulta", unit: "", desc: "Multi-planta, ERP custom, IA avançada, SLA dedicado.", cta: "Falar com vendas" }
      ]
    },
    final: {
      title: "Pronto para uma fábrica que opera sozinha?",
      sub: "30 minutos de demo. Implantação em 21 dias.",
      cta: "Agendar demo"
    },
    footer: {
      tagline: "Motor de operações para a indústria química de tintas e vernizes.",
      cols: [
        { h: "Produto", links: ["Pedidos", "Estoque & Lotes", "Produção", "Força de vendas", "IA Chemy"] },
        { h: "Empresa", links: ["Sobre", "Clientes", "Carreiras", "Blog"] },
        { h: "Recursos", links: ["Centro de ajuda", "API", "Segurança", "Status"] }
      ],
      copy: "© 2026 chemy.ia · CNPJ 00.000.000/0001-00 · São Paulo / Joinville"
    }
  },
  en: {
    nav: { product: "Product", features: "Features", ia: "AI", customers: "Customers", pricing: "Pricing" },
    cta: { demo: "Book demo", trial: "Free trial", signin: "Sign in", talk: "Talk to sales" },
    hero: {
      eyebrow: "Operations engine for paint factories",
      title_pre: "The system that ",
      title_em: "makes your factory",
      title_post: " sell, produce and deliver.",
      sub: "From counter order to batched line. Chemy unifies sales, lot inventory, production and field reps in one platform — with AI that suggests orders before the customer asks.",
      cta_primary: "Watch demo",
      cta_secondary: "See live product",
      stats: [
        { k: "+32%", v: "orders per rep" },
        { k: "−4 days", v: "production cycle" },
        { k: "98%", v: "batch traceability" }
      ]
    },
    logos: "Factories already running on chemy",
    pillars: {
      eyebrow: "Modules",
      title: "One platform. The entire paint operation.",
      items: [
        { tag: "01", t: "Orders & Pipeline", d: "CRM for dealers, painters and contractors. Visual pipeline, multi-tier pricing, discount approval via WhatsApp." },
        { tag: "02", t: "Lot & Stock", d: "Batch-level traceability. Raw material linked to finished product. Auto FEFO. Resin & pigment shelf-life alerts." },
        { tag: "03", t: "Production", d: "MOs generated from the order. Versioned formulas. Shop-floor reporting. Real cost per liter." },
        { tag: "04", t: "Field sales", d: "Offline app for reps. Smart routing, customer history, color fan deck and room visualizer." },
        { tag: "05", t: "Chemy AI", d: "Suggests next order by seasonality. Forecasts pigment outages. Flags dormant dealers." },
        { tag: "06", t: "Finance", d: "Invoicing, bank slip, rep commission and mixer royalties. Native ERP or plugs into yours." }
      ]
    },
    ia: {
      eyebrow: "Chemy AI",
      title: "Your factory, one step ahead.",
      sub: "Chemy AI reads 18 months of history and tells you what to order, what to produce and who to call — today.",
      examples: [
        { time: "08:14", t: "Casa das Tintas — Fortaleza", body: "No orders in 23 days. Avg cycle: 18 days. Suggestion: call today. Proposal ready: 180L Snow White + 40L Urban Grey." },
        { time: "09:02", t: "Production — Line 2", body: "Acrylic resin outage projected in 6 days. Suggested PO to supplier Ômega (8,400L) already in cart." },
        { time: "14:30", t: "Seasonality — SC coast", body: "Guava Red rises 34% in November (3-yr avg). Suggestion: schedule 2 extra batches from Nov 5." }
      ]
    },
    customers: {
      eyebrow: "Customers",
      title: "Makers running on chemy",
      quote: "We stopped losing sales because of a shade the warehouse already had. In four months, our rep became two reps.",
      by: "Marília Tavares, Commercial Director — Tintas Horizonte"
    },
    pricing: {
      eyebrow: "Plans",
      title: "From counter to multinational.",
      plans: [
        { name: "Line", price: "US$ 179", unit: "/mo", desc: "Up to 5 users. Orders, stock and catalog.", cta: "Start" },
        { name: "Factory", price: "US$ 499", unit: "/mo", desc: "Production, lots, field sales, basic AI.", cta: "Most popular", highlight: true },
        { name: "Industry", price: "Custom", unit: "", desc: "Multi-plant, custom ERP, advanced AI, SLA.", cta: "Talk to sales" }
      ]
    },
    final: {
      title: "Ready for a factory that runs itself?",
      sub: "30-minute demo. Go live in 21 days.",
      cta: "Book demo"
    },
    footer: {
      tagline: "Operations engine for the paint & coatings industry.",
      cols: [
        { h: "Product", links: ["Orders", "Stock & Lots", "Production", "Field sales", "Chemy AI"] },
        { h: "Company", links: ["About", "Customers", "Careers", "Blog"] },
        { h: "Resources", links: ["Help center", "API", "Security", "Status"] }
      ],
      copy: "© 2026 chemy.ia · São Paulo / Joinville"
    }
  }
};

window.PAINT_SWATCHES = [
  { name: { pt: "Branco Neve", en: "Snow White" }, code: "CH-1001", hex: "#F5F1EA" },
  { name: { pt: "Cinza Urbano", en: "Urban Grey" }, code: "CH-2041", hex: "#9AA0A6" },
  { name: { pt: "Preto Grafite", en: "Graphite Black" }, code: "CH-9900", hex: "#1E1F22" },
  { name: { pt: "Vermelho Goiaba", en: "Guava Red" }, code: "CH-3207", hex: "#D94A38" },
  { name: { pt: "Azul Petróleo", en: "Petroleum Blue" }, code: "CH-5188", hex: "#114E5C" },
  { name: { pt: "Verde Sálvia", en: "Sage Green" }, code: "CH-6102", hex: "#8FA886" },
  { name: { pt: "Ocre Sahara", en: "Sahara Ochre" }, code: "CH-7450", hex: "#C89B5A" },
  { name: { pt: "Rosa Terracota", en: "Terracotta Rose" }, code: "CH-3311", hex: "#C87A6B" }
];
