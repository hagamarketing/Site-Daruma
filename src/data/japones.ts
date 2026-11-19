/**
 * Palavras em japonês usadas como textura decorativa (sempre com aria-hidden).
 * A fonte Shippori Mincho é gerada só com estes caracteres (veja astro.config.mjs).
 * Ao usar uma palavra nova, adicione-a aqui e rode o build de novo.
 */
export const JAPONES = {
  daruma: 'だるま',
  temaki: '手巻き',
  sushi: '寿司',
  sashimi: '刺身',
  rodizio: '食べ放題',
  noite: '夜',
  toquio: '東京',
  desejo: '願い',
  domingo: '日曜',
  almoco: '昼',
} as const;

export type PalavraJaponesa = keyof typeof JAPONES;

/** Caracteres únicos, para o subset da fonte. */
export const GLIFOS_JAPONESES = [...new Set(Object.values(JAPONES).join(''))].join('');
