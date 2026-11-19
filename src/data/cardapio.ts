/**
 * Cardápio à la carte. Cada prato aparece em /cardapio (e os marcados com `destaque` na home).
 * Preço vazio (null) aparece como "R$ [PREENCHER]". Procure "[PREENCHER]" para ver o que falta.
 * Foto: coloque o arquivo em src/assets/fotos/pratos/<slug>/foto.jpg (3:2, mínimo 1200×800).
 */
import type { ImageMetadata } from 'astro';
import fotoExemploEntradas from '@/assets/fotos/pratos/exemplo-entradas/foto.jpg';
import fotoExemploTemakis from '@/assets/fotos/pratos/exemplo-temakis/foto.jpg';
import fotoExemploRolls from '@/assets/fotos/pratos/exemplo-rolls/foto.jpg';
import fotoExemploCombinados from '@/assets/fotos/pratos/exemplo-combinados/foto.jpg';
import fotoExemploHotRolls from '@/assets/fotos/pratos/exemplo-hot-rolls/foto.jpg';
import fotoExemploSashimis from '@/assets/fotos/pratos/exemplo-sashimis/foto.jpg';
import fotoExemploQuentes from '@/assets/fotos/pratos/exemplo-quentes/foto.jpg';
import fotoExemploBebidas from '@/assets/fotos/pratos/exemplo-bebidas/foto.jpg';
import fotoExemploSobremesas from '@/assets/fotos/pratos/exemplo-sobremesas/foto.jpg';

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
  /** Aparece entre os destaques da home (até 6). */
  destaque: boolean;
}

export const pratos: Prato[] = [
  {
    slug: 'exemplo-entradas',
    nome: '[PREENCHER] Entrada de exemplo',
    categoria: 'entradas',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    foto: fotoExemploEntradas,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria entrada',
    selos: [],
    destaque: true,
  },
  {
    slug: 'exemplo-temakis',
    nome: '[PREENCHER] Temaki de exemplo',
    categoria: 'temakis',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    foto: fotoExemploTemakis,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria temaki',
    selos: ['mais-pedido'],
    destaque: true,
  },
  {
    slug: 'exemplo-rolls',
    nome: '[PREENCHER] Roll de exemplo',
    categoria: 'rolls',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    foto: fotoExemploRolls,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria roll',
    selos: [],
    destaque: true,
  },
  {
    slug: 'exemplo-combinados',
    nome: '[PREENCHER] Combinado de exemplo',
    categoria: 'combinados',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    foto: fotoExemploCombinados,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria combinado',
    selos: [],
    destaque: true,
  },
  {
    slug: 'exemplo-hot-rolls',
    nome: '[PREENCHER] Hot roll de exemplo',
    categoria: 'hot-rolls',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    foto: fotoExemploHotRolls,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria hot roll',
    selos: ['novo'],
    destaque: true,
  },
  {
    slug: 'exemplo-sashimis',
    nome: '[PREENCHER] Sashimi de exemplo',
    categoria: 'sashimis',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    foto: fotoExemploSashimis,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria sashimi',
    selos: [],
    destaque: true,
  },
  {
    slug: 'exemplo-quentes',
    nome: '[PREENCHER] Prato quente de exemplo',
    categoria: 'quentes',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    foto: fotoExemploQuentes,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria prato quente',
    selos: ['picante'],
    destaque: false,
  },
  {
    slug: 'exemplo-bebidas',
    nome: '[PREENCHER] Bebida de exemplo',
    categoria: 'bebidas',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    foto: fotoExemploBebidas,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria bebida',
    selos: [],
    destaque: false,
  },
  {
    slug: 'exemplo-sobremesas',
    nome: '[PREENCHER] Sobremesa de exemplo',
    categoria: 'sobremesas',
    descricao: '[PREENCHER] Descreva o prato: ingredientes, preparo e textura, em uma ou duas frases curtas.',
    preco: null,
    foto: fotoExemploSobremesas,
    alt: '[PREENCHER] Foto do prato de exemplo da categoria sobremesa',
    selos: [],
    destaque: false,
  },
];

/** Pratos agrupados por categoria, na ordem do cardápio. */
export function pratosPorCategoria() {
  return (Object.keys(CATEGORIAS) as Categoria[])
    .map((categoria) => ({ categoria, rotulo: CATEGORIAS[categoria], pratos: pratos.filter((p) => p.categoria === categoria) }))
    .filter((g) => g.pratos.length > 0);
}

export const destaques = () => pratos.filter((p) => p.destaque).slice(0, 6);
