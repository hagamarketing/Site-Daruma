/**
 * IDs das variáveis de ambiente, validados pelo formato.
 * Valor vazio, "-" ou qualquer coisa fora do padrão conta como "não configurado",
 * então dá para deixar um campo de preenchimento obrigatório do painel com "-".
 */
import {
  PUBLIC_GA4_ID,
  PUBLIC_GADS_ID,
  PUBLIC_GADS_LABEL_DELIVERY,
  PUBLIC_GADS_LABEL_RESERVA,
  PUBLIC_META_PIXEL_ID,
} from 'astro:env/client';

const valido = (valor: string | undefined, formato: RegExp) => {
  const v = valor?.trim();
  return v && formato.test(v) ? v : undefined;
};

export const GA4_ID = valido(PUBLIC_GA4_ID, /^G-[A-Z0-9]{4,}$/i);
export const GADS_ID = valido(PUBLIC_GADS_ID, /^AW-\d{5,}$/i);
export const GADS_LABEL_RESERVA = valido(PUBLIC_GADS_LABEL_RESERVA, /^[\w-]{4,}$/);
export const GADS_LABEL_DELIVERY = valido(PUBLIC_GADS_LABEL_DELIVERY, /^[\w-]{4,}$/);
export const META_PIXEL_ID = valido(PUBLIC_META_PIXEL_ID, /^\d{6,}$/);
