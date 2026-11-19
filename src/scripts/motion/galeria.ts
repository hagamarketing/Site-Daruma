/**
 * Lightbox da galeria: <dialog> modal (foco preso e Esc nativos) + @starting-style no CSS.
 * Onde houver View Transitions, a miniatura "cresce" até a foto ampliada.
 * Sem JS, cada miniatura é um link para a foto grande.
 */

export function iniciar(): void {
  const grade = document.querySelector<HTMLElement>('[data-galeria]');
  if (!grade) return;
  const links = [...grade.querySelectorAll<HTMLAnchorElement>('a[data-lightbox]')];
  if (links.length === 0) return;

  const dialogo = document.createElement('dialog');
  dialogo.className = 'lightbox';
  dialogo.setAttribute('aria-label', 'Foto ampliada');
  dialogo.innerHTML = `
    <figure class="lightbox__figura">
      <img class="lightbox__img" alt="" />
      <figcaption class="lightbox__legenda"></figcaption>
    </figure>
    <div class="lightbox__controles">
      <button type="button" class="btn btn-fantasma btn-pequeno" data-acao="anterior">Anterior</button>
      <p class="lightbox__contador" aria-live="polite"></p>
      <button type="button" class="btn btn-fantasma btn-pequeno" data-acao="proxima">Próxima</button>
      <button type="button" class="btn btn-secundario btn-pequeno lightbox__fechar" data-acao="fechar" autofocus>Fechar</button>
    </div>`;
  document.body.append(dialogo);

  const img = dialogo.querySelector<HTMLImageElement>('.lightbox__img');
  const legenda = dialogo.querySelector<HTMLElement>('.lightbox__legenda');
  const contador = dialogo.querySelector<HTMLElement>('.lightbox__contador');
  if (!img || !legenda || !contador) return;
  let indice = 0;
  const reduzido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transicao = (fn: () => void) => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (doc.startViewTransition && !reduzido()) doc.startViewTransition(fn);
    else fn();
  };

  function mostrar(i: number): void {
    indice = (i + links.length) % links.length;
    const link = links[indice];
    const miniatura = link?.querySelector('img');
    if (!link || !img || !legenda || !contador) return;
    img.src = link.href;
    img.width = Number(link.dataset.largura) || 1600;
    img.height = Number(link.dataset.altura) || 1000;
    img.alt = miniatura?.alt ?? '';
    legenda.textContent = miniatura?.alt ?? '';
    contador.textContent = `${indice + 1} de ${links.length}`;
  }

  for (const [i, link] of links.entries()) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const miniatura = link.querySelector('img');
      if (miniatura) miniatura.style.viewTransitionName = 'foto-ampliada';
      transicao(() => {
        if (miniatura) miniatura.style.viewTransitionName = '';
        if (img) img.style.viewTransitionName = 'foto-ampliada';
        mostrar(i);
        dialogo.showModal();
      });
    });
  }

  dialogo.addEventListener('click', (e) => {
    const alvo = e.target as HTMLElement;
    const acao = alvo.closest<HTMLElement>('[data-acao]')?.dataset.acao;
    if (acao === 'anterior') mostrar(indice - 1);
    else if (acao === 'proxima') mostrar(indice + 1);
    else if (acao === 'fechar' || alvo === dialogo) dialogo.close();
  });
  dialogo.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mostrar(indice - 1);
    if (e.key === 'ArrowRight') mostrar(indice + 1);
  });
  dialogo.addEventListener('close', () => {
    if (img) img.style.viewTransitionName = '';
    links[indice]?.focus();
  });
}
