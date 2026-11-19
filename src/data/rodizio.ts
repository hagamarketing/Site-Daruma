/**
 * Rodízio: modalidades (o que inclui, preços por dia e regras) e as etapas mostradas na home.
 * Valor null = preço ainda não definido (aparece como "R$ [PREENCHER]").
 */
import type { ImageMetadata } from 'astro';
import type { Dia } from '@/data/horarios';
import fotoEntradas from '@/assets/fotos/rodizio/entradas/foto.jpg';
import fotoFrios from '@/assets/fotos/rodizio/frios/foto.jpg';
import fotoQuentes from '@/assets/fotos/rodizio/quentes/foto.jpg';
import fotoTemakis from '@/assets/fotos/rodizio/temakis/foto.jpg';
import fotoSobremesas from '@/assets/fotos/rodizio/sobremesas/foto.jpg';

export interface PrecoRodizio {
  dias: Dia[];
  turno: 'jantar' | 'almoco';
  /** Valor por pessoa, em reais. */
  valor: number | null;
}

export interface Modalidade {
  nome: string;
  descricao: string;
  inclui: string[];
  precos: PrecoRodizio[];
  criancas: string;
  desperdicio: string;
  observacoes: string[];
}

export const modalidades: Modalidade[] = [
  {
    nome: '[PREENCHER] Rodízio completo',
    descricao: '[PREENCHER] Descreva a modalidade em duas frases: o que chega à mesa e como funciona.',
    inclui: [
      'Entradas',
      'Peças frias (sushis, sashimis e rolls)',
      'Pratos quentes',
      'Temakis',
      'Sobremesas',
      '[PREENCHER] Confirmar itens incluídos'
    ],
    precos: [
      {
        dias: [
          'segunda',
          'terca',
          'quinta'
        ],
        turno: 'jantar',
        valor: null
      },
      {
        dias: [
          'sexta',
          'sabado',
          'domingo'
        ],
        turno: 'jantar',
        valor: null
      },
      {
        dias: [
          'domingo'
        ],
        turno: 'almoco',
        valor: null
      }
    ],
    criancas: '[PREENCHER] Regra de preço para crianças (idades e valores).',
    desperdicio: '[PREENCHER] Regra sobre sobras e desperdício.',
    observacoes: [
      '[PREENCHER] Bebidas e taxa de serviço cobradas à parte?'
    ]
  }
];

export interface Etapa {
  nome: string;
  descricao: string;
  foto: ImageMetadata;
  alt: string;
}

export const etapas: Etapa[] = [
  { nome: 'Entradas', descricao: '[PREENCHER] O que abre o rodízio.', foto: fotoEntradas, alt: '[PREENCHER] Foto da etapa entradas do rodízio servida à mesa' },
  { nome: 'Frios', descricao: '[PREENCHER] Sushis, sashimis e rolls que chegam em seguida.', foto: fotoFrios, alt: '[PREENCHER] Foto da etapa frios do rodízio servida à mesa' },
  { nome: 'Quentes', descricao: '[PREENCHER] Hot rolls e pratos quentes.', foto: fotoQuentes, alt: '[PREENCHER] Foto da etapa quentes do rodízio servida à mesa' },
  { nome: 'Temakis', descricao: '[PREENCHER] Temakis feitos na hora.', foto: fotoTemakis, alt: '[PREENCHER] Foto da etapa temakis do rodízio servida à mesa' },
  { nome: 'Sobremesas', descricao: '[PREENCHER] O fechamento doce.', foto: fotoSobremesas, alt: '[PREENCHER] Foto da etapa sobremesas do rodízio servida à mesa' },
];
