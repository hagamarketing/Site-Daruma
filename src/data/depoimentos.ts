/**
 * Depoimentos copiados do Google (sem alterar o sentido). Não invente depoimentos.
 * `data`: "AAAA-MM-DD" ou null.
 */
export interface Depoimento {
  nome: string;
  texto: string;
  nota: 1 | 2 | 3 | 4 | 5;
  data: string | null;
}

export const depoimentos: Depoimento[] = [
  {
    nome: '[PREENCHER] Cliente 1',
    texto: '[PREENCHER] Copie aqui um depoimento real do Google, sem alterar o sentido.',
    nota: 5,
    data: null
  },
  {
    nome: '[PREENCHER] Cliente 2',
    texto: '[PREENCHER] Copie aqui um depoimento real do Google, sem alterar o sentido.',
    nota: 5,
    data: null
  },
  {
    nome: '[PREENCHER] Cliente 3',
    texto: '[PREENCHER] Copie aqui um depoimento real do Google, sem alterar o sentido.',
    nota: 5,
    data: null
  }
];
