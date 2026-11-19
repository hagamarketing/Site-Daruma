/**
 * Carrossel de depoimentos infinito e arrastável com inércia (Draggable + InertiaPlugin).
 * Não anda sozinho. Botões Anterior/Próximo e setas do teclado para quem não arrasta.
 * Movimento reduzido: fica a rolagem horizontal nativa.
 */
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { animar, gsap } from './gsap';

gsap.registerPlugin(Draggable, InertiaPlugin);

export function iniciar(): void {
  const janela = document.querySelector<HTMLElement>('[data-carrossel]');
  const trilho = janela?.querySelector<HTMLElement>('[data-carrossel-trilho]');
  const controles = document.querySelector<HTMLElement>('[data-carrossel-controles]');
  if (!janela || !trilho) return;
  const originais = [...trilho.children] as HTMLElement[];
  if (originais.length < 2) return;

  animar(janela, ({ movimento }) => {
    if (!movimento) return;

    // Largura de um ciclo: distância entre o 1º original e a sua 1ª cópia.
    const clones: HTMLElement[] = [];
    const clonar = () => {
      for (const o of originais) {
        const c = o.cloneNode(true) as HTMLElement;
        c.setAttribute('aria-hidden', 'true');
        c.inert = true;
        trilho.append(c);
        clones.push(c);
      }
    };
    clonar();
    const ciclo = () => (clones[0]?.offsetLeft ?? 0) - (originais[0]?.offsetLeft ?? 0);
    while (trilho.scrollWidth < janela.clientWidth + ciclo() * 2) clonar();

    janela.classList.add('carrossel--arrastavel');
    janela.scrollLeft = 0;
    if (controles) controles.hidden = false;

    const passo = () => ciclo() / originais.length;
    const proxy = document.createElement('div');
    const posicionar = () => {
      const largura = ciclo();
      const x = gsap.utils.wrap(-largura, 0, Number(gsap.getProperty(proxy, 'x')));
      gsap.set(trilho, { x });
    };

    const [arrasto] = Draggable.create(proxy, {
      type: 'x',
      trigger: janela,
      inertia: true,
      allowContextMenu: true,
      dragClickables: false,
      cursor: 'grab',
      activeCursor: 'grabbing',
      onPress: () => gsap.killTweensOf(proxy),
      onDrag: posicionar,
      onThrowUpdate: posicionar,
      snap: { x: (v: number) => Math.round(v / passo()) * passo() },
    });

    const mover = (direcao: 1 | -1) =>
      gsap.to(proxy, {
        x: Math.round((Number(gsap.getProperty(proxy, 'x')) - direcao * passo()) / passo()) * passo(),
        duration: 0.6,
        ease: 'power3.out',
        onUpdate: posicionar,
      });

    const clique = (e: Event) => {
      const acao = (e.target as Element).closest<HTMLElement>('[data-carrossel-acao]')?.dataset.carrosselAcao;
      if (acao === 'proximo') mover(1);
      if (acao === 'anterior') mover(-1);
    };
    const teclas = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        mover(1);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        mover(-1);
      }
    };
    controles?.addEventListener('click', clique);
    janela.addEventListener('keydown', teclas);

    return () => {
      arrasto?.kill();
      controles?.removeEventListener('click', clique);
      janela.removeEventListener('keydown', teclas);
      for (const c of clones) c.remove();
      gsap.set(trilho, { clearProps: 'transform' });
      janela.classList.remove('carrossel--arrastavel');
      if (controles) controles.hidden = true;
    };
  });
}
