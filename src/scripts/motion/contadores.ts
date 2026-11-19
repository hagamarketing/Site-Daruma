/** Contadores das avaliações (4,3 e 700+), uma vez ao entrar na tela. */
import { animar, gsap } from './gsap';

export function iniciar(): void {
  const numeros = [...document.querySelectorAll<HTMLElement>('[data-contador-alvo]')];
  if (numeros.length === 0) return;

  animar(null, ({ movimento }) => {
    if (!movimento) return;
    for (const el of numeros) {
      const alvo = Number(el.dataset.contadorAlvo);
      const decimais = Number(el.dataset.decimais ?? 0);
      const sufixo = el.dataset.sufixo ?? '';
      const final = el.textContent ?? '';
      const fmt = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimais,
        maximumFractionDigits: decimais,
      });
      // Largura fixa durante a contagem: sem layout shift.
      el.style.minWidth = `${el.getBoundingClientRect().width}px`;
      const estado = { v: 0 };
      gsap.to(estado, {
        v: alvo,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => {
          el.textContent = `${fmt.format(estado.v)}${sufixo}`;
        },
        onComplete: () => {
          el.textContent = final;
        },
      });
      // Leitores de tela leem sempre o valor final; a contagem é só visual.
      const leitura = document.createElement('span');
      leitura.className = 'sr-only';
      leitura.dataset.contadorLeitura = '';
      leitura.textContent = final;
      el.after(leitura);
      el.setAttribute('aria-hidden', 'true');
      el.textContent = `${fmt.format(0)}${sufixo}`;
    }
    return () => {
      for (const el of numeros) {
        el.style.minWidth = '';
        el.removeAttribute('aria-hidden');
      }
      for (const s of document.querySelectorAll('[data-contador-leitura]')) s.remove();
    };
  });
}
