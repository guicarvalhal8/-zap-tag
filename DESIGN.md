---
name: Zap Tag
description: Landing page de adesivos NFC que disparam automações ao encostar o celular
colors:
  volt-lime: "#D4FF3F"
  circuit-cyan: "#00E5FF"
  deep-ink: "#14170B"
  void-black: "#0B0D0F"
  panel-surface: "#16191D"
  border-decorative: "#262A2E"
  border-meaningful: "#6B7280"
  signal-white: "#F2F4F5"
  muted-gray: "#9CA3AF"
typography:
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)"
    fontWeight: 500
    letterSpacing: "normal"
  accent:
    fontFamily: "Unbounded, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 600
    letterSpacing: "normal"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "8px"
  md: "10px"
  lg: "16px"
  pill: "999px"
  full: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "24px"
  xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.volt-lime}"
    textColor: "{colors.deep-ink}"
    rounded: "{rounded.md}"
    padding: "0 34px 0 24px (altura 52px, ponta da tag à direita)"
  button-primary-hover:
    backgroundColor: "{colors.volt-lime}"
    textColor: "{colors.deep-ink}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.signal-white}"
    rounded: "{rounded.md}"
    padding: "13px 24px"
  card-usecase:
    backgroundColor: "{colors.panel-surface}"
    textColor: "{colors.signal-white}"
    rounded: "{rounded.lg}"
    padding: "28px 24px"
---

# Design System: Zap Tag

## Overview

**Creative North Star: "The Live Circuit"**

Zap Tag sells NFC stickers — encostar o celular fecha um circuito e uma ação dispara sozinha. O sistema visual leva essa mecânica ao pé da letra: fundo quase preto como uma placa desenergizada, lime-neon como a faísca de ação, ciano como a resposta elétrica do sistema (foco, ripple, feedback). Tom confiante e imediato, tech-forward — alto contraste, direto ao ponto, sem suavização corporativa. Superfícies ficam planas em repouso; o brilho só aparece como resposta a uma interação, nunca como decoração parada — reforçando que este é um sistema que *reage ao toque*, não um pôster estático.

**Key Characteristics:**
- Neon-lime sobre quase-preto, alto contraste, sem meio-tom
- Uma cor de ação (lime), uma cor de resposta do sistema (ciano) — papéis nunca se misturam
- Componentes ganham profundidade só como reação ao hover/foco; o único glow parado é a atmosfera de seção (Hero e CTA final), nunca de componente
- Quatro vozes tipográficas com papel fixo cada: display, headline, accent, body

## Colors

Paleta de duas cores acesas sobre uma base quase-preta de duas camadas — travada pelo dono do produto; nenhum hex muda sem decisão consciente dele.

### Primary
- **Volt Lime** (#D4FF3F): a cor de AÇÃO — o que a pessoa deve clicar. Botão primário, ícones ativos, estado de hover de cards clicáveis. Usada com moderação deliberada: nunca em texto de corpo, só em elementos que convertem.

### Secondary
- **Circuit Cyan** (#00E5FF): a cor de INTERAÇÃO DO SISTEMA — nunca de ação do usuário. Anel de foco de teclado (`:focus-visible`), ripple da demo de toque, acento do eyebrow badge. Nunca usada em hover de card (isso é papel do lime, desde que o card virou clicável).

### Neutral
- **Deep Ink** (#14170B): texto sobre superfícies lime (botão primário) — não é preto puro, é derivado do verde pra manter a temperatura da cor.
- **Void Black** (#0B0D0F): fundo base da página.
- **Panel Surface** (#16191D): fundo de cards e blocos elevados sobre o void black.
- **Signal White** (#F2F4F5): texto principal.
- **Muted Gray** (#9CA3AF): texto secundário, legendas, texto de apoio.
- **Decorative Border** (#262A2E): borda 1,35:1 — só onde a superfície própria do elemento já separa visualmente (ex. borda entre card e fundo). Nunca como único indicador de "isto é clicável".
- **Meaningful Border** (#6B7280): borda 4,0:1 — quando a borda é a ÚNICA informação de que algo é um controle interativo (ex. `.btn-outline`).

### Named Rules
**The One Action Rule.** Lime é a única cor de ação primária na página inteira. Nunca dividir "clique aqui" entre duas cores diferentes. O H1 é todo em Signal White: acima da dobra, a única massa lime é o botão.

**The Border Role Rule.** Duas bordas existem por design: a decorativa (1,35:1, `--color-border`) nunca carrega significado sozinha; a portadora de significado (4,0:1, `--color-border-strong`) é obrigatória sempre que a borda é o único sinal de interatividade.

## Typography

**Display Font:** Space Grotesk (com fallback sans-serif)
**Headline Font:** Bricolage Grotesque (com fallback sans-serif)
**Accent Font:** Unbounded (com fallback sans-serif)
**Body Font:** Manrope (com fallback sans-serif)

**Character:** Quatro vozes, quatro papéis fixos — nunca dois papéis compartilham a mesma família. Space Grotesk carrega o H1 sozinho (a primeira coisa que a pessoa lê); Bricolage Grotesque carrega todo H2/H3 da página; Unbounded aparece só em números de destaque e no slogan de maior impacto ("Encostou, ativou."); Manrope é a voz neutra do corpo do texto.

### Hierarchy
- **Display** (peso 500, `clamp(2.25rem, 5vw, 3.5rem)`, altura de linha 1.08): só o H1 do Hero.
- **Headline** (peso 500, `clamp(1.75rem, 3.4vw, 2.5rem)`): todo H2 (`.section-title`, `.final-cta__title`, altura de linha 1.1) e H3 (`.compare__column-title`, `.usecase-card__title`, altura de linha 1.25). Nunca herdar o 1.5 do corpo do texto.
- **Accent** (peso 600, `clamp(1.75rem, 4vw, 2.5rem)`): o slogan de destaque "Encostou, ativou." na seção "Como funciona". Reservado pra momentos únicos, não pra hierarquia recorrente.
- **Body** (peso 400/500, 1rem, altura de linha 1.5): texto corrido, medida de linha confortável.
- **Label** (peso 400–500, 0,75–0,95rem): legendas, trust lines, copyright — nunca abaixo de 12px.

### Named Rules
**The One Headline Voice Rule.** Todo H2 e H3 da página usa Bricolage Grotesque — nunca Space Grotesk fora do H1. É o que faz a página inteira parecer desenhada por uma mão só, não uma colagem de seções.

## Layout

O CTA final tem duas colunas a partir de 960px: o convite à esquerda e, à direita, uma prévia neutra da mensagem do WhatsApp (sem resposta simulada) mais 3 passos com marcador ciano. Container centralizado (até 1600px, respiro lateral `clamp(24px, 5vw, 80px)`), seções empilhadas verticalmente (Hero → Como funciona, que é a comparação com o QR code → Casos de uso → Formatos → faixa de confiança → CTA final + rodapé). Em Formatos, os objetos são desenhados em escala real entre si (`--mm` px por milímetro), em papel Signal White com tinta Deep Ink; o lime aparece só no ponto do ícone de toque e nas estrelas. Mobile-first: grid de 1 coluna até ~760/860px, 2–3 colunas acima disso conforme a seção. Navbar fixa no topo (`--nav-height: 72px`), com painel mobile que desliza abaixo dela via `grid-template-rows: 0fr → 1fr` (nunca `display: none` abrupto). Ritmo vertical generoso entre seções (padding-block na casa de 80–120px), mais apertado dentro de cards.

## Elevation & Depth

Dois vocabulários diferentes, não um só — e a diferença é o que cada um significa, não só quando aparece.

**Glow de reação:** existe só em resposta a uma interação (hover/foco). Sistema flat por padrão nesse vocabulário — profundidade aparece só quando o usuário faz alguma coisa, nunca em repouso. É o vocabulário dos componentes interativos (botões).

**Glow ambiente:** presença de fundo sempre acesa, baixa opacidade, nunca reage a nada — é atmosfera "neon sobre preto", não feedback de interação. Existe só nas duas seções mais carregadas de intenção (Hero, CTA final), nunca em componentes menores, e nunca compete com o texto por cima dele (por isso o do CTA final tem blur — ver Shadow Vocabulary). Confirmado como identidade da marca desde o início do projeto (`.impeccable/config.json` documenta as supressões `dark-glow`/`radial-halo` com esse motivo).

### Shadow Vocabulary
- **Ação em resposta** (`filter: drop-shadow(0 8px 14px color-mix(in srgb, var(--color-primary) 38%, transparent))`): só em `.btn-primary:hover`/`:focus-visible`. Offset de 8px pra baixo, seguindo a silhueta da tag — elevação direcional, não halo simétrico.
- **Atmosfera do Hero** (`radial-gradient` com `color-mix(in srgb, var(--color-primary) 14%, transparent)`): `.hero__glow`, canto superior direito, sempre aceso, baixa opacidade.
- **Atmosfera do CTA final** (`opacity: 0.16` + `filter: blur(56px)` sobre a silhueta da tag): `.final-cta__glow`, centralizado atrás do texto. O blur existe especificamente pra não degradar o contraste do texto por cima (era um SVG sólido sem blur antes, e derrubava o subtítulo de 7,7:1 pra 5,2:1).
- **Colapso de menu mobile** (`box-shadow: inset 0 1px 0 var(--color-border)`): substitui uma borda física que não colapsaria com a animação de altura — não é elevação, é um truque de layout disfarçado de sombra.

### Named Rules
**The Flat-At-Rest Rule (componentes).** Nenhum componente interativo tem sombra parada. Se um glow de botão/card aparece, é reação a hover/foco — nunca decoração.

**The Ambient-Glow Rule (seções).** No máximo um glow ambiente por seção, só nas seções de maior intenção (Hero, CTA final), sempre baixa opacidade, nunca competindo com texto por cima sem blur. Não é decoração solta — é a atmosfera "neon sobre preto" que define a marca, e por isso está limitada a duas ocorrências, não espalhada pela página.

## Shapes

Cantos moderados, nunca agudos nem excessivamente arredondados. Botões e inputs em 10px; cards em 16px; badges/pills em 999px (totalmente arredondados); ícones circulares (avatar, número fantasma) em 50%. Bordas finas (1–1,5px) — nunca grossas o suficiente pra virar elemento decorativo por conta própria.

### A silhueta da tag
A forma da logo (corpo reto, ponta em flecha à direita, furo no canto superior esquerdo) é a única forma própria da marca, e é usada como forma de interface, não só como logo. A ponta mede 0,383 × a altura (`--tag-tip-ratio`), a mesma proporção do desenho original. Aparece em três lugares, sempre com papel de marca ou de ação:
- **Botão primário:** a ponta aponta pra ação. O lime é pintado num `::before` recortado por `clip-path`, nunca no botão, pra que o anel de foco não seja cortado.
- **Selo do ícone dos casos de uso:** cada automação mora dentro de uma tag, com tinta lime a 12% e o furo da logo.
- **Marcador de passo da coluna Zap Tag** na comparação com o QR code. O QR code fica com o círculo neutro: a forma da marca só aparece do lado da marca.

Cantos de 4px e 6px existem só no lado reto dessas tags pequenas, proporcionais ao tamanho delas.

## Components

### Buttons
- **Shape:** cantos de 10px (`{rounded.md}`).
- **Primary:** em forma de tag (ver Shapes), fundo Volt Lime, texto Deep Ink, glifo do WhatsApp à esquerda do rótulo, seta diagonal de link externo (12px) à direita e um `.sr-only` "(abre o WhatsApp)", altura 52px. É a única ação de conversão do site — sempre o mesmo componente, nunca uma variação de cor.
- **Hover / Focus:** `transform: scale(1.03)` + `filter: drop-shadow` lime com offset pra baixo, que segue a silhueta da tag (box-shadow desenharia um retângulo). Anel de foco ciano por cima, sempre visível.
- **Outline:** fundo transparente, borda 1,5px em Meaningful Border (nunca Decorative Border — token errado aqui é falha de contraste WCAG 1.4.11), texto Signal White. Vira lime no hover/foco.
- **Compact:** mesma família do primary, padding reduzido (`10px 20px`), usado só na navbar. `min-height: 44px` garantido mesmo compacto.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** Panel Surface sobre Void Black.
- **Shadow Strategy:** nenhuma em repouso (ver Elevation).
- **Border:** 1px Decorative Border em repouso, vira Volt Lime no hover — o card inteiro é clicável, então o lime (ação) é a cor certa, não o ciano.
- **Internal Padding:** `28px 24px`.

### Navigation
- **Style:** navbar fixa, fundo transparente até o scroll passar de 24px (aí ganha fundo + borda inferior). Links em Manrope 500. Estado ativo/hover só muda de cor (Signal White → Volt Lime no hover/foco), sem sublinhado.
- **Mobile:** hambúrguer 44×44px que vira X; painel desliza abaixo da barra via altura animada, nunca `display: none` abrupto — preserva foco e árvore de acessibilidade durante a transição.

### Touch Demo (componente de assinatura)
Mockup de celular com um "adesivo" ao lado — ao "tocar", um ripple ciano se expande e o mockup troca de painel mostrando o caso de uso ativado. É a peça mais distintiva do sistema: transforma o conceito abstrato "NFC" numa animação concreta e legível em 2 segundos. Painéis trocam com fade sequencial (nunca crossfade sobreposto — ver `switchPanel()` em `touch-animation.js`), e o ciclo pausa fora de vista e com a aba oculta. **É interativa:** o celular é um `<button>`. Com mouse, a pessoa arrasta o celular até a tag, a tag reage perto do contato (ciano, resposta do sistema) e o toque dispara ao encostar. No touch, um toque faz o gesto, porque arrastar ali prenderia a rolagem da página. No teclado, Enter/Espaço. A demo automática roda em ciclo contínuo pelos 3 casos (decisão do dono de 22/09), para no primeiro gesto da pessoa e volta sozinha depois de 6s sem gesto; só o gesto da pessoa é anunciado por `aria-live`. **Abaixo de 640px a demo fica deitada** (celular à esquerda, adesivo à direita, ~180px de altura) e o percurso até a tag é horizontal (`translateX` −24 → 14px, espelhado em `TOUCH_DEMO_REST_ROW`/`CONTACT_ROW` no JS). O convite automático só dispara quando o adesivo está 90% visível. Acima de 640px, anéis ciano finos (campo de aproximação) saem do adesivo e acendem no contato. A partir de 1200px a demo fica 1,2x maior, cercada por 3 etiquetas dos casos de uso, e a do caso aberto acende em ciano (resposta do sistema).

## Do's and Don'ts

### Do:
- **Do** usar Volt Lime só em elementos de ação — nunca em texto decorativo ou como cor de destaque genérica.
- **Do** usar Circuit Cyan só pra interação do sistema (foco, ripple) — nunca como segunda cor de ação.
- **Do** manter os 4 papéis tipográficos fixos: Space Grotesk só no H1, Bricolage Grotesque em todo H2/H3, Unbounded só em momentos únicos, Manrope no corpo.
- **Do** manter sombra/glow de componente como reação a hover/foco, nunca em repouso — o glow ambiente de seção é a única exceção, e já está limitado a Hero e CTA final.
- **Do** garantir `min-height: 44px` em qualquer novo alvo de toque pequeno (ícone + texto, link solto).

### Don't:
- **Don't** introduzir uma terceira cor de destaque — o sistema é deliberadamente de duas cores acesas (lime + ciano), cada uma com um papel, não intercambiáveis.
- **Don't** usar Decorative Border (`--color-border`) como único sinal de que um elemento é interativo — é falha de contraste WCAG 1.4.11. Use Meaningful Border (`--color-border-strong`).
- **Don't** adicionar sombra ou glow parado num componente (card, ícone, badge) — isso quebra a regra flat-at-rest. Um novo glow ambiente de seção segue a Ambient-Glow Rule, não essa.
- **Don't** misturar Space Grotesk num H2/H3, nem Bricolage Grotesque no H1 — cada família tem um papel fixo, não é estético trocar.
