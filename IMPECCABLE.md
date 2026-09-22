# Plano Impeccable — Zap Tag

Trabalho de design e qualidade da landing, feito com o skill `impeccable`.
Este arquivo é o ponto de retomada: o que já foi feito, o que falta, quais
comandos usar e quais decisões **não** devem ser reabertas.

Última sessão: **2026-09-22**. Bloco 1 concluído. Bloco 2: itens 1 e 2 feitos,
item 3 pendente. Blocos 3 e 4 pendentes.

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
3. **`/impeccable harden`** — Open Graph completo, Twitter card, `canonical`,
   JSON-LD `LocalBusiness`, e `og:image` 1200×630 absoluta. Hoje são **zero**
   tags sociais numa landing cujo único canal é WhatsApp, ou seja feita para
   ser colada em chat. Aproveitar o `assets/logo-zaptag.jpg` (317 KB,
   versionado e **não referenciado em lugar nenhum**) como base, e tirá-lo do
   diretório servido.

### Bloco 3 — motion e performance

4. **`/impeccable animate`** — travar o reveal depois da primeira passagem
   completa (decisão do dono); cobrir `.hero__scroll-hint-line` (única
   animação `infinite` do CSS e a única fora do bloco de reduced-motion) e
   `scroll-behavior: smooth` (gatilho vestibular mais forte da página); dar
   branch de reduced-motion ao `initHeroReveal()`, o único dos 6 inits que não
   consulta a preferência.
5. **`/impeccable optimize`** — `initCardTilt()` (`js/usecases.js:67-83`) lê
   `getBoundingClientRect()` e escreve `style.transform` no mesmo handler de
   `mousemove`, sem `rAF`; e `.usecase-card` tem `transition: transform 500ms`,
   então o tilt que deveria seguir o cursor chega meio segundo atrasado.
   Cachear o rect em `mouseenter`, escrever em `rAF`, tirar `transform` da
   transition. Também: ligar o listener `touch-demo:stop`
   (`js/touch-animation.js:92`) que **nunca é disparado por nenhum arquivo** —
   o loop do Hero roda para sempre, sem gate de visibilidade.

### Bloco 4 — acabamento e P3

6. **`/impeccable adapt`** — hambúrguer 38×38 → 44×44, links do footer (~20px
   de altura, e são os 3 contatos do negócio) → ~44px, `.btn-primary--compact`
   → 44px, `min-height` no lugar de `height` na navbar. *Nenhum é falha de
   WCAG AA* (2.5.8 pede 24×24 e a exceção de espaçamento cobre) — é o
   guideline prático de 44×44.
7. **`/impeccable polish`** — `.final-cta__glow` (SVG sólido a `opacity: 0.16`
   **sem blur e sem gradiente**; degrada o subtítulo de 7,7:1 para 5,2:1 e o
   botão de 16,9:1 para 11,3:1); ícone de "Fidelidade" com ~45% do tamanho
   óptico dos irmãos; raio da marca reciclado para significar "Pix"; a
   sobreposição de 320ms dos painéis do Hero (`showPanel()` liga e desliga no
   mesmo tick); as 3 grafias da marca (`zaptag` / `Zaptag` / `Zap Tag`);
   pontuação inconsistente dos H2; âncora morta `#fale-conosco`.
8. **`/impeccable typeset`** — decidir `--font-display-alt` (Bricolage
   Grotesque: carregar e aplicar nos H2/H3, ou remover o token morto — hoje o
   arquivo promete 4 vozes tipográficas e a página entrega 1 de display, que é
   por que a hierarquia depende só de tamanho e cor); `text-wrap: balance` nos
   4 títulos (3 dos 4 H2 têm viúva, e no H1 o artigo "A" fica órfão exatamente
   onde a cor de acento começa); os 2 `font-size` em px absoluto.
9. **`/impeccable harden`** — landmark `contentinfo` (tirar o `<footer>` de
   dentro de `<main>`/`<section>`, ou `role="contentinfo"` explícito);
   `aria-hidden` nos 5 SVGs ainda gerados por `touch-animation.js` — de
   preferência com uma função `svgIcon()` que injete o atributo, porque o
   padrão sistêmico é a disciplina evaporar quando o HTML vira string em JS;
   `role="list"` nas 5 listas com `list-style: none` (nos dois `<ol>` o Safari
   perde a semântica **e** os números do `counter()`); renomear `USE_CASES` →
   `TOUCH_DEMO_CASES` e `sleep` → `touchDemoSleep`; fechar o menu ao cruzar o
   breakpoint de 860px.

### Depois dos blocos

- **`/impeccable critique`** e **`/impeccable audit`** de novo, para comparar
  o placar. O snapshot anterior está em `.impeccable/critique/` e o comando lê
  a tendência sozinho.
- Considerar **`/impeccable document`** para gerar o `DESIGN.md`, que não
  existe. O projeto tem sistema de tokens real e merece o registro.
- **`/impeccable init`** nunca foi rodado aqui — não há `PRODUCT.md`. Não
  bloqueia comandos escopados, mas seria útil antes de qualquer superfície
  nova. Faltam decisões de produto de verdade: preço, como funciona a venda,
  slogan de marca.

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
   **duas vezes**. Hoje não há colisão, mas `USE_CASES` e `sleep` continuam
   sem prefixo (bloco 4, item 9). Verificar com:
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

| Eixo | Antes do bloco 1 | Meta |
|---|---|---|
| Design Health (Nielsen, heurísticas 7 e 10 = n/a) | **17/32** | ≥ 24/32 |
| Audit Health (5 dimensões) | **14/20** | ≥ 18/20 |
| Detector | 8 achados | **0** ✅ |

As duas notas ainda **não** foram recalculadas — o bloco 1 corrigiu defeitos
que pesam em Error Recovery (1), Error Prevention (2), Visibility of System
Status (2) e Acessibilidade (2), mas o `critique` e o `audit` precisam rodar
de novo para o número mudar. Vale fazer isso depois do bloco 2, não agora:
os dois comandos são caros e o bloco 2 mexe em conversão, que é justamente o
que puxa as notas para baixo.
