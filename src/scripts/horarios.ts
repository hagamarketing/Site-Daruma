/**
 * Lógica de horários: aberto/fechado, próxima abertura, horários de reserva e JSON-LD.
 * Funções puras: recebem os dados de src/data/horarios.ts e um instante.
 * Este módulo também roda no navegador (selo de status ao vivo), então não importa dados nem bibliotecas.
 */

export const DIAS = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'] as const;
export type Dia = (typeof DIAS)[number];

export interface Turno {
  nome: string;
  /** "HH:MM" no fuso da casa */
  abre: string;
  /** "HH:MM". Se for menor ou igual a `abre`, fecha no dia seguinte. */
  fecha: string;
}

export type Semana = Record<Dia, Turno[]>;

export interface Excecao {
  /** "AAAA-MM-DD" */
  data: string;
  status: 'fechado' | 'especial';
  turnos: Turno[];
  observacao: string;
}

export interface Horarios {
  fuso: string;
  semana: Semana;
  excecoes: Excecao[];
}

export const NOME_DIA: Record<Dia, { curto: string; longo: string }> = {
  domingo: { curto: 'Dom', longo: 'domingo' },
  segunda: { curto: 'Seg', longo: 'segunda' },
  terca: { curto: 'Ter', longo: 'terça' },
  quarta: { curto: 'Qua', longo: 'quarta' },
  quinta: { curto: 'Qui', longo: 'quinta' },
  sexta: { curto: 'Sex', longo: 'sexta' },
  sabado: { curto: 'Sáb', longo: 'sábado' },
};

const MINUTOS_DIA = 24 * 60;

// ---------------------------------------------------------------- utilitários de data

export const paraMinutos = (hhmm: string): number => {
  const [h = '0', m = '0'] = hhmm.split(':');
  return Number(h) * 60 + Number(m);
};

const deMinutos = (min: number): string => {
  const m = ((min % MINUTOS_DIA) + MINUTOS_DIA) % MINUTOS_DIA;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

/** Data civil "AAAA-MM-DD" somada de n dias (sem fuso: aritmética de calendário). */
export function somarDias(dataISO: string, n: number): string {
  const [a, m, d] = dataISO.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(a, m - 1, d + n)).toISOString().slice(0, 10);
}

export function diaDaSemana(dataISO: string): Dia {
  const [a, m, d] = dataISO.split('-').map(Number) as [number, number, number];
  return DIAS[new Date(Date.UTC(a, m - 1, d)).getUTCDay()] as Dia;
}

const formatadores = new Map<string, Intl.DateTimeFormat>();

/** Data e minuto do dia de um instante, no fuso da casa. */
export function agoraNoFuso(instante: Date, fuso: string): { data: string; minutos: number } {
  let f = formatadores.get(fuso);
  if (!f) {
    f = new Intl.DateTimeFormat('en-CA', {
      timeZone: fuso,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });
    formatadores.set(fuso, f);
  }
  const p = Object.fromEntries(f.formatToParts(instante).map((x) => [x.type, x.value]));
  return { data: `${p.year}-${p.month}-${p.day}`, minutos: Number(p.hour) * 60 + Number(p.minute) };
}

// ---------------------------------------------------------------- turnos

/** Turnos válidos numa data, considerando exceções (feriados) de src/data/horarios.ts. */
export function turnosDaData(dataISO: string, h: Horarios): { turnos: Turno[]; excecao?: Excecao } {
  const excecao = h.excecoes.find((e) => e.data === dataISO);
  if (excecao) return { turnos: excecao.status === 'fechado' ? [] : excecao.turnos, excecao };
  return { turnos: h.semana[diaDaSemana(dataISO)] ?? [] };
}

interface Intervalo {
  turno: Turno;
  inicio: number;
  fim: number;
}

/** Intervalos em minutos a partir da meia-noite da data (fim pode passar de 1440). */
function intervalos(turnos: Turno[]): Intervalo[] {
  return turnos
    .map((turno) => {
      const inicio = paraMinutos(turno.abre);
      let fim = paraMinutos(turno.fecha);
      if (fim <= inicio) fim += MINUTOS_DIA;
      return { turno, inicio, fim };
    })
    .sort((a, b) => a.inicio - b.inicio);
}

// ---------------------------------------------------------------- status

export type Status =
  | { aberto: true; turno: Turno; fechaAs: string; minutosParaFechar: number }
  | {
      aberto: false;
      proxima: { data: string; emDias: number; dia: Dia; turno: Turno; minutosParaAbrir: number } | null;
      /** Observação da exceção de hoje (ex.: "Natal"), se houver. */
      motivo?: string;
    };

/** Procura a próxima abertura em até 21 dias. */
const LIMITE_BUSCA = 21;

export function statusEm(instante: Date, h: Horarios): Status {
  const { data: hoje, minutos } = agoraNoFuso(instante, h.fuso);

  // Turno de ontem que atravessou a meia-noite ainda aberto?
  const ontem = somarDias(hoje, -1);
  for (const i of intervalos(turnosDaData(ontem, h).turnos)) {
    if (i.fim > MINUTOS_DIA && minutos < i.fim - MINUTOS_DIA) {
      return {
        aberto: true,
        turno: i.turno,
        fechaAs: deMinutos(i.fim),
        minutosParaFechar: i.fim - MINUTOS_DIA - minutos,
      };
    }
  }

  const deHoje = turnosDaData(hoje, h);
  for (const i of intervalos(deHoje.turnos)) {
    if (minutos >= i.inicio && minutos < i.fim) {
      return { aberto: true, turno: i.turno, fechaAs: deMinutos(i.fim), minutosParaFechar: i.fim - minutos };
    }
  }

  const motivo = deHoje.excecao?.observacao || undefined;
  for (let n = 0; n <= LIMITE_BUSCA; n++) {
    const data = somarDias(hoje, n);
    const proximo = intervalos(turnosDaData(data, h).turnos).find((i) => n > 0 || i.inicio > minutos);
    if (proximo) {
      return {
        aberto: false,
        proxima: {
          data,
          emDias: n,
          dia: diaDaSemana(data),
          turno: proximo.turno,
          minutosParaAbrir: n * MINUTOS_DIA + proximo.inicio - minutos,
        },
        ...(motivo ? { motivo } : {}),
      };
    }
  }
  return { aberto: false, proxima: null, ...(motivo ? { motivo } : {}) };
}

export type EstadoSelo = 'aberto' | 'fechado' | 'em-breve';

/** Texto e estado visual do selo. "em-breve" quando abre em até 60 minutos. */
export function textoStatus(s: Status): { estado: EstadoSelo; texto: string } {
  if (s.aberto) return { estado: 'aberto', texto: `Aberto agora · até ${formatarHora(s.fechaAs)}` };
  const prefixo = s.motivo ? `Fechado (${s.motivo})` : 'Fechado';
  if (!s.proxima) return { estado: 'fechado', texto: prefixo };
  const { emDias, dia, turno, minutosParaAbrir } = s.proxima;
  const hora = formatarHora(turno.abre);
  if (emDias === 0) {
    return minutosParaAbrir <= 60
      ? { estado: 'em-breve', texto: `Abre hoje às ${hora}` }
      : { estado: 'fechado', texto: `${prefixo} · abre hoje às ${hora}` };
  }
  const quando =
    emDias === 1
      ? 'amanhã'
      : emDias < 7
        ? NOME_DIA[dia].longo
        : `dia ${s.proxima.data.slice(8, 10)}/${s.proxima.data.slice(5, 7)}`;
  return {
    estado: minutosParaAbrir <= 60 ? 'em-breve' : 'fechado',
    texto: `${prefixo} · abre ${quando} às ${hora}`,
  };
}

/** Domingo no fuso da casa (selo "Novo: almoço de domingo"). */
export function ehDomingo(instante: Date, h: Horarios): boolean {
  return diaDaSemana(agoraNoFuso(instante, h.fuso).data) === 'domingo';
}

// ---------------------------------------------------------------- reserva

export interface OpcoesReserva {
  /** Intervalo entre horários oferecidos, em minutos. */
  passo?: number;
  /** Última reserva aceita X minutos antes de fechar. */
  antesDeFechar?: number;
  /** Se informado e a data for hoje, esconde horários com menos de `antecedencia` minutos. */
  agora?: Date;
  antecedencia?: number;
}

/** Horários de reserva válidos para uma data, agrupados por turno. */
export function horariosDeReserva(
  dataISO: string,
  h: Horarios,
  { passo = 30, antesDeFechar = 60, agora, antecedencia = 30 }: OpcoesReserva = {},
): Array<{ turno: string; horarios: string[] }> {
  let minimo = -1;
  if (agora) {
    const local = agoraNoFuso(agora, h.fuso);
    if (local.data === dataISO) minimo = local.minutos + antecedencia;
    else if (local.data > dataISO) return [];
  }
  return intervalos(turnosDaData(dataISO, h).turnos)
    .map((i) => {
      const lista: string[] = [];
      for (let m = i.inicio; m <= i.fim - antesDeFechar; m += passo)
        if (m >= minimo) lista.push(deMinutos(m));
      return { turno: i.turno.nome, horarios: lista };
    })
    .filter((g) => g.horarios.length > 0);
}

// ---------------------------------------------------------------- exibição

/** "18:00" → "18h", "23:30" → "23h30", "00:30" → "0h30" */
export function formatarHora(hhmm: string): string {
  const [h, m] = hhmm.split(':');
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`;
}

export const formatarTurno = (t: Turno): string => `${formatarHora(t.abre)}–${formatarHora(t.fecha)}`;

export interface LinhaHorario {
  dias: Dia[];
  rotulo: string;
  turnos: Turno[];
}

const ORDEM_EXIBICAO: Dia[] = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];

/** Agrupa dias com turnos iguais (segunda → domingo) para exibição compacta. */
export function agruparSemana(semana: Semana): LinhaHorario[] {
  const chave = (t: Turno[]) => t.map((x) => `${x.nome}|${x.abre}|${x.fecha}`).join(';');
  const grupos = new Map<string, LinhaHorario>();
  for (const dia of ORDEM_EXIBICAO) {
    const turnos = semana[dia] ?? [];
    const g = grupos.get(chave(turnos));
    if (g) g.dias.push(dia);
    else grupos.set(chave(turnos), { dias: [dia], rotulo: '', turnos });
  }
  return [...grupos.values()].map((g) => ({ ...g, rotulo: listarDias(g.dias) }));
}

function listarDias(dias: Dia[]): string {
  const nomes = dias.map((d) => NOME_DIA[d].curto);
  if (nomes.length === 1) return nomes[0] ?? '';
  return `${nomes.slice(0, -1).join(', ')} e ${nomes.at(-1)}`;
}

// ---------------------------------------------------------------- JSON-LD

const DIA_SCHEMA: Record<Dia, string> = {
  domingo: 'Sunday',
  segunda: 'Monday',
  terca: 'Tuesday',
  quarta: 'Wednesday',
  quinta: 'Thursday',
  sexta: 'Friday',
  sabado: 'Saturday',
};

export interface OpeningHoursSpecification {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek?: string[];
  opens: string;
  closes: string;
  validFrom?: string;
  validThrough?: string;
}

/**
 * `openingHoursSpecification` do JSON-LD, gerado de src/data/horarios.ts.
 * Inclui exceções a partir de `desde` (normalmente a data do build) como horário especial.
 */
export function paraOpeningHours(h: Horarios, desde?: string): OpeningHoursSpecification[] {
  const porHorario = new Map<string, string[]>();
  for (const dia of DIAS) {
    for (const t of h.semana[dia] ?? []) {
      const k = `${t.abre}|${t.fecha}`;
      porHorario.set(k, [...(porHorario.get(k) ?? []), DIA_SCHEMA[dia]]);
    }
  }
  const regulares: OpeningHoursSpecification[] = [...porHorario].map(([k, dias]) => {
    const [opens = '', closes = ''] = k.split('|');
    return { '@type': 'OpeningHoursSpecification', dayOfWeek: dias, opens, closes };
  });
  const especiais = h.excecoes
    .filter((e) => !desde || e.data >= desde)
    .flatMap<OpeningHoursSpecification>((e) =>
      e.status === 'fechado' || e.turnos.length === 0
        ? [
            {
              '@type': 'OpeningHoursSpecification',
              opens: '00:00',
              closes: '00:00',
              validFrom: e.data,
              validThrough: e.data,
            },
          ]
        : e.turnos.map((t) => ({
            '@type': 'OpeningHoursSpecification',
            opens: t.abre,
            closes: t.fecha,
            validFrom: e.data,
            validThrough: e.data,
          })),
    );
  return [...regulares, ...especiais];
}
