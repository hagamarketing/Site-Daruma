/**
 * Cardápio à la carte, mostrado em /cardapio.
 * Preço vazio (null) aparece como "R$ [PREENCHER]". Procure "[PREENCHER]" para ver o que falta.
 * Foto (opcional): coloque o arquivo em src/assets/fotos/pratos/, importe aqui e use `foto: nomeDaImportacao`
 * (3:2, mínimo 1200×800). Prato sem foto aparece só com o texto.
 */
import type { ImageMetadata } from 'astro';

export const CATEGORIAS = {
  entradas: 'Entradas',
  temakis: 'Temakis',
  rolls: 'Rolls',
  combinados: 'Combinados',
  'hot-rolls': 'Hot rolls',
  sashimis: 'Sashimis',
  quentes: 'Quentes',
  bebidas: 'Bebidas',
  sobremesas: 'Sobremesas',
} as const;
export type Categoria = keyof typeof CATEGORIAS;

export const SELOS = {
  picante: { rotulo: 'Picante', variante: 'salmao' },
  vegetariano: { rotulo: 'Vegetariano', variante: 'sucesso' },
  'mais-pedido': { rotulo: 'Mais pedido', variante: 'daruma' },
  novo: { rotulo: 'Novo', variante: 'ouro' },
} as const;
export type SeloPrato = keyof typeof SELOS;

export interface Prato {
  /** Identificador único (só minúsculas, números e hífens). */
  slug: string;
  nome: string;
  categoria: Categoria;
  descricao: string;
  /** Preço em reais. null = ainda não definido. */
  preco: number | null;
  foto?: ImageMetadata;
  alt: string;
  selos: SeloPrato[];
}

export const pratos: Prato[] = [
  {
    slug: 'exemplo-entradas',
    nome: '[PREENCHER] Entrada de exemplo',
    categoria: 'entradas',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria entrada',
    selos: [],
  },
  {
    slug: 'exemplo-temakis',
    nome: '[PREENCHER] Temaki de exemplo',
    categoria: 'temakis',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria temaki',
    selos: ['mais-pedido'],
  },
  {
    slug: 'exemplo-rolls',
    nome: '[PREENCHER] Roll de exemplo',
    categoria: 'rolls',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria roll',
    selos: [],
  },
  {
    slug: 'exemplo-combinados',
    nome: '[PREENCHER] Combinado de exemplo',
    categoria: 'combinados',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria combinado',
    selos: [],
  },
  {
    slug: 'exemplo-hot-rolls',
    nome: '[PREENCHER] Hot roll de exemplo',
    categoria: 'hot-rolls',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria hot roll',
    selos: ['novo'],
  },
  {
    slug: 'exemplo-sashimis',
    nome: '[PREENCHER] Sashimi de exemplo',
    categoria: 'sashimis',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria sashimi',
    selos: [],
  },
  {
    slug: 'exemplo-quentes',
    nome: '[PREENCHER] Prato quente de exemplo',
    categoria: 'quentes',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria prato quente',
    selos: ['picante'],
  },
  {
    slug: 'exemplo-bebidas',
    nome: '[PREENCHER] Bebida de exemplo',
    categoria: 'bebidas',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria bebida',
    selos: [],
  },
  {
    slug: 'exemplo-sobremesas',
    nome: '[PREENCHER] Sobremesa de exemplo',
    categoria: 'sobremesas',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria sobremesa',
    selos: [],
  },
];

/** Pratos agrupados por categoria, na ordem do cardápio. */
export function pratosPorCategoria() {
  return (Object.keys(CATEGORIAS) as Categoria[])
    .map((categoria) => ({ categoria, rotulo: CATEGORIAS[categoria], pratos: pratos.filter((p) => p.categoria === categoria) }))
    .filter((g) => g.pratos.length > 0);
}
