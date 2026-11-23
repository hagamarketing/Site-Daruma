/**
 * Fotos do carrossel do rodízio na home, na ordem em que aparecem.
 * Arquivos em src/assets/fotos/pratos/ (qualquer proporção: o carrossel recorta para preencher o card).
 * `alt` descreve a foto para quem usa leitor de tela e para o Google.
 */
import type { ImageMetadata } from 'astro';
import daruma1 from '@/assets/fotos/pratos/daruma-1.avif';
import daruma2 from '@/assets/fotos/pratos/daruma-2.avif';
import daruma3 from '@/assets/fotos/pratos/daruma-3.avif';
import daruma4 from '@/assets/fotos/pratos/daruma-4.avif';
import daruma5 from '@/assets/fotos/pratos/daruma-5.avif';

export interface FotoRodizio {
  foto: ImageMetadata;
  alt: string;
}

export const etapas: FotoRodizio[] = [
  {
    foto: daruma1,
    alt: 'Sashimi de salmão com alga levado aos hashis, sobre a mesa com carpaccio e travessa de sashimis',
  },
  {
    foto: daruma2,
    alt: 'Sushis de salmão com camarão empanado, cream cheese e cebolinha servidos em tábua de madeira',
  },
  {
    foto: daruma3,
    alt: 'Cone de salmão maçaricado recheado com salmão em cubos, cream cheese e cebolinha',
  },
  {
    foto: daruma4,
    alt: 'Peça empanada cortada ao meio, com arroz, salmão, cream cheese e cebolinha, sobre repolho',
  },
  {
    foto: daruma5,
    alt: 'Niguiris de camarão cobertos com creme maçaricado e fio de molho agridoce',
  },
];
