// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { hostinger, type Redirecionamento } from './integrations/hostinger';

/** Endereços do site antigo que devem ir para as páginas novas (301). */
const redirecionamentos: Redirecionamento[] = [
  { de: 'cardapio-daruma-temaki-e-rolls', para: '/cardapio' },
  // Adicione aqui as outras URLs do site antigo (veja o README).
];

/** Fonte local com fallback de métricas ajustadas (evita "pulo" do layout ao trocar a fonte). */
const fonte = (nome: string, cssVariable: string, arquivos: Array<{ src: string; weight: string; style: 'normal' | 'italic' }>, fallbacks: string[], display: 'swap' | 'optional' = 'swap') => ({
  provider: fontProviders.local(),
  name: nome,
  cssVariable,
  fallbacks,
  display,
  options: {
    variants: arquivos.map((a) => ({ src: [`./src/assets/fonts/${a.src}`], weight: a.weight, style: a.style })) as [
      { src: [string]; weight: string; style: 'normal' | 'italic' },
      ...Array<{ src: [string]; weight: string; style: 'normal' | 'italic' }>,
    ],
  },
});

export default defineConfig({
  site: 'https://darumatemakirolls.com.br',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  fonts: [
    fonte(
      'Instrument Serif',
      '--font-instrument-serif',
      [
        { src: 'instrument-serif-normal-400.woff2', weight: '400', style: 'normal' },
        { src: 'instrument-serif-italic-400.woff2', weight: '400', style: 'italic' },
      ],
      ['Instrument Serif Fallback', 'serif'],
    ),
    fonte('Manrope', '--font-manrope', [{ src: 'manrope-normal-300_700.woff2', weight: '300 700', style: 'normal' }], [
      'Manrope Fallback',
      'sans-serif',
    ]),
    // Só textura decorativa: arquivo com apenas os caracteres de src/data/japones.ts.
    fonte('Shippori Mincho', '--font-shippori', [{ src: 'shippori-mincho-normal-500.woff2', weight: '500', style: 'normal' }], ['serif'], 'optional'),
  ],
  env: {
    schema: {
      PUBLIC_GA4_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_GADS_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_GADS_LABEL_RESERVA: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_GADS_LABEL_DELIVERY: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_META_PIXEL_ID: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
  integrations: [
    sitemap({ filter: (pagina) => !/\/(privacidade|404)$/.test(pagina) }),
    hostinger({ dominio: 'darumatemakirolls.com.br', redirecionamentos }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
