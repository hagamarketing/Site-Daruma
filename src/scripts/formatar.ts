const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** Preço para exibição. Sem preço definido em src/data → "[PREENCHER]". */
export function formatarPreco(valor: number | null | undefined): string {
  return typeof valor === 'number' ? moeda.format(valor) : 'R$ [PREENCHER]';
}

/** Texto para leitor de tela: "Preço: 39 reais e 90 centavos". */
export function precoPorExtenso(valor: number | null | undefined): string {
  if (typeof valor !== 'number') return 'Preço a definir';
  const reais = Math.floor(valor);
  const centavos = Math.round((valor - reais) * 100);
  return `Preço: ${reais} ${reais === 1 ? 'real' : 'reais'}${centavos ? ` e ${centavos} centavos` : ''}`;
}

export const ehPlaceholder = (texto: string | null | undefined): boolean =>
  !texto || texto.includes('[PREENCHER]');
