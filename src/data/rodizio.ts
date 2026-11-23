/**
 * Fotos do carrossel do rodízio na home (src/assets/fotos/rodizio/<etapa>/foto.jpg, 4:5).
 * `nome` e `descricao` não aparecem mais no site; o `alt` descreve a foto para leitores de tela.
 */
import type { ImageMetadata } from 'astro';
import fotoEntradas from '@/assets/fotos/rodizio/entradas/foto.jpg';
import fotoFrios from '@/assets/fotos/rodizio/frios/foto.jpg';
import fotoQuentes from '@/assets/fotos/rodizio/quentes/foto.jpg';
import fotoTemakis from '@/assets/fotos/rodizio/temakis/foto.jpg';
import fotoSobremesas from '@/assets/fotos/rodizio/sobremesas/foto.jpg';

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
