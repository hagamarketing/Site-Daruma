/** Fotos dos cards reveladas por máscara (clip-path) ao entrar na tela. */
import { animar, FADE_REDUZIDO, gsap, ScrollTrigger } from './gsap';

export function iniciar(): void {
  const fotos = gsap.utils.toArray<HTMLElement>('[data-revelar]');
  if (fotos.length === 0) return;

  animar(null, ({ movimento }) => {
    gsap.set(fotos, movimento ? { clipPath: 'inset(100% 0% 0% 0% round 0px)' } : { autoAlpha: 0 });
    ScrollTrigger.batch(fotos, {
      start: 'top 90%',
      once: true,
      onEnter: (lote) =>
        movimento
          ? gsap.to(lote, {
              clipPath: 'inset(0% 0% 0% 0% round 0px)',
              duration: 1,
              ease: 'expo.out',
              stagger: 0.08,
            })
          : gsap.to(lote, { autoAlpha: 1, duration: FADE_REDUZIDO }),
    });
    // Fotos já visíveis ao carregar não esperam rolagem.
    ScrollTrigger.refresh();
  });
}
