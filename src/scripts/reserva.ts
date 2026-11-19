/**
 * Reserva guiada: troca o modo simples (textarea) pelo guiado e monta a mensagem no envio.
 * Os horários válidos vêm de src/scripts/horarios.ts, com os dados de src/data/horarios.ts (data-horarios).
 */

import { rastrear } from '@/scripts/analytics';
import { EVENTO_RESERVA } from '@/scripts/eventos';
import { agoraNoFuso, type Horarios, horariosDeReserva, somarDias } from '@/scripts/horarios';
import { mensagemReserva } from '@/scripts/whatsapp';

function iniciar(form: HTMLFormElement): void {
  const h = JSON.parse(form.dataset.horarios ?? '{}') as Horarios;
  const simples = form.querySelector<HTMLElement>('[data-modo-simples]');
  const guiado = form.querySelector<HTMLFieldSetElement>('[data-modo-guiado]');
  const campo = <T extends HTMLElement>(nome: string) => form.querySelector<T>(`[data-campo="${nome}"]`);
  const data = campo<HTMLInputElement>('data');
  const horario = campo<HTMLSelectElement>('horario');
  const pessoas = campo<HTMLInputElement>('pessoas');
  const ajuda = form.querySelector<HTMLElement>('[data-ajuda-horario]');
  const erroData = form.querySelector<HTMLElement>('[data-erro="data"]');
  if (!simples || !guiado || !data || !horario || !pessoas) return;

  // Ativa o modo guiado.
  simples.hidden = true;
  simples.querySelector('textarea')?.setAttribute('disabled', '');
  guiado.hidden = false;
  guiado.disabled = false;

  const ocasiao = new URLSearchParams(location.search).get('ocasiao');
  const campoOcasiao = campo<HTMLInputElement>('ocasiao');
  if (ocasiao && campoOcasiao && !campoOcasiao.value) campoOcasiao.value = ocasiao.slice(0, 60);

  const hoje = agoraNoFuso(new Date(), h.fuso).data;
  data.min = hoje;
  data.max = somarDias(hoje, 90);

  const ajudaPadrao = ajuda?.textContent ?? '';

  function atualizarHorarios(): void {
    if (!data || !horario) return;
    const valorAnterior = horario.value;
    horario.replaceChildren();
    if (!data.value) {
      horario.append(new Option('Escolha a data primeiro', ''));
      return;
    }
    const grupos = horariosDeReserva(data.value, h, { agora: new Date() });
    if (grupos.length === 0) {
      horario.append(new Option('Sem horários nesta data', ''));
      data.setAttribute('aria-invalid', 'true');
      if (erroData) erroData.textContent = 'Fechado nesta data. Escolha outro dia (quarta não abrimos).';
      return;
    }
    data.removeAttribute('aria-invalid');
    if (erroData) erroData.textContent = '';
    horario.append(new Option('Escolha o horário', ''));
    for (const g of grupos) {
      const grupo = document.createElement('optgroup');
      grupo.label = g.turno;
      for (const hhmm of g.horarios) grupo.append(new Option(hhmm.replace(':', 'h'), hhmm));
      horario.append(grupo);
    }
    if (grupos.some((g) => g.horarios.includes(valorAnterior))) horario.value = valorAnterior;
    if (ajuda)
      ajuda.textContent =
        grupos
          .map(
            (g) =>
              `${g.turno}: ${g.horarios[0]?.replace(':', 'h')} a ${g.horarios.at(-1)?.replace(':', 'h')}`,
          )
          .join(' · ') || ajudaPadrao;
  }

  data.addEventListener('change', atualizarHorarios);
  data.addEventListener('input', atualizarHorarios);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity() || !data.value || !horario.value) return;
    const mensagem = mensagemReserva({
      data: data.value,
      horario: horario.value,
      pessoas: Number(pessoas.value),
      ocasiao: campo<HTMLInputElement>('ocasiao')?.value.trim() || undefined,
      observacao: campo<HTMLInputElement>('observacao')?.value.trim() || undefined,
    });
    const url = `${form.action}?text=${encodeURIComponent(mensagem)}`;
    const ocasiao = campo<HTMLInputElement>('ocasiao')?.value.trim() ?? '';
    const listadas = [...form.querySelectorAll<HTMLOptionElement>('datalist option')].map((o) => o.value);
    rastrear('reserva_whatsapp', {
      origem: 'formulario',
      pessoas: Number(pessoas.value),
      dia_semana: new Date(`${data.value}T12:00:00Z`).getUTCDay(),
      turno: horario.selectedOptions[0]?.parentElement?.getAttribute('label') ?? undefined,
      // Texto livre pode ter dado pessoal: só envia ocasiões da lista.
      ocasiao: ocasiao ? (listadas.includes(ocasiao) ? ocasiao : 'outra') : undefined,
    });
    // A etapa de animação escuta este evento para pintar o olho do Daruma antes de abrir o WhatsApp.
    const evento = new CustomEvent(EVENTO_RESERVA, {
      detail: { url, abrir: () => abrir(url) },
      cancelable: true,
    });
    if (form.dispatchEvent(evento)) abrir(url);
  });

  function abrir(url: string): void {
    const confirmacao = form.querySelector<HTMLElement>('[data-confirmacao]');
    if (confirmacao) confirmacao.hidden = false;
    const janela = window.open(url, '_blank');
    if (janela) janela.opener = null;
    else location.href = url; // pop-up bloqueado: abre na mesma aba
  }
}

for (const form of document.querySelectorAll<HTMLFormElement>('[data-reserva]')) iniciar(form);
