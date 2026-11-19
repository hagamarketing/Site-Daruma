/**
 * Horário de funcionamento: a ÚNICA fonte de horários do site.
 * O selo "Aberto agora", o rodapé, a reserva, o contato e os dados para o Google leem daqui.
 *
 * - Cada dia tem uma lista de turnos. Dia sem turno = fechado.
 * - Horário no formato "HH:MM" (24h). Se o turno passa da meia-noite, use o fechamento do dia
 *   seguinte (ex.: fecha: '00:30') e o sistema entende.
 * - Feriados e datas especiais: em `excecoes`, com status 'fechado' ou 'especial' (com turnos).
 */
import type { Horarios } from '@/scripts/horarios';

export type { Dia } from '@/scripts/horarios';

export const horarios: Horarios = {
  fuso: 'America/Sao_Paulo',
  semana: {
    domingo: [{ nome: 'Almoço', abre: '11:30', fecha: '15:00' }, { nome: 'Jantar', abre: '18:00', fecha: '23:30' }],
    segunda: [{ nome: 'Jantar', abre: '18:00', fecha: '23:30' }],
    terca: [{ nome: 'Jantar', abre: '18:00', fecha: '23:30' }],
    quarta: [],
    quinta: [{ nome: 'Jantar', abre: '18:00', fecha: '23:30' }],
    sexta: [{ nome: 'Jantar', abre: '18:00', fecha: '23:30' }],
    sabado: [{ nome: 'Jantar', abre: '18:00', fecha: '23:30' }],
  },
  excecoes: [
    // Exemplo: { data: '2026-12-25', status: 'fechado', turnos: [], observacao: 'Natal' },
  ],
};
