/**
 * Cardápio: os filtros reorganizam os cards com animação de layout (GSAP Flip).
 * Escuta o evento "daruma:filtro" disparado por src/scripts/cardapio.ts antes e depois de filtrar.
 */
import { Flip } from 'gsap/Flip';
import { animar, FADE_REDUZIDO, gsap } from './gsap';

gsap.registerPlugin(Flip);

export function iniciar(): void {
  const raiz = document.querySelector<HTMLElement>('.cardapio');
  if (!raiz) return;
  const alvos = () => raiz.querySelectorAll<HTMLElement>('[data-item], [data-grupo] > h2');

  let movimento = true;
  animar(raiz, (c) => {
    movimento = c.movimento;
  });

  let estado: Flip.FlipState | null = null;
  raiz.addEventListener('daruma:filtro', (e) => {
    const { fase } = (e as CustomEvent<{ fase: 'antes' | 'depois' }>).detail;
    if (fase === 'antes') {
      estado = Flip.getState(alvos());
      return;
    }
    if (!estado) return;
    if (!movimento) {
      gsap.fromTo(
        raiz.querySelectorAll('[data-item]:not([hidden])'),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: FADE_REDUZIDO },
      );
      return;
    }
    Flip.from(estado, {
      duration: 0.55,
      ease: 'power3.inOut',
      absolute: true,
      nested: true,
      prune: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { autoAlpha: 0, scale: 0.94 },
          { autoAlpha: 1, scale: 1, duration: 0.45, delay: 0.1 },
        ),
    });
    estado = null;
  });
}
