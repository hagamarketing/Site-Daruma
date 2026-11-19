/**
 * Delivery: informações do pedido pelo WhatsApp e combos em destaque.
 * Foto dos combos: src/assets/fotos/combos/<slug>/foto.jpg (3:2).
 */
import type { ImageMetadata } from 'astro';
import fotoComboExemplo1 from '@/assets/fotos/combos/combo-exemplo-1/foto.jpg';
import fotoComboExemplo2 from '@/assets/fotos/combos/combo-exemplo-2/foto.jpg';
import fotoComboExemplo3 from '@/assets/fotos/combos/combo-exemplo-3/foto.jpg';

export const delivery = {
  /** Área de entrega, taxa e tempo médio do delivery próprio. */
  infoWhatsApp: '[PREENCHER] Área de entrega, taxa e tempo médio.',
  infoIfood: 'Taxa e tempo de entrega aparecem no iFood antes de você confirmar.',
};

export interface Combo {
  nome: string;
  descricao: string;
  itens: string[];
  serve: string;
  preco: number | null;
  foto: ImageMetadata;
  alt: string;
}

export const combos: Combo[] = [
  {
    nome: '[PREENCHER] Combo de exemplo 1',
    descricao: '[PREENCHER] Descreva o combo em uma frase.',
    itens: ['[PREENCHER] Item 1', '[PREENCHER] Item 2'],
    serve: '[PREENCHER]',
    preco: null,
    foto: fotoComboExemplo1,
    alt: '[PREENCHER] Foto do combo de exemplo 1 na embalagem de delivery',
  },
  {
    nome: '[PREENCHER] Combo de exemplo 2',
    descricao: '[PREENCHER] Descreva o combo em uma frase.',
    itens: ['[PREENCHER] Item 1', '[PREENCHER] Item 2'],
    serve: '[PREENCHER]',
    preco: null,
    foto: fotoComboExemplo2,
    alt: '[PREENCHER] Foto do combo de exemplo 2 na embalagem de delivery',
  },
  {
    nome: '[PREENCHER] Combo de exemplo 3',
    descricao: '[PREENCHER] Descreva o combo em uma frase.',
    itens: ['[PREENCHER] Item 1', '[PREENCHER] Item 2'],
    serve: '[PREENCHER]',
    preco: null,
    foto: fotoComboExemplo3,
    alt: '[PREENCHER] Foto do combo de exemplo 3 na embalagem de delivery',
  },
];
