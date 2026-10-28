// components/i18n.jsx — bilingual copy

window.I18N = {
  pt: {
    nav: { product: "Produto", features: "Recursos", ia: "IA", customers: "Clientes", pricing: "Preços" },
    cta: { demo: "Agendar demo", trial: "Teste grátis", signin: "Entrar", talk: "Falar com vendas" },
    hero: {
      eyebrow: "ERP construído por IA para a indústria química",
      title_pre: "O sistema que ",
      title_em: "constrói o ERP",
      title_post: " da sua empresa.",
      sub: "A IA monta o ERP do jeito que a sua fábrica funciona. Cada setor fala com você, você vê tudo que está sendo mexido, e seus dados conversam com a IA pelo seu próprio ChatGPT ou Claude Code.",
      cta_primary: "Assistir demo",
      cta_secondary: "Ver produto ao vivo",
      stats: [
        { k: "18", v: "setores com agente próprio" },
        { k: "100%", v: "das ações auditadas" },
        { k: "21 dias", v: "para operar com o seu ERP" }
      ]
    },
    logos: "Fábricas que já operam com chemy",
    pillars: {
      eyebrow: "Módulos",
      title: "Um ERP que a IA constrói com você.",
      items: [
        { tag: "01", t: "Pedidos & Pipeline", d: "CRM de revendas, pintores e construtoras. Pipeline visual, cotação com tabela multi-nível, aprovação de desconto no WhatsApp." },
        { tag: "02", t: "Lote & Estoque", d: "Rastreabilidade por batelada. Matéria-prima ligada ao produto final. FEFO automático. Alerta de validade de resina e pigmento." },
        { tag: "03", t: "Produção", d: "Ordens de fabricação geradas do pedido. Fórmulas versionadas. Apontamento no chão de fábrica. Custo real por litro." },
        { tag: "04", t: "Força de vendas", d: "App offline para o representante. Rota inteligente, histórico do cliente, catálogo com leque de cores e simulador de ambiente." },
        { tag: "05", t: "IA Chemy", d: "Conecte seu ChatGPT ou Claude Code. Cada setor tem um agente que responde a você, com permissão por setor e cada ação registrada." },
        { tag: "06", t: "Financeiro", d: "Faturamento, boleto, comissão do representante e repasse do misturador. ERP nativo, ou a IA traz o seu ERP atual para dentro e você usa só o que quiser." }
      ]
    },
    ia: {
      eyebrow: "Chemy IA",
      title: "Seu ERP, construído conversando.",
      sub: "Conecte seu ChatGPT ou Claude Code. A IA monta a estrutura da sua empresa, cada setor responde a você e toda ação fica registrada com quem fez e quando.",
      examples: [
        { time: "08:14", t: "Implantação — via Claude Code", body: "Li a estrutura do seu ERP atual: 412 produtos, 38 fórmulas, 3 depósitos. Mapeamento pronto para você aprovar. Nada foi gravado ainda." },
        { time: "09:02", t: "Estoque — setor respondendo", body: "Lote 2041-B de resina acrílica reservado para a OP 118. Pedido por Marcos às 08:57, pelo ChatGPT. Registrado na auditoria." },
        { time: "14:30", t: "Vendas — setor respondendo", body: "Casa das Tintas está há 23 dias sem comprar. Montei a proposta: 180L Branco Neve + 40L Cinza Urbano. Preciso da sua aprovação para enviar." }
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
      title: "Pronto para um ERP que a IA constrói com você?",
      sub: "30 minutos de demo. Conecte seu ChatGPT ou Claude Code no primeiro dia.",
      cta: "Agendar demo"
    },
    footer: {
      tagline: "ERP para a indústria química, construído e operado com IA.",
      cols: [
        { h: "Produto", links: ["Pedidos", "Estoque & Lotes", "Produção", "Força de vendas", "IA Chemy", "Agentes & MCP"] },
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
      eyebrow: "AI-built ERP for the chemical industry",
      title_pre: "The system that ",
      title_em: "builds the ERP",
      title_post: " for your company.",
      sub: "AI assembles the ERP the way your factory actually runs. Every department talks to you, you see everything being touched, and your data talks to AI through your own ChatGPT or Claude Code.",
      cta_primary: "Watch demo",
      cta_secondary: "See live product",
      stats: [
        { k: "18", v: "departments with their own agent" },
        { k: "100%", v: "of actions audited" },
        { k: "21 days", v: "to go live with your ERP" }
      ]
    },
    logos: "Factories already running on chemy",
    pillars: {
      eyebrow: "Modules",
      title: "An ERP that AI builds with you.",
      items: [
        { tag: "01", t: "Orders & Pipeline", d: "CRM for dealers, painters and contractors. Visual pipeline, multi-tier pricing, discount approval via WhatsApp." },
        { tag: "02", t: "Lot & Stock", d: "Batch-level traceability. Raw material linked to finished product. Auto FEFO. Resin & pigment shelf-life alerts." },
        { tag: "03", t: "Production", d: "MOs generated from the order. Versioned formulas. Shop-floor reporting. Real cost per liter." },
        { tag: "04", t: "Field sales", d: "Offline app for reps. Smart routing, customer history, color fan deck and room visualizer." },
        { tag: "05", t: "Chemy AI", d: "Connect your ChatGPT or Claude Code. Each department has an agent that answers to you, with per-department permissions and every action logged." },
        { tag: "06", t: "Finance", d: "Invoicing, bank slip, rep commission and mixer royalties. Native ERP, or AI brings your current ERP in and you use only what you want." }
      ]
    },
    ia: {
      eyebrow: "Chemy AI",
      title: "Your ERP, built by talking.",
      sub: "Connect your ChatGPT or Claude Code. AI assembles your company's structure, each department answers to you, and every action is logged with who did it and when.",
      examples: [
        { time: "08:14", t: "Onboarding — via Claude Code", body: "I read your current ERP's structure: 412 products, 38 formulas, 3 warehouses. Mapping ready for your approval. Nothing written yet." },
        { time: "09:02", t: "Inventory — department replying", body: "Lot 2041-B of acrylic resin reserved for MO 118. Requested by Marcos at 08:57 via ChatGPT. Logged in the audit trail." },
        { time: "14:30", t: "Sales — department replying", body: "Casa das Tintas hasn't ordered in 23 days. Proposal drafted: 180L Snow White + 40L Urban Grey. I need your approval to send it." }
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
      title: "Ready for an ERP that AI builds with you?",
      sub: "30-minute demo. Connect your ChatGPT or Claude Code on day one.",
      cta: "Book demo"
    },
    footer: {
      tagline: "ERP for the chemical industry, built and operated with AI.",
      cols: [
        { h: "Product", links: ["Orders", "Stock & Lots", "Production", "Field sales", "Chemy AI", "Agents & MCP"] },
        { h: "Company", links: ["About", "Customers", "Careers", "Blog"] },
        { h: "Resources", links: ["Help center", "API", "Security", "Status"] }
      ],
      copy: "© 2026 chemy.ia · São Paulo / Joinville"
    }
  }
};

window.PAINT_SWATCHES = [
  { id: "neve",      name: { pt: "Branco Neve",     en: "Snow White" },       code: "CH-1001", hex: "#F5F1EA" },
  { id: "urbano",    name: { pt: "Cinza Urbano",    en: "Urban Grey" },       code: "CH-2041", hex: "#9AA0A6" },
  { id: "grafite",   name: { pt: "Preto Grafite",   en: "Graphite Black" },   code: "CH-9900", hex: "#1E1F22" },
  { id: "goiaba",    name: { pt: "Vermelho Goiaba", en: "Guava Red" },        code: "CH-3207", hex: "#D94A38" },
  { id: "petroleo",  name: { pt: "Azul Petróleo",   en: "Petroleum Blue" },   code: "CH-5188", hex: "#114E5C" },
  { id: "salvia",    name: { pt: "Verde Sálvia",    en: "Sage Green" },       code: "CH-6102", hex: "#8FA886" },
  { id: "sahara",    name: { pt: "Ocre Sahara",     en: "Sahara Ochre" },     code: "CH-7450", hex: "#C89B5A" },
  { id: "terracota", name: { pt: "Rosa Terracota",  en: "Terracotta Rose" },  code: "CH-3311", hex: "#C87A6B" }
];
