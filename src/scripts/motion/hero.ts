/** Hero: título surge por caractere de dentro de uma máscara (SplitText) + parallax em camadas. */
import { SplitText } from 'gsap/SplitText';
import { animar, FADE_REDUZIDO, gsap } from './gsap';
import { aposPreloader, fontesProntas } from './preloader';

gsap.registerPlugin(SplitText);

export async function iniciar(): Promise<void> {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const titulo = hero?.querySelector<HTMLElement>('[data-split]');
  if (!hero || !titulo) return;

  await fontesProntas();

  animar(hero, ({ movimento }) => {
    if (!movimento) {
      gsap.set(titulo, { visibility: 'visible' });
      gsap.from(titulo, { autoAlpha: 0, duration: FADE_REDUZIDO });
      return;
    }

    // Divide e posiciona os caracteres já (por baixo do preloader, se houver) e anima quando a cortina abrir.
    const divisao = SplitText.create(titulo, { type: 'words,chars', mask: 'chars' });
    const intro = hero.querySelectorAll('.hero__sub, .hero__ctas, .hero__selos');
    gsap.set(divisao.chars, { yPercent: 110 });
    gsap.set(intro, { y: 24, autoAlpha: 0 });
    gsap.set(titulo, { visibility: 'visible' });

    const entrada = gsap
      .timeline({ paused: true })
      .to(divisao.chars, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.022 })
      .to(intro, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 0.35);
    void aposPreloader().then(() => entrada.play());

    // Parallax em camadas: mídia mais lenta, texto mais rápido, kanji na contramão.
    // Criado só na primeira rolagem: o ScrollTrigger mede a página inteira, e isso não precisa
    // acontecer durante o carregamento (pesa no TBT de celulares lentos).
    const parallax = gsap.context(() => undefined);
    const criarParallax = () =>
      parallax.add(() => {
        const gatilho = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to(hero.querySelector('[data-parallax="midia"]'), {
          yPercent: 18,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: gatilho,
        });
        gsap.to(hero.querySelector('[data-parallax="conteudo"]'), {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: gatilho,
        });
        gsap.to(hero.querySelector('.hero__kanji'), { yPercent: 40, ease: 'none', scrollTrigger: gatilho });
      });
    if (scrollY > 0) criarParallax();
    else addEventListener('scroll', criarParallax, { once: true, passive: true });

    return () => {
      removeEventListener('scroll', criarParallax);
      parallax.revert();
      divisao.revert();
    };
  });
}
