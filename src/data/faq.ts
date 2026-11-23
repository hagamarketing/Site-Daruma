/**
 * Perguntas frequentes (seção Contato da home). Também viram dados estruturados (FAQPage) para o Google.
 * Respostas sobre horário, endereço e canais são montadas a partir de site.ts e horarios.ts.
 */
import { horarios } from '@/data/horarios';
import { site } from '@/data/site';
import { agruparSemana, formatarTurno } from '@/scripts/horarios';

export interface Pergunta {
  pergunta: string;
  resposta: string;
}

const resumoHorarios = agruparSemana(horarios.semana)
  .map((l) =>
    l.turnos.length
      ? `${l.rotulo}: ${l.turnos.map((t) => `${t.nome.toLowerCase()} das ${formatarTurno(t).replace('–', ' às ')}`).join(' e ')}`
      : `${l.rotulo}: fechado`,
  )
  .join('. ');

const almoco = horarios.semana.domingo.find((t) => t.nome.toLowerCase().startsWith('almo'));
const e = site.endereco;

export const faqIntro = {
  rotulo: 'Dúvidas',
  titulo: 'Perguntas frequentes',
};

export const faq: Pergunta[] = [
  { pergunta: 'Qual é o horário de funcionamento?', resposta: `${resumoHorarios}.` },
  {
    pergunta: 'O Daruma abre na quarta-feira?',
    resposta: horarios.semana.quarta.length
      ? `Sim: ${horarios.semana.quarta.map(formatarTurno).join(' e ')}.`
      : 'Não. A casa fecha às quartas-feiras.',
  },
  {
    pergunta: 'Vocês servem almoço?',
    resposta: almoco
      ? `Sim, aos domingos, das ${formatarTurno(almoco).replace('–', ' às ')}. Nos outros dias abrimos só para o jantar.`
      : 'Por enquanto abrimos só para o jantar.',
  },
  {
    pergunta: 'Em quais dias tem rodízio?',
    resposta: '[PREENCHER] Confirmar se o rodízio é servido em todos os dias e turnos de funcionamento.',
  },
  { pergunta: 'Criança paga rodízio?', resposta: '[PREENCHER] Regra de preço para crianças (idades e valores).' },
  {
    pergunta: 'Como faço uma reserva?',
    resposta: `Pelo formulário de reservas deste site, que já monta a mensagem, ou direto no WhatsApp ${site.whatsapp.exibicao}. Também atendemos pelo telefone ${site.telefone.exibicao}.`,
  },
  {
    pergunta: 'Vocês fazem delivery?',
    resposta: `Sim. Peça direto pelo nosso WhatsApp ${site.whatsapp.exibicao} ou pelo iFood.`,
  },
  { pergunta: 'Onde fica o restaurante?', resposta: `${e.rua}, ${e.bairro}, ${e.cidade} – ${e.uf}, CEP ${e.cep}.` },
  { pergunta: 'Tem estacionamento?', resposta: '[PREENCHER] Informar se há estacionamento próprio ou vagas na rua.' },
  { pergunta: 'Quais formas de pagamento vocês aceitam?', resposta: '[PREENCHER] Listar formas de pagamento.' },
];
