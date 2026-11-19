/**
 * Bootstrap das animações. Não importa GSAP diretamente: cada módulo é carregado por import
 * dinâmico só quando a sua seção se aproxima da tela, depois do primeiro conteúdo visível.
 *
 * Para não pesar no carregamento (TBT/INP em celulares lentos), só o hero anima de imediato.
 * Os demais módulos, a rolagem suave e os efeitos de ponteiro esperam a primeira interação
 * (rolagem, toque, mouse ou tecla) ou alguns segundos de ociosidade depois do load.
 *
 * Marque a seção com data-motion="<nome>" (ver MODULOS).
 */

const MODULOS = {
  hero: () => import('./hero'),
  rodizio: () => import('./rodizio'),
  contadores: () => import('./contadores'),
  cardapio: () => import('./cardapio'),
  revelar: () => import('./revelar'),
  reserva: () => import('./reserva'),
  galeria: () => import('./galeria'),
  historia: () => import('./historia'),
  depoimentos: () => import('./depoimentos'),
} as const;

type NomeModulo = keyof typeof MODULOS;

const IMEDIATOS = new Set<string>(['hero']);
const carregados = new Set<string>();

/** Executa `fn` uma vez: na primeira interação ou, sem interação, quando o navegador ficar ocioso após o load. */
function aposInteracao(fn: () => void): void {
  let feito = false;
  const eventos = ['scroll', 'wheel', 'pointerdown', 'pointermove', 'touchstart', 'keydown'] as const;
  const disparar = () => {
    if (feito) return;
    feito = true;
    for (const ev of eventos) removeEventListener(ev, disparar, true);
    fn();
  };
  for (const ev of eventos) addEventListener(ev, disparar, { capture: true, passive: true });
  const ocioso = () =>
    setTimeout(
      () => ('requestIdleCallback' in window ? requestIdleCallback(disparar, { timeout: 2000 }) : disparar()),
      3500,
    );
  if (document.readyState === 'complete') ocioso();
  else addEventListener('load', ocioso, { once: true });
}

async function carregar(nome: string): Promise<void> {
  if (carregados.has(nome) || !(nome in MODULOS)) return;
  carregados.add(nome);
  try {
    const mod = await MODULOS[nome as NomeModulo]();
    mod.iniciar();
  } catch (erro) {
    console.warn(`[motion] falha ao carregar "${nome}"`, erro);
  }
}

function iniciar(): void {
  const elementos = [...document.querySelectorAll<HTMLElement>('[data-motion]')];
  const nomes = (el: Element) => (el as HTMLElement).dataset.motion?.split(' ') ?? [];

  const observar = (lista: HTMLElement[], soImediatos: boolean) => {
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          observador.unobserve(e.target);
          for (const nome of nomes(e.target)) if (IMEDIATOS.has(nome) === soImediatos) void carregar(nome);
        }
      },
      { rootMargin: '50% 0px' },
    );
    for (const el of lista) observador.observe(el);
  };

  observar(
    elementos.filter((el) => nomes(el).some((n) => IMEDIATOS.has(n))),
    true,
  );

  aposInteracao(() => {
    observar(
      elementos.filter((el) => nomes(el).some((n) => !IMEDIATOS.has(n))),
      false,
    );

    if (matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      void import('./rolagem').then((m) => m.iniciar());
    }
    if (matchMedia('(pointer: fine) and (hover: hover)').matches) {
      void import('./ponteiro').then((m) => m.iniciar());
    }
  });
}

// Depois da primeira pintura: não disputa com o LCP.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(iniciar), { once: true });
} else {
  requestAnimationFrame(iniciar);
}
