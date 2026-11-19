# Daruma Temaki e Rolls: site

Site do restaurante japonês **Daruma Temaki e Rolls** (Rua Pedro Preti, 6, Jardim Maria Izabel, Marília-SP), feito para levar o visitante a reservar pelo WhatsApp, pedir delivery (WhatsApp ou iFood), ligar ou traçar a rota.

- **Astro 7** (site 100% estático) + **Tailwind CSS v4** (`@tailwindcss/vite`, tokens em `@theme`)
- **GSAP 3.15** (ScrollTrigger, SplitText, Flip, DrawSVG, MorphSVG, Draggable, Inertia, CustomEase), carregado sob demanda só nas seções que animam
- **Lenis** para rolagem suave, integrado ao ScrollTrigger
- CSS moderno: scroll-driven animations, View Transitions entre páginas, `@starting-style`, `@property`, anchor positioning, sempre com fallback
- TypeScript estrito · hospedagem na **Hostinger** (`.htaccess` gerado no build)

Páginas: **home** (página longa com rodízio, almoço de domingo, destaques, delivery, reservas, avaliações, história, galeria, Instagram e contato), **/cardapio**, **/privacidade** e **404**.

---

## Rodando no seu computador

Requisito: **Node.js 22.23.4 ou mais novo** (recomendado: Node 24, veja `.nvmrc`).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # verifica tipos (astro check) e gera o site em dist/
npm run preview   # serve o dist/ localmente
```

---

## Como editar os textos

Todo o conteúdo fica em **`src/data/`**. Dá para editar sem mexer no layout:

| Arquivo | O que tem |
| --- | --- |
| `site.ts` | Nome, endereço, coordenadas, **telefone**, **WhatsApp**, links (iFood, Instagram, Facebook, avaliar no Google), **nota e nº de avaliações do Google**, faixa de preço, aviso no topo, razão social e CNPJ, mensagens do WhatsApp, menu |
| `horarios.ts` | **Horário de funcionamento** (única fonte: selo "Aberto agora", rodapé, reservas, contato e Google) e **feriados** |
| `cardapio.ts` | Categorias, selos e **pratos** (nome, descrição, preço, foto, selos, destaque na home) |
| `rodizio.ts` | Modalidades do rodízio (o que inclui, **preços por dia e turno**, regras) e as 5 etapas |
| `delivery.ts` | Texto do delivery próprio (área, taxa, tempo) e **combos** |
| `depoimentos.ts` | Depoimentos copiados do Google |
| `galeria.ts` | Fotos da galeria e da grade do Instagram |
| `faq.ts` | Perguntas frequentes (também viram dados estruturados para o Google) |
| `japones.ts` | Palavras em japonês usadas como textura (だるま, 手巻き…) |

Outros pontos:

- **Textos das seções** (título do hero, história do Daruma, grupos e aniversários): no próprio arquivo da seção, em `src/components/sections/`.
- **Horários:** cada dia tem uma lista de turnos; dia sem turno é dia fechado. Turno que passa da meia-noite: use o fechamento do dia seguinte (ex.: `fecha: '00:30'`). Feriado: adicione em `excecoes` com `status: 'fechado'` ou `'especial'`.
- **Preço vazio** (`null`) aparece como "R$ [PREENCHER]".
- **Cores e fontes:** em `src/styles/global.css`, bloco `@theme`. O vermelho dos botões é `--color-daruma-600`; para texto vermelho sobre fundo escuro use `daruma-400` (o 600 não passa no contraste AA como texto).
- **Política de privacidade:** `src/pages/privacidade.astro` (razão social e CNPJ vêm de `site.ts`).

Procure por `[PREENCHER]` no projeto para achar tudo que ainda precisa ser preenchido:

```bash
grep -rn "\[PREENCHER\]" src
```

Hoje faltam: **preços do rodízio**, **pratos reais** (os 9 atuais são exemplos, um por categoria), **combos**, **depoimentos**, regras de crianças, desperdício e grupos, área e taxa do delivery, oferta do almoço de domingo, história da casa, estacionamento e formas de pagamento, razão social, CNPJ e e-mail do encarregado de dados, e os textos alternativos das fotos.

---

## Fotos

Hoje todas as fotos são **provisórias**: fundos escuros com o contorno do Daruma, nas proporções certas. Para trocar, substitua o arquivo **mantendo o nome** e atualize o texto alternativo (`alt`). O Astro gera AVIF/WebP em vários tamanhos sozinho; envie a foto original em JPEG de boa qualidade.

| Onde | Arquivo | Proporção / mínimo |
| --- | --- | --- |
| Capa da home (imagem principal) | `src/assets/fotos/hero-chef.jpg` | 16:9, 1920 × 1080 |
| Almoço de domingo | `src/assets/fotos/almoco-domingo.jpg` | 16:10, 1600 × 1000 |
| Compartilhamento (WhatsApp, Facebook) | `src/assets/fotos/og-padrao.jpg` | 1200 × 630 |
| Pratos | `src/assets/fotos/pratos/<slug>/foto.jpg` | 3:2, 1200 × 800 |
| Etapas do rodízio | `src/assets/fotos/rodizio/<etapa>/foto.jpg` | 4:5, 1200 × 1500 |
| Combos | `src/assets/fotos/combos/<slug>/foto.jpg` | 3:2, 1200 × 800 |
| Galeria | `src/assets/fotos/galeria/<foto-n>/foto.jpg` | livre (a grade se ajusta) |
| Grade do Instagram | `src/assets/fotos/instagram/<post-n>/foto.jpg` | 1:1, 800 × 800 |

Para um prato novo: crie a pasta `src/assets/fotos/pratos/<slug>/` com o `foto.jpg`, importe no topo de `src/data/cardapio.ts` e adicione o prato na lista.

**Capa da home:** é a imagem mais importante para a velocidade (LCP). Prefira fundo limpo e luz controlada; foto com muito ruído pesa mais. Depois do build, a maior versão AVIF (`dist/_astro/hero-chef.*.avif`) deve ficar abaixo de 120 KB.

**Vídeo do hero (opcional):** exporte em MP4 sem áudio, até 1,5 MB, coloque em `public/video/hero.mp4` e troque `VIDEO_HERO` em `src/components/sections/Hero.astro` para `'/video/hero.mp4'`. Ele só carrega depois da foto da capa, nunca com economia de dados ou movimento reduzido, e tem botão de pausa.

```bash
ffmpeg -i bruto.mov -an -vf "scale=1280:-2,fps=25" -c:v libx264 -crf 28 -preset slow -movflags +faststart public/video/hero.mp4
```

**Proibido:** fotos de banco de imagens, imagens geradas que imitem pratos reais e logos de terceiros.

---

## Analytics, Google Ads e Meta

Os IDs ficam em variáveis de ambiente (veja `.env.example`). Para rodar localmente, copie para `.env`. Na Hostinger, cadastre as mesmas variáveis (veja a publicação abaixo). **Todas são opcionais:** valor vazio, `-` ou qualquer coisa fora do formato esperado conta como "não configurado" (a validação fica em `src/scripts/env.ts`).

| Variável | Para quê |
| --- | --- |
| `PUBLIC_GA4_ID` | Google Analytics 4 (`G-XXXXXXX`) |
| `PUBLIC_GADS_ID` | Conta do Google Ads (`AW-XXXXXXXX`) |
| `PUBLIC_GADS_LABEL_RESERVA` | Rótulo da conversão "reserva pelo WhatsApp" |
| `PUBLIC_GADS_LABEL_DELIVERY` | Rótulo da conversão "pedido de delivery" (WhatsApp ou iFood) |
| `PUBLIC_META_PIXEL_ID` | Pixel do Meta |

- **Carregamento:** as tags entram depois que a página termina de abrir, para não pesar no carregamento (`src/components/global/Analytics.astro`). O site não exibe aviso de cookies; o uso está descrito na política de privacidade (`/privacidade`).
- **Eventos** (mesmo nome no GA4): `reserva_whatsapp`, `delivery_whatsapp`, `delivery_ifood`, `ligacao`, `rota`, `avaliar_google`, `ver_cardapio`. Qualquer link ou botão com `data-evento="<nome>"` dispara o evento; o formulário de reserva dispara `reserva_whatsapp` no envio. Reserva vira `Contact` no Meta e conversão de reserva no Ads; delivery vira `Lead` e conversão de delivery.
- Nenhum dado pessoal é enviado (nem o texto da mensagem do WhatsApp).
- Marque `reserva_whatsapp`, `delivery_whatsapp` e `delivery_ifood` como **eventos-chave** no GA4.

---

## Publicar na Hostinger

O site é estático: o build gera a pasta `dist/`, que é o que vai para o servidor. Junto vai um `.htaccess` (gerado por `integrations/hostinger.ts`) com:

- páginas sem `.html` (`/cardapio` abre `cardapio.html`);
- redirecionamentos 301 de endereços do site antigo (lista em `astro.config.ts` → `redirecionamentos`; hoje: `/cardapio-daruma-temaki-e-rolls` → `/cardapio`);
- página 404 personalizada e redirecionamento de `www.darumatemakirolls.com.br` para `darumatemakirolls.com.br`;
- cabeçalhos de segurança, HTML sempre atualizado e cache de 1 ano para os arquivos de `/_astro/` (que têm hash no nome).

### Opção A: importar do GitHub (publica sozinho a cada push)

1. No hPanel, crie o site importando o repositório `hagamarketing/Site-Daruma` do GitHub.
2. Configuração do build:
   - **Framework:** Astro
   - **Comando de build:** `npm run build`
   - **Pasta de saída:** `dist`
   - **Versão do Node:** 24 (o Astro 7 exige 22.23.4 ou mais nova)
3. **Variáveis de ambiente:** preencha as que já tiver. As outras podem ser removidas (X) ou receber `-`.
4. Publique e teste estes endereços. Todos devem funcionar; se `/cardapio` der 404, use a opção B.
   - `https://seu-dominio/cardapio`
   - `https://seu-dominio/cardapio-daruma-temaki-e-rolls` (deve ir para `/cardapio`)
   - `https://seu-dominio/qualquer-coisa` (deve mostrar a página 404 do site)

### Opção B: enviar os arquivos manualmente

1. No seu computador: `npm install` e `npm run build`. Se quiser os IDs de Analytics/Ads/Meta, crie antes o `.env` a partir do `.env.example`.
2. Compacte **o conteúdo** da pasta `dist/` num `.zip`. Os arquivos `.htaccess` são ocultos: confira que eles entraram no zip.
3. No hPanel: **Gerenciador de Arquivos → public_html**, apague o que houver lá (por exemplo o `default.php` ou o site antigo), envie o zip e extraia.
4. A cada mudança, repita o build e o envio.

### Apontar o domínio darumatemakirolls.com.br

O site atual está no Hostinger AI Builder. Na troca:

1. **Antes de trocar**, liste as páginas do site antigo (Google Search Console → Indexação → Páginas, ou abrindo o site) e adicione em `redirecionamentos` (`astro.config.ts`) as que tiverem equivalente novo. Exemplo: `{ de: 'contato', para: '/#contato' }`.
2. No hPanel, conecte o domínio ao novo site (**Domínios → Conectar domínio**) e desligue o site do AI Builder.
3. Se o domínio está no **Registro.br** e ainda não aponta para a Hostinger: entre no domínio → **DNS → Alterar servidores DNS** e coloque os nameservers que a Hostinger mostrar. Se o domínio tiver e-mail, confira os registros MX antes.
4. Em **Segurança → SSL**, instale o certificado gratuito e ative **Forçar HTTPS**.

### Depois de publicar

- [ ] **Google Search Console:** envie `https://darumatemakirolls.com.br/sitemap-index.xml` e peça a indexação da home e do `/cardapio`.
- [ ] **Teste de pesquisa aprimorada** (search.google.com/test/rich-results) na home e no `/cardapio`: `Restaurant`, `FAQPage`, `Menu` e `BreadcrumbList` sem erros.
- [ ] **Google Meu Negócio:** atualize o site com UTM: `https://darumatemakirolls.com.br/?utm_source=google&utm_medium=organic&utm_campaign=gbp`. Em "Cardápio", use `https://darumatemakirolls.com.br/cardapio?utm_source=google&utm_medium=organic&utm_campaign=gbp`. Confira que horários, endereço e telefone batem com `src/data/`.
- [ ] Atualize o link do site no Instagram e no Facebook (`?utm_source=instagram&utm_medium=social&utm_campaign=bio`).
- [ ] Teste no celular: reserva abre o WhatsApp com a mensagem certa; iFood, ligação, Google Maps e Waze funcionam.

---

## Estrutura

```
src/
  data/          conteúdo editável (dados da casa, horários, cardápio, rodízio, delivery, depoimentos, galeria, FAQ)
  assets/        fotos (provisórias) e fontes auto-hospedadas (Instrument Serif, Manrope, Shippori Mincho)
  layouts/       Base.astro (SEO, preloader, menu, rodapé, barra do celular, scripts globais)
  components/
    ui/          Botão, selos, ícones, logo, o Daruma, foto, card de prato, formulário de reserva, mapa, horários…
    global/      Menu, rodapé, barra fixa do celular, SEO (JSON-LD), tags de marketing
    sections/    Uma seção da home por arquivo
  scripts/       horários (aberto/fechado, reserva, JSON-LD), reserva, filtros do cardápio, selo de status, analytics
    motion/      animações: um módulo por seção, carregados sob demanda
  styles/        global.css (tokens, texturas, botões, preloader, transições)
  pages/         index, cardapio, privacidade, 404
public/          robots.txt, favicon
integrations/    hostinger.ts: gera o .htaccess (páginas, 301, 404, cache, segurança)
```

### Notas de motion e performance

- O GSAP não entra no carregamento inicial: só o título do hero anima de imediato; as outras seções carregam o que precisam quando chegam perto da tela, depois da primeira interação (`src/scripts/motion/index.ts`).
- Animações usam só `transform`, `opacity`, `clip-path` e `filter`.
- **Preloader** (olho do Daruma pintado + cortina vermelha): só na 1ª visita da sessão, menos de 1,2 s, pula com clique ou tecla.
- **No celular:** sem cursor, sem efeito magnético e sem inclinação 3D; o rodízio rola na horizontal com scroll-snap nativo.
- **`prefers-reduced-motion`:** sem preloader, parallax, Lenis e cursor; o rodízio vira lista vertical e o resto aparece com fades curtos.
- **Sem JavaScript** o site funciona: conteúdo visível, cardápio com âncoras por categoria e reserva com mensagem editável que abre o WhatsApp.
