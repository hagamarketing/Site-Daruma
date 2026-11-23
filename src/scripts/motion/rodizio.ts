/**
 * Rodízio: seção fixa (pin) com rolagem horizontal pelas etapas (scrub) e contador de etapa.
 * O contador acompanha o progresso; a entrada de cada foto usa containerAnimation.
 * Movimento reduzido: o CSS transforma o trilho em lista vertical e nada é fixado.
 */
import { CustomEase } from 'gsap/CustomEase';
import { animar, gsap } from './gsap';

gsap.registerPlugin(CustomEase);
// "Pouso": desce rápido, passa um pouco do ponto e assenta, como um prato posto na mesa.
CustomEase.create('pouso', 'M0,0 C0.16,0.62 0.3,1.06 0.52,1.045 0.7,1.03 0.82,0.995 1,1');

export function iniciar(): void {
  const secao = document.querySelector<HTMLElement>('[data-rodizio]');
  const trilho = secao?.querySelector<HTMLElement>('[data-rodizio-trilho]');
  const janela = secao?.querySelector<HTMLElement>('[data-rodizio-janela]');
  const atual = secao?.querySelector<HTMLElement>('[data-contador-atual]');
  if (!secao || !trilho || !janela || !atual) return;
  const etapas = [...trilho.querySelectorAll<HTMLElement>('[data-etapa]')];

  animar(secao, ({ movimento, tablet }) => {
    if (!movimento || !tablet) return;

    secao.classList.add('rodizio--fixo');
    const distancia = () => Math.max(0, trilho.scrollWidth - janela.clientWidth);

    // Sem percurso horizontal suficiente (tela muito larga para os cards), não fixa a seção:
    // fica o carrossel nativo de arrastar, em vez de uma tela "parada".
    if (distancia() < window.innerWidth * 0.25) {
      secao.classList.remove('rodizio--fixo');
      return;
    }

    const horizontal = gsap.to(trilho, {
      x: () => -distancia(),
      ease: 'none',
      scrollTrigger: {
        trigger: secao,
        start: 'top top',
        end: () => `+=${Math.max(distancia() * 1.4, window.innerHeight * 1.2)}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const i = Math.min(etapas.length - 1, Math.floor(self.progress * etapas.length));
          const texto = String(i + 1).padStart(2, '0');
          if (atual.textContent !== texto) atual.textContent = texto;
        },
      },
    });

    // containerAnimation: cada etapa tem o próprio gatilho dentro da rolagem horizontal.
    for (const [i, etapa] of etapas.entries()) {
      gsap.from(etapa.querySelector('.etapa__foto'), {
        rotation: i % 2 ? 6 : -6,
        yPercent: 14,
        scale: 0.86,
        autoAlpha: 0.3,
        duration: 1.1,
        ease: 'pouso',
        scrollTrigger: {
          trigger: etapa,
          containerAnimation: horizontal,
          start: 'left 98%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    return () => {
      secao.classList.remove('rodizio--fixo');
      atual.textContent = '01';
    };
  });
}
