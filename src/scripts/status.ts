/**
 * Selo de status ao vivo ("Aberto agora" / "Abre hoje às 18h").
 * Lê os horários do atributo data-horarios (gerado no build a partir de src/data/horarios.ts)
 * e atualiza a cada minuto e quando a aba volta a ficar visível.
 */
import { ehDomingo, type Horarios, statusEm, textoStatus } from '@/scripts/horarios';

function atualizar(): void {
  const agora = new Date();
  for (const el of document.querySelectorAll<HTMLElement>('[data-status-ao-vivo]')) {
    try {
      const h = JSON.parse(el.dataset.horarios ?? '') as Horarios;
      const { estado, texto } = textoStatus(statusEm(agora, h));
      el.classList.remove('status--aberto', 'status--fechado', 'status--em-breve');
      el.classList.add(`status--${estado}`);
      const alvo = el.querySelector('.status__texto');
      if (alvo && alvo.textContent !== texto) alvo.textContent = texto;
      el.dataset.estado = estado;
    } catch {
      // Dados inválidos: mantém o texto estático do HTML.
    }
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-so-domingo]')) {
    try {
      el.hidden = !ehDomingo(agora, JSON.parse(el.dataset.horarios ?? '') as Horarios);
    } catch {
      el.hidden = true;
    }
  }
}

atualizar();
const proximoMinuto = 60_000 - (Date.now() % 60_000);
setTimeout(() => {
  atualizar();
  setInterval(atualizar, 60_000);
}, proximoMinuto);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') atualizar();
});
