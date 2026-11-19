/**
 * Efeitos de ponteiro (só desktop com mouse, sem movimento reduzido):
 * - botões magnéticos (gsap.quickTo)
 * - cards com inclinação 3D e reflexo de luz (variáveis CSS --rx, --ry, --luz-x, --luz-y)
 */
import { animar, gsap } from './gsap';

const FORCA_MAGNETICA = 0.35;
const INCLINACAO_MAX = 7; // graus

export function iniciar(): void {
  animar(null, ({ movimento, ponteiroFino }) => {
    if (!movimento || !ponteiroFino) return;
    const limpar: Array<() => void> = [];

    for (const el of document.querySelectorAll<HTMLElement>('[data-magnetico]')) {
      const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      const mover = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * FORCA_MAGNETICA);
        y((e.clientY - (r.top + r.height / 2)) * FORCA_MAGNETICA);
      };
      const sair = () => {
        x(0);
        y(0);
      };
      el.addEventListener('pointermove', mover);
      el.addEventListener('pointerleave', sair);
      limpar.push(() => {
        el.removeEventListener('pointermove', mover);
        el.removeEventListener('pointerleave', sair);
        gsap.set(el, { clearProps: 'x,y' });
      });
    }

    for (const card of document.querySelectorAll<HTMLElement>('[data-prato]')) {
      let quadro = 0;
      const mover = (e: PointerEvent) => {
        cancelAnimationFrame(quadro);
        quadro = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          card.style.setProperty('--ry', `${(px - 0.5) * 2 * INCLINACAO_MAX}deg`);
          card.style.setProperty('--rx', `${(0.5 - py) * 2 * INCLINACAO_MAX}deg`);
          card.style.setProperty('--luz-x', `${px * 100}%`);
          card.style.setProperty('--luz-y', `${py * 100}%`);
        });
      };
      const sair = () => {
        cancelAnimationFrame(quadro);
        for (const p of ['--rx', '--ry', '--luz-x', '--luz-y']) card.style.removeProperty(p);
      };
      card.addEventListener('pointermove', mover);
      card.addEventListener('pointerleave', sair);
      limpar.push(() => {
        card.removeEventListener('pointermove', mover);
        card.removeEventListener('pointerleave', sair);
        sair();
      });
    }

    return () => {
      for (const fn of limpar) fn();
    };
  });
}
