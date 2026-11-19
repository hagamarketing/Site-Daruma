/**
 * Fotos da galeria e da grade do Instagram (home).
 * Galeria: src/assets/fotos/galeria/<slug>/foto.jpg (retrato, paisagem ou quadrada: a grade se ajusta).
 * Instagram: src/assets/fotos/instagram/<slug>/foto.jpg (1:1). `link` = endereço do post (opcional).
 */
import type { ImageMetadata } from 'astro';
import galeriaFoto1 from '@/assets/fotos/galeria/foto-1/foto.jpg';
import galeriaFoto2 from '@/assets/fotos/galeria/foto-2/foto.jpg';
import galeriaFoto3 from '@/assets/fotos/galeria/foto-3/foto.jpg';
import galeriaFoto4 from '@/assets/fotos/galeria/foto-4/foto.jpg';
import galeriaFoto5 from '@/assets/fotos/galeria/foto-5/foto.jpg';
import galeriaFoto6 from '@/assets/fotos/galeria/foto-6/foto.jpg';
import galeriaFoto7 from '@/assets/fotos/galeria/foto-7/foto.jpg';
import galeriaFoto8 from '@/assets/fotos/galeria/foto-8/foto.jpg';
import instaPost1 from '@/assets/fotos/instagram/post-1/foto.jpg';
import instaPost2 from '@/assets/fotos/instagram/post-2/foto.jpg';
import instaPost3 from '@/assets/fotos/instagram/post-3/foto.jpg';
import instaPost4 from '@/assets/fotos/instagram/post-4/foto.jpg';
import instaPost5 from '@/assets/fotos/instagram/post-5/foto.jpg';
import instaPost6 from '@/assets/fotos/instagram/post-6/foto.jpg';

export interface FotoGaleria {
  foto: ImageMetadata;
  alt: string;
}

export const galeria: FotoGaleria[] = [
  { foto: galeriaFoto1, alt: '[PREENCHER] Foto 1: salão à noite' },
  { foto: galeriaFoto2, alt: '[PREENCHER] Foto 2: balcão de preparo' },
  { foto: galeriaFoto3, alt: '[PREENCHER] Foto 3: prato em destaque' },
  { foto: galeriaFoto4, alt: '[PREENCHER] Foto 4: chef finalizando um temaki' },
  { foto: galeriaFoto5, alt: '[PREENCHER] Foto 5: mesa posta para o rodízio' },
  { foto: galeriaFoto6, alt: '[PREENCHER] Foto 6: detalhe da decoração' },
  { foto: galeriaFoto7, alt: '[PREENCHER] Foto 7: fachada iluminada' },
  { foto: galeriaFoto8, alt: '[PREENCHER] Foto 8: mesa de aniversário' },
];

export interface PostInstagram extends FotoGaleria {
  link: string | null;
}

export const instagram: PostInstagram[] = [
  { foto: instaPost1, alt: '[PREENCHER] Descrição do post 1 do Instagram', link: null },
  { foto: instaPost2, alt: '[PREENCHER] Descrição do post 2 do Instagram', link: null },
  { foto: instaPost3, alt: '[PREENCHER] Descrição do post 3 do Instagram', link: null },
  { foto: instaPost4, alt: '[PREENCHER] Descrição do post 4 do Instagram', link: null },
  { foto: instaPost5, alt: '[PREENCHER] Descrição do post 5 do Instagram', link: null },
  { foto: instaPost6, alt: '[PREENCHER] Descrição do post 6 do Instagram', link: null },
];
