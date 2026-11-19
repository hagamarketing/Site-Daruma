/**
 * Rolagem suave (Lenis) sincronizada com o ScrollTrigger, e cursor personalizado "Ver" sobre fotos.
 * Só com movimento permitido. O cursor só em desktop com mouse; o cursor nativo continua visível.
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { animar, gsap, ScrollTrigger } from './gsap';

export function iniciar(): void {
  animar(null, ({ movimento, ponteiroFino }) => {
    if (!movimento) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.11,
      anchors: { offset: -96 },
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      // Diálogos (menu, lightbox) e áreas com rolagem própria rolam normalmente.
      prevent: (no) => no.closest('dialog, [data-lenis-prevent]') !== null,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const tique = (tempo: number) => lenis.raf(tempo * 1000);
    gsap.ticker.add(tique);
    gsap.ticker.lagSmoothing(0);

    // Para a rolagem da página enquanto um diálogo modal está aberto.
    const observador = new MutationObserver(() => {
      if (document.querySelector('dialog[open]')) lenis.stop();
      else lenis.start();
    });
    for (const d of document.querySelectorAll('dialog'))
      observador.observe(d, { attributes: true, attributeFilter: ['open'] });
    const novosDialogos = new MutationObserver((mutacoes) => {
      for (const m of mutacoes)
        for (const n of m.addedNodes)
          if (n instanceof HTMLDialogElement)
            observador.observe(n, { attributes: true, attributeFilter: ['open'] });
    });
    novosDialogos.observe(document.body, { childList: true });

    const removerCursor = ponteiroFino ? cursor() : () => undefined;

    return () => {
      gsap.ticker.remove(tique);
      observador.disconnect();
      novosDialogos.disconnect();
      lenis.destroy();
      removerCursor();
    };
  });
}

/** Círculo que segue o mouse e vira "Ver" sobre elementos com data-cursor. */
function cursor(): () => void {
  const el = document.createElement('div');
  el.className = 'cursor';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<span class="cursor__rotulo"></span>';
  document.body.append(el);
  const rotulo = el.querySelector<HTMLElement>('.cursor__rotulo');

  gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
  const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
  const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });
  let visivel = false;

  const mover = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    x(e.clientX);
    y(e.clientY);
    if (!visivel) {
      visivel = true;
      gsap.to(el, { autoAlpha: 1, duration: 0.2 });
    }
    const alvo = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor]');
    const texto = alvo?.dataset.cursor ?? '';
    if (rotulo && rotulo.textContent !== texto) rotulo.textContent = texto;
    el.classList.toggle('cursor--ativo', texto !== '');
  };
  const sair = () => {
    visivel = false;
    gsap.to(el, { autoAlpha: 0, duration: 0.2 });
  };
  addEventListener('pointermove', mover, { passive: true });
  document.documentElement.addEventListener('pointerleave', sair);
  return () => {
    removeEventListener('pointermove', mover);
    document.documentElement.removeEventListener('pointerleave', sair);
    el.remove();
  };
}
