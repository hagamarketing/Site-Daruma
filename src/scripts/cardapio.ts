/**
 * Filtros e busca do cardápio. Sem JS, as categorias funcionam como âncoras.
 * Com JS, viram filtros; a animação de layout (GSAP Flip) entra na etapa de animações
 * escutando o evento "daruma:filtro".
 */

const raiz = document.querySelector<HTMLElement>('[data-filtros]')?.closest('.cardapio');

if (raiz) {
  const normalizar = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const botoesCat = [...raiz.querySelectorAll<HTMLElement>('[data-filtro]')];
  const botoesSelo = [...raiz.querySelectorAll<HTMLButtonElement>('[data-selo]')];
  const grupos = [...raiz.querySelectorAll<HTMLElement>('[data-grupo]')];
  const itens = [...raiz.querySelectorAll<HTMLElement>('[data-item]')];
  const busca = raiz.querySelector<HTMLInputElement>('[data-busca-input]');
  const status = raiz.querySelector<HTMLElement>('[data-busca-status]');
  const vazio = raiz.querySelector<HTMLElement>('[data-vazio]');

  // Links de categoria viram botões de filtro (mantendo a âncora como fallback de semântica).
  for (const el of botoesCat) {
    if (el instanceof HTMLAnchorElement) {
      el.setAttribute('role', 'button');
      el.setAttribute('aria-pressed', 'false');
    }
  }

  let categoria = 'todos';
  const selos = new Set<string>();

  function aplicar(): void {
    const termo = normalizar(busca?.value.trim() ?? '');
    const antes = new CustomEvent('daruma:filtro', { detail: { fase: 'antes', itens } });
    raiz?.dispatchEvent(antes);

    let visiveis = 0;
    for (const li of itens) {
      const card = li.querySelector<HTMLElement>('[data-prato]');
      if (!card) continue;
      const okCat = categoria === 'todos' || card.dataset.categoria === categoria;
      const seloCard = (card.dataset.selos ?? '').split(' ');
      const okSelo = [...selos].every((s) => seloCard.includes(s));
      const okBusca = !termo || normalizar(card.dataset.busca ?? '').includes(termo);
      li.hidden = !(okCat && okSelo && okBusca);
      if (!li.hidden) visiveis++;
    }
    for (const g of grupos) g.hidden = !g.querySelector('[data-item]:not([hidden])');
    if (vazio) vazio.hidden = visiveis > 0;
    if (status) status.textContent = visiveis === 1 ? '1 prato' : `${visiveis} pratos`;
    for (const b of botoesCat) b.setAttribute('aria-pressed', String(b.dataset.filtro === categoria));

    raiz?.dispatchEvent(new CustomEvent('daruma:filtro', { detail: { fase: 'depois', itens } }));
  }

  for (const b of botoesCat) {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      categoria = b.dataset.filtro === categoria ? 'todos' : (b.dataset.filtro ?? 'todos');
      aplicar();
    });
    b.addEventListener('keydown', (e) => {
      if (e.key === ' ' && b instanceof HTMLAnchorElement) {
        e.preventDefault();
        b.click();
      }
    });
  }
  for (const b of botoesSelo) {
    b.addEventListener('click', () => {
      const v = b.dataset.selo ?? '';
      if (selos.has(v)) selos.delete(v);
      else selos.add(v);
      b.setAttribute('aria-pressed', String(selos.has(v)));
      aplicar();
    });
  }
  let espera: ReturnType<typeof setTimeout> | undefined;
  busca?.addEventListener('input', () => {
    clearTimeout(espera);
    espera = setTimeout(aplicar, 120);
  });

  // Âncora na URL (#temakis) já abre filtrado.
  const inicial = decodeURIComponent(location.hash.slice(1));
  if (botoesCat.some((b) => b.dataset.filtro === inicial)) categoria = inicial;
  aplicar();
}
