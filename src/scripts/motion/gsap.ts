/**
 * Base de animação: registra os plugins e oferece `animar()`, que cria um gsap.matchMedia()
 * com as condições de movimento e faz a limpeza (revert) ao sair da página.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

export const CONDICOES = {
  movimento: '(prefers-reduced-motion: no-preference)',
  reduzido: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 64rem)',
  tablet: '(min-width: 40rem)',
  ponteiroFino: '(pointer: fine) and (hover: hover)',
} as const;

export type Condicoes = Record<keyof typeof CONDICOES, boolean>;

/** Duração máxima dos fades no modo de movimento reduzido. */
export const FADE_REDUZIDO = 0.2;

const ativos = new Set<gsap.MatchMedia>();

/**
 * Registra as animações de um módulo. A função roda de novo quando alguma condição muda
 * (ex.: o usuário liga "reduzir movimento"), e tudo é revertido automaticamente.
 */
// Pode não retornar nada ou retornar a função de limpeza, como no gsap.matchMedia.
type Montagem = (c: Condicoes) => void | (() => void);

export function animar(escopo: Element | null, fn: Montagem): gsap.MatchMedia {
  const mm = gsap.matchMedia(escopo ?? undefined);
  mm.add(CONDICOES, (ctx) => fn(ctx.conditions as Condicoes));
  ativos.add(mm);
  return mm;
}

// Limpeza ao trocar de página (navegação MPA com View Transitions). No bfcache, a página volta intacta.
addEventListener('pagehide', (e) => {
  if (e.persisted) return;
  for (const mm of ativos) mm.revert();
  ativos.clear();
});
