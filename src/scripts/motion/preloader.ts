import { EVENTO_PRELOADER_FIM } from '@/scripts/eventos';

/** Espera o fim do preloader (se estiver na tela) antes de animar o hero. */
export function aposPreloader(): Promise<void> {
  if (document.documentElement.dataset.preloader !== 'ativo') return Promise.resolve();
  return new Promise((resolve) => {
    addEventListener(EVENTO_PRELOADER_FIM, () => resolve(), { once: true });
    setTimeout(resolve, 1500);
  });
}

export function fontesProntas(limite = 1200): Promise<void> {
  return Promise.race([
    document.fonts.ready.then(() => undefined),
    new Promise<void>((r) => setTimeout(r, limite)),
  ]);
}
