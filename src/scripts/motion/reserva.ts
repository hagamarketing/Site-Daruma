/**
 * Reserva: ao enviar, o olho do Daruma é pintado (DrawSVG) antes de abrir o WhatsApp.
 * Escuta o evento cancelável disparado por src/scripts/reserva.ts.
 */
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { EVENTO_RESERVA } from '@/scripts/eventos';
import { animar, FADE_REDUZIDO, gsap } from './gsap';

gsap.registerPlugin(DrawSVGPlugin);

export function iniciar(): void {
  for (const form of document.querySelectorAll<HTMLFormElement>('[data-reserva]')) {
    let movimento = true;
    animar(form, (c) => {
      movimento = c.movimento;
    });

    form.addEventListener(EVENTO_RESERVA, (e) => {
      const { abrir } = (e as CustomEvent<{ abrir: () => void }>).detail;
      e.preventDefault();

      const pupila = form.querySelector<SVGPathElement>('.reserva__olho .olho-daruma__pupila');
      const confirmacao = form.querySelector<HTMLElement>('[data-confirmacao]');
      const pupilaConfirmacao = confirmacao?.querySelector<SVGPathElement>('.daruma__pupila--esq');
      // Abre uma única vez: no fim da animação ou, no máximo, em 900 ms
      // (aba em segundo plano pausa o requestAnimationFrame; pop-ups precisam de ativação recente).
      let aberto = false;
      const abrirUmaVez = () => {
        if (aberto) return;
        aberto = true;
        abrir();
      };
      setTimeout(abrirUmaVez, 900);
      const tl = gsap.timeline({ onComplete: abrirUmaVez });

      if (!movimento) {
        if (confirmacao) confirmacao.hidden = false;
        tl.from(confirmacao, { autoAlpha: 0, duration: FADE_REDUZIDO });
        return;
      }
      if (pupila) {
        // DrawSVG mede o traço real: remove o pathLength usado no estado sem JS.
        pupila.removeAttribute('pathLength');
        tl.fromTo(pupila, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.45, ease: 'power2.inOut' });
      }
      if (confirmacao && pupilaConfirmacao) {
        tl.add(() => {
          confirmacao.hidden = false;
        });
        pupilaConfirmacao.removeAttribute('pathLength');
        tl.from(confirmacao, { autoAlpha: 0, y: 12, duration: 0.25 }, '<');
        tl.fromTo(
          pupilaConfirmacao,
          { drawSVG: '0% 0%' },
          { drawSVG: '0% 100%', duration: 0.3, ease: 'power2.out' },
          '<0.05',
        );
      }
    });
  }
}
