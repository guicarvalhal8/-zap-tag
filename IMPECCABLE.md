# Plano Impeccable — Zap Tag

Trabalho de design e qualidade da landing, feito com o skill `impeccable`.
Este arquivo é o ponto de retomada: o que já foi feito, o que falta, quais
comandos usar e quais decisões **não** devem ser reabertas.

Última sessão: **2026-09-22**. O plano original (4 blocos + critique/audit +
document + init) está concluído. Depois disso, uma sessão na máquina pessoal
fez mais trabalho de design (nome fantasia, slogan, Hero interativo, seção
fundida) e uma nova rodada de critique+audit achou P2 novos — ver "Rodada da
máquina pessoal" logo depois de "Depois dos blocos". **Os 4 itens dessa
rodada estão feitos** (Hero mobile, reasseguramento, polish, e o ciclo de
critique+audit fechado de novo — placar em "Placar" no fim do arquivo). Sem
plano de design pendente no momento.
Combinado com o dono: push só depois de um bloco/etapa inteira validada, não
item a item.

---

## ⚠️ Antes de qualquer coisa: abrir na pasta certa

O impeccable está instalado em **`C:\Users\guica\.local\bin\.claude`**, com
escopo de projeto — **não** está dentro de `zap-tag/` nem global em `~`.

Consequência prática: o comando `/impeccable` só existe se o Claude Code for
aberto em `C:\Users\guica\.local\bin`. Abrindo direto em
`C:\Users\guica\.local\bin\zap-tag`, o skill não aparece.

Duas saídas:

1. **Abrir em `.local\bin`** e trabalhar com os caminhos de `zap-tag/` (foi o
   que a sessão de 22/09 fez, funciona bem).
2. **Instalar global**, de uma vez por todas:
   `npx impeccable install` → escolher `[1] Detected only` → location **`global (~)`**.
   Depois disso o skill funciona em qualquer pasta, inclusive no app Giraffas.

O launcher, quando invocado por caminho absoluto, é:

```
"C:/Users/guica/.local/bin/.claude/skills/impeccable/scripts/impeccable" <verbo>
```

---

## Regras de trabalho neste projeto

1. **Não commitar nem dar push sem pedido explícito.** Regra do `CLAUDE.md`, e
   ela vale também para este plano. O banco de dados não existe aqui, mas o
   deploy sim: **o Render só publica no push**, então enquanto não houver push
   o `zap-tag.onrender.com` continua na versão antiga.
2. **Ler `MEMORY.md` antes de mexer.** Várias escolhas que parecem descuido
   têm motivo registrado lá. Distinga decisão consciente de defeito — e quando
   discordar de uma decisão consciente, diga isso em vez de mudar em silêncio.
3. **Refinamento preserva.** Os comandos abaixo mudam estrutura, cor ou
   robustez *dentro* do mundo visual existente. Trocar a identidade é outra
   coisa (`new-work`) e não está no plano.
4. **O craft-floor do skill perde para o mundo visual já comprometido.** Ele
   bane eyebrow acima de heading e desencoraja numeração de seção; os dois
   ficam. A numeração 01/02/03 se justifica porque a sequência *é* a
   informação.
5. **Verificar por medição, não por impressão.** Ver "Protocolo de
   verificação" abaixo. Nenhum achado deste plano foi aceito sem evidência.
6. **Rodar o detector antes de fechar qualquer bloco:**
   `impeccable detect --json index.html` (só markup, nunca passar CSS).
   Hoje ele está **limpo**. Qualquer achado novo significa que algo entrou.

---

## Decisões já tomadas — não perguntar de novo

| Decisão | O que significa |
|---|---|
| **Logo, paleta e identidade visual são intocáveis** | Palavras do dono: "a logo e a paleta de cores e a identidade visual o resto pode alterar". Nenhum hex existente muda. Token **novo** pode ser criado (foi assim que nasceu o `--color-border-strong`). |
| **Preço não vai para a página** | O reasseguramento do CTA final tem que funcionar sem número — nomeando o próximo passo, não publicando valor. |
| **Reveal trava depois da primeira passagem** | A desconstrução ao rolar para cima estava registrada como pedido do dono; ele escolheu travar após a primeira passagem completa de cada seção. Implementar no bloco 3. |
| **O footer pode sair de dentro de `<section>`/`<main>`** | Não foi marcado como intocável. O visual é 100% preservável fora do aninhamento (a continuidade vem só de `border-top` + `padding-block`). |
| **Contraste da paleta está validado** | 24 pares calculados: 24 passam AA, 17 passam AAA. `--color-text-muted` sobre o fundo = 7,67:1; lime como texto = 16,85:1. **Não mexer sem recalcular.** |
| **Escopo aprovado: tudo, inclusive P3** | O dono pediu os 21 achados do audit mais as observações menores da crítica. |

### Supressões do detector (`.impeccable/config.json`, versionado)

| Regra | Escopo | Quem decidiu |
|---|---|---|
| `em-dash-overuse` | global | Dono. Regra calibrada para inglês; em pt-BR travessão é pontuação padrão de aposto. |
| `cramped-padding` | `index.html` | Agente, com evidência: as 3 seções têm `padding-block: 96px`, computed = 96px, e o detector de navegador não reportou nenhuma. O parser estático não resolve a longhand lógica. |
| `overused-font` | `index.html` | Dono. Space Grotesk é a fonte de display da marca. |
| `dark-glow` | `index.html` | Dono. É a atmosfera "neon sobre preto". Nota técnica: tem offset 10px e spread −8px, ou seja elevação direcional, não halo de offset zero. |
| `radial-halo` | `index.html` | Dono. Mesma razão. |

Cada entrada carrega o motivo por escrito no JSON. **Não suprimir nada novo
sem a mesma disciplina** — e `ignore-rule`/`ignore-file` exigem autorização
explícita do dono, `ignore-value` não.

---

## O que já foi feito

### Bloco 1 — concluído em 2026-09-22

**`/impeccable harden`**

- `<noscript>` no `<head>` neutralizando `opacity: 0` de `[data-reveal]`,
  `.usecase-card` e `.compare__slogan`, e escondendo o hambúrguer (sem JS o
  painel nunca abre, então o controle seria morto).
- Os **5 CTAs** saíram de `href="#"` para `https://wa.me/5562982233133`. O
  `?text=` continua sendo montado em JS com `encodeURIComponent` — a regra do
  `CLAUDE.md` de nunca montar link acentuado à mão segue respeitada.
- Os **6 casos de uso saíram do `innerHTML` e foram para o markup**.
  `js/usecases.js` deixou de ser fonte de dados e passou a só ligar
  comportamento. `USECASES_LIST`, `USE_CASES_PRIMARY_COUNT` e
  `renderUseCaseCard` foram removidos. **Para adicionar um 7º caso: copiar um
  `li.usecase-card` no HTML.**
- **Cascata do hambúrguer corrigida.** A media query `min-width: 860px` com
  `display: none` estava *antes* da regra base `display: flex`; media query não
  soma especificidade, então a última ganhava. O `display: none` foi movido
  para a media query que já existia **depois** da regra base.
  `.navbar__nav` ficou onde estava — a regra base dele precede a media query,
  que é exatamente por que a nav funcionava e o toggle não.
- `visibility: hidden` em `.navbar__mobile` e `.usecases__expand-wrap`. O
  truque `grid-template-rows: 0fr` colapsa altura mas **não** tira do foco nem
  da árvore de acessibilidade.
- `Esc` devolve o foco ao hambúrguer.
- Anel de foco próprio: `:focus-visible { outline: 2px solid var(--color-secondary) }`.
  Ciano funciona sobre os dois fundos (12,66:1 no preto, 10,17:1 no lime).
- **`run()` com try/catch por init, em `js/main.js`.** O `<noscript>` só cobre
  JS desligado; o modo de falha histórico deste projeto é outro — `SyntaxError`
  com JS ligado abortando o callback inteiro. Agora cada init é isolado e há
  `revealEverything()` como rede.

**`/impeccable layout`**

- As 3 custom properties (`--how-icon`, `--how-card-h`, `--how-gap-mobile`)
  saíram de `.how__steps` para `.how__steps-wrap`. Elas eram consumidas por
  `.how__track`/`.how__track-fill`, que são **irmãos** da `<ol>` — custom
  property herda para baixo, nunca para o lado.
- Altura da trilha no mobile virou **medição** (`syncHowTrack()` em
  `js/main.js`, no init + resize + `document.fonts.ready`) em vez do número
  mágico de 148px.
- Números 01/02/03 saíram de trás do círculo opaco: no mobile vão para o lado
  (trilha vertical), no desktop para cima (trilha horizontal). Opacidade de
  `0.14` (~1,2:1) para `0.6` (~3,15:1).

**`/impeccable colorize`**

- Token novo `--color-border-strong: #6B7280` (4,0:1). `--color-border`
  continua existindo como borda **decorativa**; o novo é o **portador de
  significado**. Os dois papéis estão comentados no `:root`.
- `.btn-outline`: de 1,35:1 para 4,0:1 (era falha de WCAG 1.4.11 — o fundo é
  transparente, então a borda é a única coisa que diz "isto é clicável").
- `.link-secondary`: sublinhado de 1,35:1 para 7,67:1.
- `.usecase-card:hover` deixou de usar ciano. Regra estabelecida: **lime =
  ação, ciano = interação do sistema** (foco, ripple, acento do eyebrow).
- Os 2 únicos literais de cor do projeto (`rgba(212, 255, 63, …)`) viraram
  `color-mix(in srgb, var(--color-primary) N%, transparent)`.

**Extras da triagem do hook**

- `bounce-easing` corrigido nos 2 pontos: `cubic-bezier(0.34, 1.56, 0.64, 1)`
  → `cubic-bezier(0.22, 1, 0.36, 1)`, que é a ease-out-quint que o próprio
  `css/global.css:464` já usava. Um vocabulário de movimento em vez de dois.
  O keyframe `usecase-icon-pop` **mantém** o pico de `scale(1.15)` a 60% — é
  overshoot autorado, não na curva, e era o efeito pedido.
- `aria-hidden="true"` nos 6 SVGs dos cards (item que era do bloco 4, puxado
  porque aquele markup estava sendo reescrito de qualquer jeito).
- `.gitignore`: `.impeccable/config.json` versionado, resto ignorado.

**Verificado em runtime**

| Medida | Antes | Depois |
|---|---|---|
| `.navbar__toggle` display @1920 | `flex` | `none` |
| `.navbar__nav` display @1920 | `flex` | `flex` (sem dano colateral) |
| `.how__track` `top` | `0px` | `32px` |
| Trilha mobile (distância real 1º→3º ícone) | fórmula dava 376px | medido 395px = real |
| Altura real do passo | assumida 148px | medida 158px |
| Cards no HTML cru | 0 | 6 |
| `href="#"` | 5 | 0 |
| Rede de segurança (elementos escondidos após falha) | — | 23 → 0 |
| Detector | 8 achados | **0** |
| Console | — | limpo |

Prévia publicada: <https://claude.ai/code/artifact/2646ce94-1647-43f3-bed4-68c110916bbb>
(snapshot, não atualiza sozinho)

### Bloco 2, item 1 — concluído em 2026-09-22

**`/impeccable shape`** (brief confirmado pelo dono: card inteiro clicável +
rótulo visível; mensagem nomeia o caso)

- Cada card virou `li.usecases__item > a.usecase-card`. A classe
  `usecase-card` foi para o `<a>`, então reveal, tilt, `<noscript>` e JS
  continuam funcionando sem mudança. O `li` é `display: flex` e o link
  `flex: 1` para os cards da mesma linha terem a mesma altura.
- `href="https://wa.me/5562982233133"` + `target="_blank"` + `data-wa-message`
  próprio: "Olá! Vi o site da Zap Tag e quero o adesivo de {avaliação no
  Google | cardápio digital | Wi-Fi automático | cobrança via Pix |
  fidelidade | ficha de contato}." O `?text=` sai do `initWhatsappLinks()`
  existente — nenhum JS novo.
- Rótulo **"Quero esse →"** (`.usecase-card__cta`) no rodapé, em lime,
  `margin-top: auto`. Nome acessível curto via
  `aria-labelledby="uc-title-N uc-cta-N"` (o leitor de tela diz "Avaliação
  Google Quero esse", não o parágrafo inteiro). **Card novo precisa de ids
  novos.**
- Hover/foco graduaram de `--color-border-strong` para `--color-primary`
  (como previsto). Hover atrás de `@media (hover: hover)`, porque no toque o
  `:hover` gruda e o card ficaria aceso na volta do WhatsApp. No toque, o
  retorno é `:active` lime + `-webkit-tap-highlight-color: transparent` (o
  retângulo azul do Chromium Android saía fora da paleta e sem o raio).
- **Extra, bug antigo achado na verificação:** o menu mobile fechado ocupava
  41px (padding do `.navbar__mobile-inner` + `border-top` do pai não
  colapsam com `0fr`) — toda tela mobile tinha uma faixa vazia sob a barra.
  `.navbar` medida em 114px, agora 73px fechado / 283px aberto. Padding
  vertical virou margem dos filhos; borda virou `box-shadow` inset.

| Medida | Resultado |
|---|---|
| 6 `href` decodificados | as 6 mensagens corretas, acentuação ok |
| Altura dos cards por linha (1440) | 265/265/265 e 244/244/244 |
| Distância do "Quero esse" à base | 29px nos 6 |
| Borda hover (1440) | `#262A2E` → `rgb(212,255,63)` |
| Foco por teclado | `:focus-visible`, anel ciano 2px + borda lime |
| Borda após tap (390, touch) | volta a `#262A2E` (sem hover grudado) |
| `.navbar` mobile fechada | 114px → 73px |
| Detector / console | `[]` / limpo |

---

## O que falta

### Bloco 2 — conversão

1. ~~**`/impeccable shape`**~~ — **feito** (ver acima). Os 6 `.usecase-card` viram `<a>` com
   `data-wa-message` próprio ("…quero o adesivo de **avaliação no Google**…").
   O `initWhatsappLinks()` já resolve `[data-wa-message]` genericamente, então
   é quase de graça. Hoje a seção de maior intenção de compra tem conversão
   estruturalmente zero, e a informação mais valiosa do funil (qual automação
   o lead quer) é gerada e descartada ali.
   *Quando isso entrar, o hover do card pode graduar de `--color-border-strong`
   para `--color-primary` — aí ele vira ação de verdade.*
2. ~~**`/impeccable clarify`**~~ — **feito**, commit `3a6cc9e`. Subtítulo do
   `.final-cta` reescrito (sem "sem mensalidade obrigatória"), nomeando o
   passo real: conversa no WhatsApp → entender o negócio → contrato simples →
   produção do adesivo. "Resposta em poucos minutos" subiu para antes do
   botão. Nova seção `.trust-strip` no lugar do comentário "PRÓXIMAS SEÇÕES",
   entre "Casos de uso" e o CTA final, só com fatos confirmados pelo dono:
   Instagram `@zap_tag_` e "Atendemos Anápolis e região" — **não** Goiânia
   (área correta confirmada em 22/09). Sem foto: o dono não tem foto real do
   adesivo aplicado ainda, só protótipos — não inventada nenhuma imagem nem
   depoimento. Detector `[]` depois da mudança.
3. ~~**`/impeccable harden`**~~ — **feito**, commit `86833c9`. Open Graph
   completo, Twitter card `summary_large_image`, `canonical` e JSON-LD
   `LocalBusiness` (telefone, e-mail, Instagram, área de atendimento
   Anápolis/GO), todos apontando para o domínio provisório
   `https://zap-tag.onrender.com/` (o dono ainda não comprou domínio próprio
   — trocar nos 3 lugares — meta tags, canonical, JSON-LD — quando comprar).
   `assets/og-image.png` (1200×630) gerado do zero, reaproveitando a forma
   exata do ícone da marca (mesmo path SVG do site) — não havia ferramenta de
   conversão de imagem nesta máquina, então a imagem foi desenhada
   programaticamente (System.Drawing/.NET) em vez de derivada do JPG.
   `assets/logo-zaptag.jpg` (317 KB, não referenciado em lugar nenhum) saiu
   de `assets/` para `design-reference/`. Detector `[]`.

### Bloco 3 — motion e performance

4. ~~**`/impeccable animate`**~~ — **feito**, commit `1ad5462`. `initHowSteps`,
   `initCompare`, o grid principal de `initUseCases` e `initFinalCta` travam
   no estado final depois da primeira passagem completa (o timer do último
   item desliga o próprio observer) — se a seção sair de vista no meio da
   sequência, ainda refaz do zero na próxima entrada, como antes.
   `.hero__scroll-hint-line` e `scroll-behavior: smooth` agora só existem sob
   `prefers-reduced-motion: no-preference`. `initHeroReveal()` ganhou o
   branch de reduced-motion que faltava.
5. ~~**`/impeccable optimize`**~~ — **feito**, commit `1ad5462`.
   `initCardTilt()` cacheia o rect no `mouseenter`, escreve o `transform` via
   `requestAnimationFrame` e tira `transform` da `transition` inline enquanto
   o tilt está ativo (a transition de 500ms volta no `mouseleave`, pro
   retorno suave). O loop do Hero (`touch-animation.js`) ganhou um
   `IntersectionObserver` + `visibilitychange`: pausa (sem interromper a
   sequência no meio) quando a demo sai de vista ou a aba vai pra segundo
   plano. O listener `touch-demo:stop` continua sem nada que o dispare — não
   era esse o problema, e não achei nenhum lugar do código que devesse
   dispará-lo.

### Bloco 4 — acabamento e P3

6. ~~**`/impeccable adapt`**~~ — **feito**, commit `6203ecb`. Hambúrguer
   38×38 → 44×44, `.btn-primary--compact` e links do footer com
   `min-height: 44px`, `.navbar__inner` de `height` fixo pra `min-height`.
7. ~~**`/impeccable polish`**~~ — **feito**, commit `6203ecb`.
   `.final-cta__glow` ganhou `filter: blur(56px)` (não degrada mais o
   contraste do subtítulo/botão). Ícone de "Fidelidade" reescalado (`scale`
   0.5/0.55 → 0.6/0.75) pra bater com o peso óptico dos irmãos. Ícone de
   "Pix" trocado — não reusa mais o raio da marca, agora é um check num
   círculo (ecoa "confirma o pagamento" da própria copy). Painéis do Hero
   não cruzam mais em opacidade: `switchPanel()` apaga tudo, espera a
   transition de 320ms, só então acende o próximo. Marca padronizada como
   **"Zap Tag"** em todo o texto visível (era `zaptag`/`Zaptag`/`Zap Tag`
   misturado — dono confirmou essa grafia como oficial em 22/09; identificadores
   internos de código como `compare__column--zaptag` não foram tocados, só
   texto que aparece na página). Pontuação dos 4 H2 padronizada com ponto
   final (seguindo o precedente do H1). Âncora morta `#fale-conosco`
   removida (id sem nada apontando pra ela).
8. ~~**`/impeccable typeset`**~~ — **feito**, commit `6203ecb`. Decisão:
   carregar a Bricolage Grotesque (não remover o token morto) — era o plano
   original documentado no `CLAUDE.md` ("Bricolage Grotesque, H2/H3, ainda
   não carregada"), só nunca tinha sido aplicada. Agora `--font-display-alt`
   está em `.section-title`, `.how__step-title`, `.compare__column-title`,
   `.usecase-card__title` e `.final-cta__title` — as 4 vozes tipográficas
   que o CSS já prometia. `text-wrap: balance` no H1 e nos 3 selectors de H2
   (`.hero__title`, `.section-title`, `.final-cta__title`). Os 2 `font-size`
   em px (`.final-cta__trust`, `.site-footer__copyright`) viraram rem.
9. ~~**`/impeccable harden`**~~ — **feito**, commit `6203ecb`.
   `role="contentinfo"` no `<footer>` (continua aninhado dentro de
   `.final-cta` — decisão do dono preservada, só a semântica de landmark foi
   restaurada). Nova função `svgIcon(markup, label)` em `touch-animation.js`
   injeta `aria-hidden="true"` (decorativo) ou `role="img" aria-label`
   (com label) nos 5 SVGs do arquivo — `TAG_ICON` ganhou o label "Adesivo
   Zap Tag", os outros 4 ficaram decorativos. `role="list"` nas 7 listas
   (5 seletores) com `list-style: none`. `USE_CASES` → `TOUCH_DEMO_CASES` e
   `sleep` → `touchDemoSleep`, sem colisão com nenhum outro arquivo
   (checado). Menu mobile fecha sozinho via `matchMedia('(min-width: 860px)')`
   se a janela crescer além do breakpoint com ele aberto.

**Verificado nos 4 itens:** `node --check` nos 3 JS, checagem de colisão de
nomes no escopo global (nenhuma), detector `impeccable` (`[]`), tags HTML
balanceadas (`section`/`div`/`ul`/`ol`/`li`/`footer`/`header`/`nav`/`svg`/`h2`/`h3`
contados). Sem Playwright nesta máquina — aprovado pelo dono em servidor
local, sem automação de hover/scroll.

### Depois dos blocos

- ~~**`/impeccable critique`** e **`/impeccable audit`** de novo~~ — **feito em
  2026-09-22**, com 3 subagentes isolados (2 do critique — design review +
  detector/evidência — e 1 do audit técnico). Resultado: **Design Health
  27/32** (Bom, 84%), **Audit Health 18/20** (Excelente). Snapshot em
  `.impeccable/critique/2026-09-22T12-52-36Z__index-html.md` (primeira
  execução nesta máquina, sem trend anterior — o snapshot de 22/09 da máquina
  pessoal não foi versionado, `.impeccable/critique/` está no `.gitignore` de
  propósito).
  - Achados do audit (P1 demo do Hero sem controle de pausa, P2 skip-link
    faltando, P2 alvo de toque do Instagram, P3 `role="img"`+`aria-hidden`
    redundante, P3 `#hero-touch-demo` sem `aria-hidden`, P3 `rel` inconsistente)
    — **todos corrigidos**, commit `155bb1c`.
  - Achados do critique — decisões do dono (2026-09-22):
    - **[P1] Reasseguramento sem preço**: aceito. Frase "Sem compromisso —
      você decide depois de saber o valor" no CTA final, commit `314f683`.
    - **[P2] Tipografia (consolidar 4→2 famílias)**: recusado — mantém as 4
      famílias do bloco 4, decisão consciente, não reabrir.
    - **[P2] Reestruturar os 6 casos de uso (Pix escondido)**: recusado por
      agora — decisão do bloco 2 fica, não reabrir sem julgamento de produto
      com calma.
    - **[P3] Ícones Pix/Fidelidade**: não decidido explicitamente, ficou de
      fora deste round.
    - **[P3] Nav pulava `#diferencial`**: aceito (baixo risco, só aditivo) —
      link adicionado, commit `314f683`.
    - **[P3] Canal único de WhatsApp sem fallback**: recusado — proposital,
      documentado no `CLAUDE.md`, não reabrir.
- ~~Considerar **`/impeccable document`**~~ — **feito em 2026-09-22**, commit
  `c886e76`. `DESIGN.md` na raiz + `.impeccable/design.json` (agora
  versionado — `.gitignore` ganhou `!.impeccable/design.json`). North Star
  "The Live Circuit". Documenta as regras que já existiam implícitas no CSS
  (lime = ação, ciano = interação, flat-at-rest, 1 papel fixo por família
  tipográfica) como regras nomeadas.
- ~~**`/impeccable init`**~~ — **feito em 2026-09-22**, commit `8b15bf6`.
  `PRODUCT.md` na raiz: usuário primário (dono do negócio, não o cliente
  final), posicionamento frente ao QR code, preço (~R$60–80/unidade,
  recorrência possível em contrato — ainda sem modelo fechado, nunca vai pra
  página), tecnologia própria (não terceirizada), e 5 princípios de produto
  derivados — o mais citável: "nunca fabricar prova social" e "WhatsApp é o
  único canal de conversão".

### Rodada da máquina pessoal (22/09, à noite) — commits `8f250b7`..`1c9aa2f`

Depois do plano fechado nesta máquina, a sessão da máquina pessoal fez mais
trabalho de design (fora deste plano original, registrado aqui só como
referência — detalhe completo no `MEMORY.md`):

- Nome fantasia "**Zap Tag**" e slogan "**Encostou, ativou.**" definidos.
- "Como funciona" + "Diferencial vs. QR code" fundidas numa seção só.
- Hero virou interativo (arrastar/tocar/teclado no celular da demo).
- Ícone oficial do WhatsApp; silhueta da tag como forma de interface.
- Nova rodada de critique+audit: **22/32** e **16/20** (caiu de 27/32 e
  18/20 — parte é regressão real, parte é revisor mais exigente sem ver a
  nota anterior). Os 3 P1 e os defeitos da demo já foram corrigidos lá.
  Placar detalhado na seção "Placar" no fim deste arquivo.
- **P2 que sobraram**, retomados nesta máquina em 2026-09-22:
  1. ~~Hero mobile (`/impeccable adapt`)~~ — **feito**, commit `20adcac`.
     Demo encolhida abaixo de 640px (telefone 168×300 → 128×228, escala
     ~0,76 em tudo dentro dela); `TOUCH_DEMO_REST`/`CONTACT` do JS não
     mudaram, de propósito. Nome "Zap Tag" sempre visível ao lado do
     hambúrguer (tirado o `display:none` de `.logo__wordmark`). Linha de
     "role pra baixo" só aparece a partir de 960px.
  2. ~~Reasseguramento no CTA final~~ — **feito**, commit `888a5f1`. Horário
     real confirmado: todos os dias, das 7h às 23h. Junta com a área de
     atendimento (antes só na faixa de confiança, longe do botão). Fonte
     subiu de 13px cinza pra ~15px em `--color-text`.
  3. ~~Acabamento (`/impeccable polish`)~~ — **feito**, commit `b00c595`.
     Glow parado: perguntei, dono confirmou intenção consciente — corrigido
     o `DESIGN.md` (nova Ambient-Glow Rule), não o código. `theme-color`
     adicionado. `.link-secondary` e demais alvos de toque em 44px.
     `.touch-demo__panel-idle` em 12px. Ícones de Wi-Fi (era barra de sinal
     de celular) e Pix (era check genérico) trocados por glifos mais
     específicos. `TAG_ICON`/`CHECK_ICON`/`svgIcon` →
     `TOUCH_DEMO_TAG_ICON`/`TOUCH_DEMO_CHECK_ICON`/`touchDemoSvgIcon`.
     `.btn-primary:hover` atrás de `@media (hover: hover)`.
  4. ~~Fechar o ciclo~~ — **feito**, commit `8a87ef3`. Design Health
     recuperou 27/32 (Bom). Audit achou 2 P2 novos e ambos foram corrigidos
     no mesmo commit (piso de 12px reintroduzido, race condition
     demo-automática-vs-gesto-do-usuário) — número oficial só depois de
     rodar de novo, mas os defeitos que geraram o 17/20 não existem mais.
     Detector zerado. Ver "Placar" no fim do arquivo pros números completos.

---

## Protocolo de verificação que funciona aqui

**`resize_window` não funciona neste ambiente.** Foi testado 4 vezes, em
subagentes paralelos e com o Chrome livre: responde "sucesso" e o viewport
continua em 1920. A extensão do Chrome também pode estar desconectada.

**Playwright funciona e é o caminho para mobile** (usado no bloco 2, item 1).
Não precisa instalar: o pacote já está no cache do npx e o Chromium 1234 em
`%LOCALAPPDATA%\ms-playwright`. Num script `.cjs`:
`require("C:/Users/guica/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright")`,
`newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })`.
Cuidado: `locator.screenshot()` de uma seção inteira rola a página, e o
reveal atual se desfaz fora de vista — cards "apagados" na captura não são
bug (até o bloco 3 travar o reveal). Capturar com `page.screenshot()` depois
de posicionar com `scrollTo`.

O que funciona:

```bash
# 1. servidor local (o site é estático, não tem build)
cd zap-tag && python -m http.server 8777 --bind 127.0.0.1

# 2. no navegador: medir estilo COMPUTADO, não julgar por screenshot
#    getComputedStyle(el).<prop> pega o bug que o olho não pega
#    (foi assim que `top: 0px` virou prova do furo de escopo da variável)

# 3. console: read_console_messages só grava a partir da primeira chamada —
#    recarregar a página depois de chamar, senão perde o carregamento

# 4. derrubar o servidor no fim
```

**O `impeccable live-server` NÃO serve os arquivos do projeto.** Ele serve só
o `detect.js` (mesmo corpo em `/` e em `/detect.js`; `/index.html` dá 404).
Para injetar o overlay é preciso um static server próprio numa segunda porta —
e as duas têm que ser `http`, senão o navegador bloqueia por mixed content.

---

## Armadilhas deste repositório

1. **Os 3 JS são scripts clássicos e compartilham escopo global.** Um
   `const`/`function` de mesmo nome em dois arquivos dá `SyntaxError`
   silencioso — invisível no visual, só aparece no console. Já derrubou o site
   **duas vezes**. `USE_CASES`/`sleep` foram renomeados pra
   `TOUCH_DEMO_CASES`/`touchDemoSleep` no bloco 4, item 9 — mas `TAG_ICON`,
   `CHECK_ICON` e `svgIcon` em `touch-animation.js` continuam sem prefixo
   (P3 pendente da rodada da máquina pessoal). Verificar com:
   `for f in js/*.js; do grep -hoE '^(const|let|var|function) [A-Za-z_$]+' "$f" | awk '{print $2}'; done | sort | uniq -d`
2. **`[data-reveal]` nasce em `opacity: 0`.** Qualquer coisa nova que use esse
   atributo depende de JS para aparecer. O `<noscript>` e o `run()` cobrem,
   mas não desfazem a arquitetura: o JS ainda revela conteúdo que já existe.
3. **Custom property herda para baixo, nunca para o lado.** Foi o bug da
   trilha. Ao declarar variável para um irmão usar, declare no **ancestral
   comum**.
4. **Não passar CSS para o `detect`** — só markup.
5. **O repo é CRLF.** Arquivo reescrito inteiro sai LF e o git avisa que vai
   normalizar. Não é problema, mas infla o diff.

---

## Placar

| Eixo | Antes do bloco 1 | Depois dos 4 blocos | Depois do `f61f861` | Round 3 (22/09, trabalho) | Meta |
|---|---|---|---|---|---|
| Design Health (Nielsen, heurísticas 7 e 10 = n/a) | 17/32 | 27/32 | 22/32 (Aceitável) | **27/32** (Bom) ✅ | ≥ 24/32 |
| Audit Health (5 dimensões) | 14/20 | 18/20 | 16/20 (Bom) | **17/20** (Bom) | ≥ 18/20 |
| Detector (`detect --json index.html`) | 8 achados | 0 reais | 0 reais (3 advisory) | **0** (0 advisory) ✅ | 0 |

- **"Depois dos 4 blocos":** critique + audit rodados no PC do trabalho em
  2026-09-22. O snapshot não foi versionado.
- **"Depois do `f61f861`":** rodada seguinte, na máquina pessoal
  (`.impeccable/critique/2026-09-22T15-28-49Z__index-html.md`). Esse revisor
  não viu a nota anterior e foi mais exigente, então a queda não é
  comparação exata. Mas os defeitos que ele apontou foram medidos e eram
  reais. Corrigidos no mesmo dia (P1 da crítica + defeitos da demo).
- **Round 3 (22/09, computador do trabalho):** depois do Hero mobile,
  reasseguramento e polish (ver "Rodada da máquina pessoal" acima), rodei
  `critique`+`audit` de novo com os 3 subagentes isolados de sempre. Design
  Health recuperou o placar do round 1 (27/32). Audit achou 2 P2 novos
  (piso de 12px reintroduzido num seletor irmão; race condition entre a
  demo automática e um gesto do usuário) — **os dois já foram corrigidos**
  no mesmo commit, então o número real hoje é mais alto que 17/20, mas o
  placar só é oficial depois de rodar de novo. Detector zerado (inclusive
  os 3 advisory de antes, suprimidos com justificativa em
  `.impeccable/config.json`). Snapshot em
  `.impeccable/critique/2026-09-22T18-05-45Z__index-html.md`.
- **Detector:** passar só o markup. Passar o CSS direto inflava a contagem
  pra dezenas de avisos advisory (aconteceu de novo nesta sessão, por
  engano de verificação — não é bug do código).
