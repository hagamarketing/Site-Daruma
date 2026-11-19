/**
 * Tags de marketing (GA4, Google Ads, Pixel do Meta) e eventos de conversão.
 * IDs vêm das variáveis de ambiente (veja .env.example), validados em ./env.ts.
 *
 * Eventos (mesmos nomes no GA4 e no Meta):
 *   reserva_whatsapp, delivery_whatsapp, delivery_ifood, ligacao, rota, avaliar_google, ver_cardapio
 * Qualquer link ou botão com data-evento="<nome>" dispara o evento no clique.
 * Nunca envia dados pessoais (nem o texto da mensagem do WhatsApp).
 */
import { GA4_ID, GADS_ID, GADS_LABEL_DELIVERY, GADS_LABEL_RESERVA, META_PIXEL_ID } from './env';

type Fn = (...args: unknown[]) => void;
type Fbq = Fn & { callMethod?: Fn; queue: unknown[]; push: Fbq; loaded: boolean; version: string };

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: Fn;
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export const EVENTOS = [
  'reserva_whatsapp',
  'delivery_whatsapp',
  'delivery_ifood',
  'ligacao',
  'rota',
  'avaliar_google',
  'ver_cardapio',
] as const;
export type Evento = (typeof EVENTOS)[number];
export const ehEvento = (nome: string | undefined): nome is Evento => EVENTOS.includes(nome as Evento);

let carregado = false;

function injetarScript(src: string): void {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.append(s);
}

export function carregarTags(): void {
  if (carregado) return;
  carregado = true;

  const gtagId = GA4_ID || GADS_ID;
  if (gtagId) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // gtag exige o objeto `arguments`, não um array
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    if (GA4_ID) window.gtag('config', GA4_ID);
    if (GADS_ID) window.gtag('config', GADS_ID);
    injetarScript(`https://www.googletagmanager.com/gtag/js?id=${gtagId}`);
  }

  if (META_PIXEL_ID) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as Fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;
    injetarScript('https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
  }
}

function conversaoAds(label: string | undefined): void {
  if (GADS_ID && label) window.gtag?.('event', 'conversion', { send_to: `${GADS_ID}/${label}` });
}

/** Envia um evento de conversão para o GA4, o Google Ads e o Meta. */
export function rastrear(evento: Evento, parametros: Record<string, string | number | undefined> = {}): void {
  const limpos = Object.fromEntries(Object.entries(parametros).filter(([, v]) => v !== undefined && v !== ''));
  window.gtag?.('event', evento, limpos);
  if (evento === 'reserva_whatsapp') {
    conversaoAds(GADS_LABEL_RESERVA);
    window.fbq?.('track', 'Contact', { content_name: evento });
  } else if (evento === 'delivery_whatsapp' || evento === 'delivery_ifood') {
    conversaoAds(GADS_LABEL_DELIVERY);
    window.fbq?.('track', 'Lead', { content_name: evento });
  } else {
    window.fbq?.('trackCustom', evento, limpos);
  }
}
