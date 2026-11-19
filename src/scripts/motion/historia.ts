/**
 * História do Daruma: o boneco é traçado conforme a rolagem (DrawSVG, scrub) e, no fim,
 * o segundo olho é pintado e ganha forma de pincelada (MorphSVG).
 * Easter egg: clicar (ou Enter/Espaço) no boneco pinta os olhos de novo, ele balança e responde.
 */
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { animar, FADE_REDUZIDO, gsap } from './gsap';

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin);

const PINCELADA =
  'M114.5 95.2c2.8-3.4 8.6-3.9 11.4-.4 2.4 3 1.2 7.6-2.4 9-3.3 1.4-7.9 1.2-9.8-1.9-1.4-2.2-1-4.9.8-6.7z';
const MENSAGENS = [
  'Desejo anotado. Agora é com a cozinha.',
  'Olho pintado. Que venha o temaki.',
  'Caiu sete vezes, levantou oito.',
  'Pedido feito. Volte para pintar o outro olho.',
];

export function iniciar(): void {
  const secao = document.querySelector<HTMLElement>('[data-historia]');
  const boneco = secao?.querySelector<HTMLElement>('[data-historia-boneco]');
  const svg = boneco?.querySelector<SVGSVGElement>('svg');
  const mensagem = secao?.querySelector<HTMLElement>('[data-historia-mensagem]');
  if (!secao || !boneco || !svg || !mensagem) return;

  const tracos = [...svg.querySelectorAll<SVGGeometryElement>('[data-desenho] path, [data-desenho] circle')];
  const pupilaEsq = svg.querySelector<SVGPathElement>('.daruma__pupila--esq');
  const pupilaDir = svg.querySelector<SVGPathElement>('.daruma__pupila--dir');
  // DrawSVG mede o comprimento real: tira o pathLength do estado sem JS.
  for (const el of [...tracos, pupilaEsq, pupilaDir]) el?.removeAttribute('pathLength');
  const formaOriginal = pupilaDir?.getAttribute('d') ?? '';

  // Easter egg (vale para qualquer preferência de movimento).
  boneco.setAttribute('role', 'button');
  boneco.tabIndex = 0;
  boneco.setAttribute('aria-label', 'Pintar o olho do Daruma');
  let vez = 0;
  let movimento = true;

  const pintar = () => {
    mensagem.textContent = MENSAGENS[vez++ % MENSAGENS.length] ?? '';
    if (!movimento) {
      gsap.fromTo(mensagem, { autoAlpha: 0 }, { autoAlpha: 1, duration: FADE_REDUZIDO });
      return;
    }
    gsap
      .timeline()
      .to(svg, { rotation: -12, transformOrigin: '50% 92%', duration: 0.18, ease: 'power2.out' })
      .to(svg, { rotation: 0, duration: 1.1, ease: 'elastic.out(1.1, 0.3)' })
      .fromTo(
        [pupilaEsq, pupilaDir],
        { drawSVG: '0% 0%' },
        { drawSVG: '0% 100%', duration: 0.35, stagger: 0.12 },
        0.1,
      )
      .fromTo(mensagem, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 0.2);
  };
  boneco.addEventListener('click', pintar);
  boneco.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pintar();
    }
  });

  animar(secao, (c) => {
    movimento = c.movimento;
    if (!movimento || !pupilaDir) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: secao, start: 'top 75%', end: 'center 45%', scrub: 0.8 },
    });
    tl.from(tracos, { drawSVG: '0%', duration: 1, stagger: 0.12, ease: 'none' })
      .fromTo(pupilaEsq, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.4 }, '>-0.2')
      .fromTo(pupilaDir, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.4 }, '>0.3')
      .to(pupilaDir, { morphSVG: PINCELADA, duration: 0.4, ease: 'power2.inOut' });

    return () => pupilaDir.setAttribute('d', formaOriginal);
  });
}
