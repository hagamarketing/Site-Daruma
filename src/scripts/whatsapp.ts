/** Mensagem de reserva montada a partir do formulário (enviada pelo próprio cliente no WhatsApp). */

export interface DadosReserva {
  /** "AAAA-MM-DD" */
  data: string;
  /** "HH:MM" */
  horario: string;
  pessoas: number;
  ocasiao?: string | undefined;
  nome?: string | undefined;
  observacao?: string | undefined;
}

const DIAS_SEMANA = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];

/** "2026-11-22" → "domingo, 22/11" */
export function dataPorExtenso(dataISO: string): string {
  const [a, m, d] = dataISO.split('-').map(Number) as [number, number, number];
  const dia = DIAS_SEMANA[new Date(Date.UTC(a, m - 1, d)).getUTCDay()];
  return `${dia}, ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`;
}

export function mensagemReserva(r: DadosReserva): string {
  const [h, min] = r.horario.split(':');
  const hora = min === '00' ? `${Number(h)}h` : `${Number(h)}h${min}`;
  const linhas = [
    'Olá! Quero reservar uma mesa no Daruma.',
    '',
    `Data: ${dataPorExtenso(r.data)}`,
    `Horário: ${hora}`,
    `Pessoas: ${r.pessoas}`,
  ];
  if (r.ocasiao) linhas.push(`Ocasião: ${r.ocasiao}`);
  if (r.nome) linhas.push(`Nome: ${r.nome}`);
  if (r.observacao) linhas.push(`Observação: ${r.observacao}`);
  return linhas.join('\n');
}
