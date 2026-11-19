/**
 * Dados gerais do Daruma Temaki e Rolls.
 * Tudo que aparece em mais de uma seção (endereço, telefones, links, nota do Google) mora aqui.
 * Procure por "[PREENCHER]" para ver o que ainda precisa ser preenchido.
 */

export const site = {
  nome: 'Daruma Temaki e Rolls',
  dominio: 'darumatemakirolls.com.br',
  url: 'https://darumatemakirolls.com.br',
  descricao:
    'Rodízio japonês, temakis e rolls no Jardim Maria Izabel, em Marília/SP. Jantar seis noites por semana e almoço aos domingos. Reserve pelo WhatsApp ou peça delivery.',

  endereco: {
    rua: 'Rua Pedro Preti, 6',
    bairro: 'Jardim Maria Izabel',
    cidade: 'Marília',
    uf: 'SP',
    cep: '17516-340',
  },
  geo: { latitude: -22.2248801, longitude: -49.931157 },

  /** Telefone fixo. */
  telefone: { exibicao: '(14) 3434-0044', e164: '+551434340044' },
  /** WhatsApp de reservas e delivery próprio: só números, com 55 + DDD. */
  whatsapp: { exibicao: '(14) 99140-7909', numero: '5514991407909' },

  links: {
    ifood: 'https://www.ifood.com.br/delivery/marilia-sp/daruma-temaki-rolls-ltda-jardim-maria-izabel/c8da849f-f89d-477a-a1e7-6502fc91b2b4',
    avaliarGoogle: 'https://g.page/r/Cf3TMwyyi96QEAE/review',
    instagram: 'https://www.instagram.com/darumatemakirollsmarilia/',
    facebook: 'https://www.facebook.com/darumatemakierollsmarilia/',
  },

  /** Nota e número de avaliações no Google (atualize de tempos em tempos). */
  google: { nota: 4.3, avaliacoes: 700 },

  /** Faixa de preço para o Google (de $ a $$$$). */
  faixaPreco: '$$',

  /** Aviso opcional no topo do site. */
  aviso: { ativo: false, texto: '', link: '' },

  /** Dados legais (política de privacidade). */
  razaoSocial: '[PREENCHER] razão social',
  cnpj: '[PREENCHER] CNPJ',
  emailPrivacidade: '[PREENCHER] e-mail do encarregado de dados',
} as const;

const { endereco, geo } = site;

export const enderecoLinha = `${endereco.rua} – ${endereco.bairro}, ${endereco.cidade} – ${endereco.uf}, CEP ${endereco.cep}`;

export const links = {
  ...site.links,
  telefone: `tel:${site.telefone.e164}`,
  googleMaps: `https://www.google.com/maps/dir/?api=1&destination=${geo.latitude},${geo.longitude}`,
  waze: `https://waze.com/ul?ll=${geo.latitude},${geo.longitude}&navigate=yes`,
};

/** Nota com vírgula: 4.3 → "4,3" */
export const notaGoogle = site.google.nota.toLocaleString('pt-BR', { minimumFractionDigits: 1 });
/** 700 → "700+" */
export const avaliacoesGoogle = `${site.google.avaliacoes.toLocaleString('pt-BR')}+`;

/** Mensagens prontas do WhatsApp. */
export const mensagens = {
  reserva: 'Olá! Quero reservar uma mesa no Daruma.\n\nData:\nHorário:\nPessoas:',
  delivery: 'Olá! Quero fazer um pedido de delivery.',
  grupos: 'Olá! Quero reservar para um grupo ou aniversário.\n\nData:\nPessoas:\nOcasião:',
  almocoDomingo: 'Olá! Quero reservar para o almoço de domingo.\n\nData:\nHorário:\nPessoas:',
  geral: 'Olá! Vim pelo site do Daruma.',
} as const;

/** Link do WhatsApp com mensagem pronta (a mensagem é escrita pelo próprio cliente). */
export function linkWhatsApp(mensagem: string = mensagens.geral): string {
  return `https://wa.me/${site.whatsapp.numero}?text=${encodeURIComponent(mensagem)}`;
}

/** Acrescenta UTM a um link externo (nunca dados pessoais). */
export function comUtm(url: string, medium: string, campaign: string, content?: string): string {
  const u = new URL(url);
  u.searchParams.set('utm_source', 'site');
  u.searchParams.set('utm_medium', medium);
  u.searchParams.set('utm_campaign', campaign);
  if (content) u.searchParams.set('utm_content', content);
  return u.toString();
}

export const navegacao = [
  { rotulo: 'Rodízio', href: '/#rodizio' },
  { rotulo: 'Cardápio', href: '/cardapio' },
  { rotulo: 'Delivery', href: '/#delivery' },
  { rotulo: 'Sobre', href: '/#sobre' },
  { rotulo: 'Contato', href: '/#contato' },
] as const;
