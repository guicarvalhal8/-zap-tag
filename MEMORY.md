# Memória do projeto Zap Tag

> Histórico vivo. Atualizar sempre que algo relevante mudar — decisão de
> design, dado novo sobre a empresa, direção que o usuário pediu pra mudar.
> Ler este arquivo inteiro antes de continuar o trabalho.

## Sobre a empresa (o que sabemos até agora)

- **Nome:** Zap Tag
- **Produto:** Adesivos NFC (etiqueta com chip de aproximação) que disparam
  automações ao encostar o celular — sem precisar instalar app.
- **Casos de uso confirmados:**
  - Abrir a tela de avaliação do Google (Google Reviews) — foco em gerar mais
    avaliações 5 estrelas pro estabelecimento.
  - Abrir cardápio digital.
  - Automação de cobrança via Pix.
  - "Automações no geral" (categoria aberta — outros gatilhos possíveis além
    dos três acima).
- **Público-alvo:** ainda não definido explicitamente, mas o perfil dos casos
  de uso (avaliação Google, cardápio, Pix) aponta pra comércio local —
  restaurantes, bares, salões, pequenos negócios com atendimento presencial.

### Identidade visual (definida)

- **Logo:** `assets/logo-zaptag.jpg` — ícone de etiqueta (tag) preenchido em
  verde-limão neon com um raio vazado em preto no meio, fundo preto.
  Referência visual clara: "tag" (produto = adesivo/etiqueta) + "raio"
  (ação instantânea do NFC, o nome "Zap").
- **Paleta sugerida a partir da logo:**
  - Verde-limão neon (cor principal/destaque): aprox. `#D6FF3B` (ajustar o
    tom exato quando for extrair da logo pra CSS).
  - Preto (`#0a0a0a` / `#000`) como fundo/base — a marca tem cara de tema
    escuro, diferente do s7-erp-landing (que é fundo claro).
- **Tom visual:** moderno, tech, alto contraste, "neon sobre preto" — bem
  diferente do verde mais corporativo do s7-erp-landing. Não copiar o
  layout claro do S7 ERP; este site provavelmente deve ser dark mode por
  padrão.

### Ainda não definido (perguntar quando for relevante)

- Tipografia.
- ~~Nome fantasia / slogan~~ — definidos em 2026-09-22 (ver entradas abaixo).
- CNPJ: ainda não aberto. Quando abrir, conferir se vale pôr CNPJ no rodapé.
- Preço, planos, como funciona a venda (loja online? sob encomenda?).
- Diferencial frente a concorrentes (QR code é a alternativa óbvia — por que
  NFC é melhor?).
- Contato oficial (WhatsApp, telefone, e-mail) pra usar nos CTAs do site.
- Tem alguma empresa/plataforma dona da tecnologia por trás (ex: parceria com
  alguma SN Sistemas, ou é independente)?

## Estado do projeto

- **2026-09-18** — Pasta criada (`C:\Users\Guilherme\projects\zap-tag`), ainda
  vazia de código. Criados `CLAUDE.md` (instruções de trabalho) e este
  `MEMORY.md`. Nenhuma linha de site escrita ainda. Repositório git **não**
  inicializado ainda.
- **2026-09-18** — Logo recebida e salva em `assets/logo-zaptag.jpg`: tag
  verde-limão neon com raio preto vazado, fundo preto. Definiu a paleta e o
  tom visual (dark mode, alto contraste) — ver seção "Identidade visual"
  acima.

## Decisões tomadas

- Seguir o mesmo padrão técnico do `s7-erp-landing` (HTML único + Tailwind
  CDN + GSAP + Lucide, pt-BR, mobile-first, CTA via WhatsApp) até o usuário
  pedir diferente.
- Trabalhar seção por seção, com aprovação visual do usuário antes de cada
  commit — mesmo fluxo que funcionou bem no s7-erp-landing.

- **2026-09-18** — Hero construído a partir de um prompt de spec detalhado do
  usuário (paleta, fontes e diretrizes de copy/motion). Stack escolhida:
  **sem Tailwind** desta vez — HTML semântico + `css/global.css` com as
  variáveis de design (cores/fontes) + JS puro em módulos ES (`js/main.js`,
  `js/touch-animation.js`), sem build step, mesma filosofia "zero-build" do
  s7-erp-landing mas com CSS próprio em vez de utilitário.
  - Fontes carregadas por enquanto: só Space Grotesk (500) e Manrope
    (400/500), que é o que o Hero usa. Bricolage Grotesque e Unbounded
    **ainda não estão no `<link>` do Google Fonts** — adicionar quando as
    seções que as usam (H2/H3 e estatísticas) forem construídas.
  - Logo recriada como SVG inline (mask com corte do círculo + raio) em
    `index.html` (navbar) e `js/touch-animation.js` (ícone da tag na
    animação) — é uma recriação à mão da logo em `assets/logo-zaptag.jpg`,
    não é o arquivo vetorial original. Se o usuário tiver o SVG de verdade
    do designer, substituir e simplificar.
  - Animação de toque: componente `initTouchAnimation()` — celular desce,
    dispara um "ripple" em `--color-secondary` via Web Animations API, tela
    do celular alterna entre 3 casos de uso (avaliação Google, cardápio,
    Wi-Fi) em loop. Respeita `prefers-reduced-motion`.
  - **Pendência importante:** número de WhatsApp do botão "Falar no
    WhatsApp" está com placeholder (`5500000000000`) em `js/main.js` —
    **trocar pelo número real antes de publicar o site**.
  - Repositório git ainda não inicializado.
- **2026-09-18** — Corrigido bug: `js/main.js` estava carregado como
  `<script type="module">`, e módulos ES são bloqueados por CORS quando o
  HTML é aberto direto como `file://` (funciona só com servidor HTTP). Isso
  fazia a página inteira ficar em branco (só a navbar aparecia), porque o JS
  nunca rodava pra tirar os elementos `[data-reveal]` do `opacity:0`.
  **Correção:** tirado `import`/`export`, os dois arquivos agora são
  `<script>` normais (`touch-animation.js` antes de `main.js`, sem `type`).
  Lição: **não usar ES modules neste projeto** — o fluxo de trabalho é abrir
  o HTML direto no navegador, sem servidor, igual o s7-erp-landing.

- **2026-09-18** — Seção "Como funciona" construída a partir de outro prompt
  de spec do usuário (3ª seção da página: Hero → Como funciona → Casos de
  uso → CTA final — prova social ficou de fora por enquanto).
  - `<ol class="how__steps">` com os 3 passos (Encoste / Ação dispara /
    Resultado automático), cada `<li>` com número grande fantasma atrás do
    ícone (`--font-display-highlight`/Unbounded, primeira vez que essa fonte
    é usada — adicionada ao `<link>` do Google Fonts), ícone num badge
    circular, título e descrição de 1 linha.
  - Trilha conectora: `.how__track` (linha base) + `.how__track-fill`
    (preenchimento em `--color-primary`) — horizontal no desktop (grid de 3
    colunas, matemática por porcentagem: ícone centralizado em 1/6 e 5/6 da
    largura), vertical no mobile (linha centralizada, com altura calculada
    via `calc()` a partir de `--how-card-h`/`--how-gap-mobile`).
    **Limitação conhecida:** a trilha mobile assume que os 3 passos têm
    altura igual (`min-height: var(--how-card-h)`, hoje 148px). Se um título
    ou descrição um dia quebrar em 2 linhas num celular muito estreito, a
    trilha pode desalinhar levemente do 3º ícone — não é um cálculo dinâmico
    via JS, é aproximação por CSS. Se isso incomodar visualmente, o próximo
    passo seria medir via `getBoundingClientRect()` em vez de `calc()`.
  - Preenchimento da trilha e entrada dos passos disparados por
    `IntersectionObserver` (`initHowSteps()` em `js/main.js`), com stagger de
    180ms, uma vez só (observer desconecta depois do primeiro trigger).
    Respeita `prefers-reduced-motion`.
  - Ícone do passo 1 (Encoste) é um glyph novo e simples (celular + raio),
    não é a animação completa do Hero — como pedido explicitamente no
    prompt ("não repetir a animação de toque aqui").
  - Ícone do passo 2 reaproveita a mesma técnica de mask SVG da logo (com id
    `zt-cutout-how`, único no documento).

- **2026-09-18** — Ajustada a velocidade da trilha da seção "Como funciona"
  a pedido do usuário: transição do `.how__track-fill` foi de 500ms pra
  900ms (só isso — o stagger de entrada dos passos continua 180ms, que é
  outra coisa e não foi pedido pra mudar).
- **2026-09-18** — Seção "Casos de uso" construída (4ª seção: Hero → Como
  funciona → Casos de uso → CTA final).
  - **Refatoração pequena antes de começar:** `.how__header`/`.how__title`
    viraram `.section-header`/`.section-title` (classes genéricas), já que
    esta seção usa exatamente o mesmo padrão de cabeçalho. Sem mudança
    visual, só reuso.
  - Dados centralizados em `js/usecases.js`: array `USE_CASES` (6 itens
    hoje) + `USE_CASES_PRIMARY_COUNT = 3`. Os 3 primeiros do array sempre
    aparecem no grid principal; o resto cai automaticamente no grid
    expansível — **adicionar um 7º caso de uso é só acrescentar um objeto
    no array**, layout/lógica não mudam.
  - Expand/collapse sem `display:none` abrupto: usa o truque de
    `grid-template-rows: 0fr → 1fr` com `transition`, que anima a altura de
    forma suave (`.usecases__expand-wrap` / `.usecases__expand-inner`).
  - Botão de toggle é um novo `.btn-outline` (borda, sem preenchimento) —
    diferente do link sublinhado do Hero; o prompt pedia "botão outline"
    mas também citava o CTA secundário do Hero como referência, e os dois
    não são visualmente iguais. Resolvi a favor do "outline" explícito.
    `aria-expanded`/`aria-controls` implementados.
  - Ícones novos em `js/usecases.js`: raio (Pix, reaproveitando o motivo da
    logo), duas estrelas sobrepostas via `<use>` (Fidelidade), cartão de
    contato com avatar (Ficha de contato/vCard). Review/Cardápio/Wi-Fi
    reaproveitam os mesmos SVGs simples já usados no Hero/Como funciona.

- **2026-09-18** — Corrigidos dois bugs na seção "Casos de uso" (reportados
  pelo usuário como "última seção bugada", só o botão "Ver todas as opções"
  aparecia):
  1. **Colisão de nomes entre scripts.** `touch-animation.js` e
     `usecases.js` declaravam os dois um `const USE_CASES` no topo do
     arquivo. Como os scripts são clássicos (sem module, ver decisão
     acima) e por isso compartilham o mesmo escopo global, a segunda
     declaração dava `SyntaxError: Identifier 'USE_CASES' has already been
     declared` — isso impedia o `usecases.js` inteiro de rodar (nenhuma
     função dele existia), e a chamada `initUseCases()` no `main.js`
     quebrava com `ReferenceError`, silenciosamente, sem nada no visual
     indicando a causa. Corrigido renomeando pra `USECASES_LIST` em
     `usecases.js`.
  2. O cabeçalho da seção (eyebrow + H2) nunca tinha lógica pra ganhar
     `is-visible` — só os cards tinham. Corrigido: `initUseCases()` agora
     também revela `.section-header [data-reveal]` dentro do `revealPrimary()`.
  - **Lição registrada em CLAUDE.md:** como todo JS aqui é script clássico
    (sem module), nomes de `const`/`function` no nível raiz de QUALQUER
    arquivo `js/*.js` colidem entre si silenciosamente (erro só aparece no
    console do navegador, nunca no visual). Prefixar constantes de dados
    por arquivo/seção (ex: `USECASES_LIST`, não `USE_CASES` genérico) pra
    evitar isso ao adicionar novos arquivos.

- **2026-09-18** — Usuário achou a seção "Casos de uso" simples demais;
  pediu mais animação E descrição mais detalhada (as duas coisas).
  - Descrições viraram parágrafos curtos (2-3 linhas) em vez de 1 linha só,
    pra cada um dos 6 casos.
  - Ícone ganhou entrada própria (`usecase-icon-pop`: scale+rotate com leve
    overshoot) mais um glow radial atrás dele (`usecase-icon-glow`) — os
    dois disparam 150ms depois do card começar a aparecer, reforçando a
    sensação de "o toque ativou algo", não só um fade genérico.
  - Hover ganhou tilt 3D sutil que segue o cursor (`initCardTilt()` em
    `js/usecases.js`, via `perspective()/rotateX()/rotateY()` em JS, máx.
    ~7°) — é só progressive enhancement: o hover simples em CSS
    (`translateY(-3px)` + borda ciano) continua sendo a base/fallback pra
    touch e pra quem usa `prefers-reduced-motion` (o tilt via JS só é
    ligado quando `!reducedMotion`).

- **2026-09-18** — Seção "CTA final" + footer construída (5ª e última
  seção do fluxo: Hero → Como funciona → Casos de uso → CTA final). O site
  agora tem as 4 seções completas de ponta a ponta.
  - `<footer>` fica ANINHADO dentro de `<section class="final-cta">`
    (pedido explícito do prompt — "parte da mesma seção, não um bloco
    separado"), não é o footer solto de sempre.
  - Ícone da logo em tamanho grande (520px) e opacidade baixa (16%) como
    plano de fundo decorativo atrás do bloco de CTA — fecha o ciclo visual
    que abriu no Hero. **Sem parallax**: o prompt condicionava isso a "só
    se o resto da página já usa parallax em algum lugar" — não usa, então
    não adicionei.
  - CTA principal repete texto e estilo do Hero ("Falar no WhatsApp",
    mesma classe `.btn-primary`), como pedido — nenhuma seção varia a ação
    principal.
  - Placeholder comment "PRÓXIMAS SEÇÕES" foi reposicionado pra ANTES do
    CTA final (não depois) — é onde entraria uma futura seção de "prova
    social", já que o footer precisa continuar sendo a última coisa da
    página.
  - **Pendências novas (placeholders, iguais ao padrão do número de
    WhatsApp):** link do Instagram (`instagram.com/zaptag`) e e-mail
    (`contato@zaptag.com.br`) no footer são placeholders com comentário
    `TODO` no HTML — **trocar pelos reais antes de publicar**, junto com o
    número de WhatsApp (ver pendência anterior).

- **2026-09-18** — Usuário pediu pra animação "desconstruir" quando o
  usuário volta rolando a página (scroll pra cima). Antes, cada seção usava
  `observer.disconnect()` depois do primeiro trigger — animava só uma vez
  e nunca mais. Trocado em `initHowSteps()`, `initUseCases()` (cards do
  grid principal) e `initFinalCta()`: o observer continua ativo e agora
  alterna com base em `entry.isIntersecting` — soma `is-visible` ao
  entrar, remove ao sair (pra cima ou pra baixo), então a sequência toda
  roda de novo do zero na próxima vez que a seção entra na tela. Na "Como
  funciona" isso inclui resetar `--how-fill` pra 0 e cancelar os
  `setTimeout` pendentes do stagger se a seção sair da tela no meio da
  animação (`clearTimers()`), pra não sobrepor sequências.
  - **Ficou de fora de propósito:** o Hero (anima só uma vez no load, não
    é scroll-triggered, então não tem o que "desconstruir") e o estado
    aberto/fechado do grid expansível de "Casos de uso" (continua
    controlado só pelo clique no botão — sair de vista não fecha ele de
    novo, isso seria um comportamento estranho/inesperado).

- **2026-09-18** — Adicionada navegação na navbar.
  - Desktop (≥860px): links "Como funciona" / "Casos de uso" (âncora pras
    seções) + um botão compacto "Falar no WhatsApp" (`.btn-primary--compact`,
    mesma cor/estilo do CTA, só menor) direto na navbar.
  - Mobile: os mesmos links + CTA ficam num menu que desliza abaixo da
    navbar (hambúrguer que vira X), com o mesmo truque de
    `grid-template-rows` usado no expand de "Casos de uso" — sem
    `display:none` abrupto. Fecha ao clicar num link, ao apertar Esc, ou ao
    clicar de novo no botão.
  - **Refatoração:** `height`/`display:flex` que estavam em `.navbar`
    foram movidos pra `.navbar__inner`, porque `.navbar` agora precisa
    crescer pra caber o painel mobile abaixo da barra de 72px. Sem mudança
    visual no estado fechado/desktop.
  - Os dois novos botões de WhatsApp (desktop compacto + mobile) usam o
    mesmo `data-wa-message`/`initWhatsappLinks()` de sempre — nenhum JS
    novo pra isso, só mais elementos com o atributo.

- **2026-09-18** — Repositório git criado e enviado pro GitHub:
  `https://github.com/guicarvalhal8/-zap-tag` (reparar no `-` antes de
  "zap-tag" no nome — foi assim que o usuário criou, mesma conta do
  s7-erp-landing mas repo separado). Branch `main`, primeiro commit com
  as 5 seções completas.

- **2026-09-21** — Número real de WhatsApp definido: `5562982233133` (DDD 62
  + 9 dígitos, formato internacional com `55` na frente pro `wa.me`).
  Substituído o placeholder `5500000000000` em `WHATSAPP_NUMBER`
  (`js/main.js`), removido o comentário `TODO` que estava acima da
  constante.

- **2026-09-21** — Nova seção "Diferencial vs. QR code" construída a partir
  de um prompt de spec detalhado do usuário, posicionada entre "Como
  funciona" e "Casos de uso" (fluxo agora: Hero → Como funciona →
  Diferencial vs. QR code → Casos de uso → CTA final + footer).
  - Objetivo: neutralizar a objeção "por que não um QR code, que é de
    graça?" mostrando a diferença de fricção de forma visual (quantidade
    de passos), não só argumentativa. Tom popular/acessível — sem jargão
    tipo "NFC"/"IoT" na copy visível.
  - `.compare__columns`: duas colunas (`<ol class="compare__steps">`,
    numeração via `counter()` em CSS, não JS) — QR code com 4 passos em
    tom `--color-text-muted`, Zaptag com 2 passos em `--color-primary`.
    Nenhum truque de altura: a coluna Zaptag só tem menos itens, então
    termina antes visualmente por conta própria (`align-items: start` no
    grid do desktop).
  - Ícone por coluna (não por passo): câmera/foco pra QR (SVG novo), ícone
    de toque pra Zaptag — reaproveitado o exato mesmo SVG do passo 1
    ("Encoste") da seção "Como funciona", reforçando consistência visual
    entre as duas seções vizinhas.
  - Slogan de destaque "Encostou, ativou." em `--font-display-highlight`
    (Unbounded 600, já carregada) — única vez que essa fonte aparece fora
    dos números fantasma de "Como funciona". Entrada com scale-in próprio
    (0.95 → 1), não reaproveita o `[data-reveal]` genérico (que é
    fade+translateY) porque o motion pedido era diferente.
  - Três diferenciais técnicos discretos (`--color-text-muted`, ver
    `.compare__facts`) reaproveitando o texto puro (sem contradizer o
    slogan/comparação, aparecem por último, depois do slogan).
  - Motion (`initCompare()` em `js/main.js`, mesmo padrão de
    `initHowSteps`/`initUseCases`: `IntersectionObserver` com
    `isIntersecting` pra desconstruir/reconstruir ao rolar pra cima):
    coluna QR com stagger de 180ms entre passos, coluna Zaptag com 90ms —
    a diferença de ritmo reforça a diferença de "espera" mesmo antes da
    pessoa ler o texto. Slogan aparece 550ms depois do início da
    sequência, os três diferenciais 720ms depois — dá tempo das colunas
    "terminarem" antes.
  - Sem CTA na seção (era um requisito explícito do prompt — é resolução
    de objeção, não ponto de conversão).

- **2026-09-21** — E-mail real de contato definido: `usezaptag@gmail.com`.
  Substituído o placeholder `contato@zaptag.com.br` no footer
  (`index.html`), removido o comentário `TODO` que estava acima do link.

- **2026-09-21** — Instagram real confirmado: `@zap_tag_`
  (`instagram.com/zap_tag_`). Substituído o placeholder
  `instagram.com/zaptag` no footer (`index.html`), removido o comentário
  `TODO` que estava acima do link. Com isso, os três contatos do footer
  (WhatsApp, e-mail, Instagram) estão todos com dados reais.

- **2026-09-22** — Passada de qualidade com o skill `impeccable`: um
  `/impeccable critique` + `/impeccable audit` completos (dois subagentes
  isolados para o critique, mais um terceiro para a auditoria técnica), e
  depois o primeiro bloco de correções aplicado. **O plano inteiro, o que foi
  feito e o que falta, está em `IMPECCABLE.md` na raiz** — este parágrafo é só
  o resumo.
  - Notas de partida: **17/32** no Design Health (Nielsen, heurísticas 7 e 10
    como n/a) e **14/20** no Audit Health. Detector saiu de 8 achados para
    **0**.
  - Três bugs reais confirmados por medição, não por impressão: o
    **hambúrguer estava visível e morto no desktop** (a media query que o
    escondia vinha *antes* da regra base, e media query não soma
    especificidade); a **trilha de "Como funciona" passava 32px acima dos
    ícones**, porque as custom properties eram declaradas na `.how__steps` e
    consumidas pelos irmãos dela — custom property herda para baixo, nunca
    para o lado; e a **altura da trilha no mobile errava por ~20px**, porque o
    `--how-card-h: 148px` era um número estimado e o passo mede 158px.
  - O achado mais caro era de arquitetura: a página **construía** com JS o que
    deveria só realçar. 19 nós em `opacity: 0`, os 6 casos de uso só em
    `innerHTML`, e os 5 CTAs saindo do HTML com `href="#"`. Os 6 cards foram
    para o markup, os CTAs ganharam URL real (o `?text=` segue montado em JS),
    entrou um `<noscript>`, e cada init passou a rodar isolado com try/catch —
    essa última parte é o que cobre a quebra histórica por colisão de nome no
    escopo global, que o `<noscript>` sozinho **não** cobria.
  - Acessibilidade: `--color-border` acumulava três papéis e dois deles eram
    falha de WCAG 1.4.11 (o `.btn-outline` e o sublinhado do `.link-secondary`
    ficavam em 1,35:1). Nasceu o token `--color-border-strong`. Nenhum hex
    existente foi alterado — a paleta é intocável por decisão do Leandro.
  - Boa notícia medida: a paleta neon-sobre-preto **passa AA em 24 de 24
    pares** e AAA em 17. A hipótese de que o contraste seria o ponto fraco
    estava errada.
  - O maior buraco é de produto, não de código: a página vende um objeto
    físico e **nunca mostra o objeto**, não tem preço nem prova social, e os 6
    casos de uso não levam a lugar nenhum. É o bloco 2.

- **2026-09-22** — Bloco 2, item 1 do `IMPECCABLE.md` feito: os 6 cards de
  "Casos de uso" viraram links de WhatsApp (card inteiro clicável + rótulo
  "Quero esse →"), cada um com mensagem que já nomeia a automação ("…quero o
  adesivo de avaliação no Google."). Para um 7º card: copiar um
  `li.usecases__item` e trocar `data-wa-message` e os ids
  `uc-title-N`/`uc-cta-N`. De brinde, corrigida uma faixa vazia de 41px sob a
  navbar em toda tela mobile (menu fechado não colapsava o padding). Detalhes
  e medições no `IMPECCABLE.md`. **Não commitado.**

- **2026-09-22** — Bloco 2, item 2 do `IMPECCABLE.md` feito, commit `3a6cc9e`:
  reasseguramento do CTA final + prova social real. Subtítulo do `.final-cta`
  perdeu o "sem mensalidade obrigatória" e passou a nomear o passo real
  (conversa no WhatsApp → entender o negócio → contrato simples → produção do
  adesivo, confirmado pelo dono). "Resposta em poucos minutos" subiu para
  antes do botão. O comentário "PRÓXIMAS SEÇÕES" virou a seção `.trust-strip`,
  com Instagram `@zap_tag_` e **"Atendemos Anápolis e região"** — a área
  correta é Anápolis, não Goiânia (o `IMPECCABLE.md` antigo tinha o dado
  errado). Sem foto: o dono ainda não tem foto real do adesivo aplicado, só
  protótipos — não foi inventada imagem nem depoimento. Detector `[]`.
  **Aprovado pelo dono após revisão em servidor local antes do commit.**

- **2026-09-22** — Bloco 2, item 3 do `IMPECCABLE.md` feito, commit
  `86833c9`: metadados de compartilhamento. Open Graph, Twitter card,
  `canonical` e JSON-LD `LocalBusiness` completos, com domínio provisório
  `zap-tag.onrender.com` (o dono ainda não comprou domínio próprio). Imagem
  `assets/og-image.png` (1200×630) criada do zero via .NET/System.Drawing
  (não havia cwebp/sips/magick/ffmpeg nesta máquina), reaproveitando a forma
  exata do ícone da marca. `assets/logo-zaptag.jpg` (não usado em lugar
  nenhum) movido para `design-reference/`. **Bloco 2 (conversão) está
  completo** — itens 1, 2 e 3 commitados. **Ainda sem push**: combinado com
  o dono que o push só acontece depois de todos os itens de um bloco
  validados juntos (não item a item). Aprovado após revisão em servidor
  local. **Push feito** logo em seguida (commit `edaa9fe` incluso).

- **2026-09-22** — Bloco 3 do `IMPECCABLE.md` feito, commit `1ad5462`: motion
  e performance.
  - `/impeccable animate`: `initHowSteps`, `initCompare`, o grid principal de
    `initUseCases` e `initFinalCta` agora travam no estado final depois da
    primeira passagem completa de reveal (antes desconstruíam toda vez que
    saíam de vista, pra sempre). `.hero__scroll-hint-line` (única animação
    `infinite` do CSS) e `scroll-behavior: smooth` passaram a respeitar
    `prefers-reduced-motion`. `initHeroReveal()` ganhou o branch de
    reduced-motion que faltava.
  - `/impeccable optimize`: tilt 3D de "Casos de uso" (`initCardTilt` em
    `js/usecases.js`) agora cacheia o `getBoundingClientRect()` no
    `mouseenter` e escreve o `transform` via `requestAnimationFrame`, tirando
    `transform` da `transition` inline enquanto o tilt está ativo (antes
    chegava ~500ms atrasado do cursor, por causa da transition do reveal). A
    demo de toque do Hero (`touch-animation.js`) ganhou
    `IntersectionObserver` + `visibilitychange` e agora pausa quando sai de
    vista ou a aba vai pra segundo plano, em vez de rodar pra sempre.
  - Verificado com `node --check` nos 3 arquivos JS, checagem de colisão de
    nomes no escopo global compartilhado (nenhuma) e detector `impeccable`
    (`[]`). Sem Playwright nesta máquina — não deu pra automatizar hover/scroll,
    aprovado pelo dono em servidor local. **Bloco 3 completo. Push feito**
    (commit `0409730` incluso).

- **2026-09-22** — Bloco 4 do `IMPECCABLE.md` feito, commit `6203ecb`:
  acabamento e P3 — os 4 comandos que faltavam.
  - `/impeccable adapt`: hambúrguer, `.btn-primary--compact` e links do
    footer em 44px de alvo de toque; `.navbar__inner` de `height` fixo pra
    `min-height`.
  - `/impeccable polish`: `filter: blur(56px)` no `.final-cta__glow` (parou
    de degradar o contraste do subtítulo/botão); ícone de "Fidelidade"
    reescalado; ícone de "Pix" trocado (não reusa mais o raio da marca —
    agora é um check num círculo); painéis do Hero sem overlap ao trocar
    (`switchPanel()` apaga, espera a transition, só então acende o
    próximo); marca padronizada como **"Zap Tag"** em todo texto visível
    (era `zaptag`/`Zaptag`/`Zap Tag` misturado — grafia oficial confirmada
    pelo dono em 22/09); pontuação dos 4 H2 padronizada; âncora morta
    `#fale-conosco` removida.
  - `/impeccable typeset`: decisão foi **carregar a Bricolage Grotesque**
    (não remover o token) — cumpre o plano original do `CLAUDE.md`, nunca
    implementado. Aplicada nos 5 seletores de H2/H3. `text-wrap: balance`
    no H1 e nos H2. 2 `font-size` em px viraram rem.
  - `/impeccable harden`: `role="contentinfo"` no footer (continua aninhado
    no CTA final, decisão do dono preservada); função `svgIcon()` nova
    decide `aria-hidden` ou `role="img"+aria-label` nos 5 SVGs de
    `touch-animation.js`; `role="list"` nas 7 listas com
    `list-style: none`; `USE_CASES`→`TOUCH_DEMO_CASES` e
    `sleep`→`touchDemoSleep`; menu mobile fecha sozinho ao cruzar 860px.
  - Verificado com `node --check`, checagem de colisão de nomes (nenhuma),
    detector `impeccable` (`[]`) e balanceamento de tags HTML. Aprovado pelo
    dono em servidor local. **Bloco 4 completo — os 4 blocos do plano estão
    todos feitos.** Ainda sem push (combinado: push só quando o dono pedir).

- **2026-09-22** — `/impeccable critique` + `/impeccable audit` rodados de
  novo (3 subagentes isolados), depois de fechar os 4 blocos do plano.
  - **Design Health: 27/32** (Bom, 84%) — subiu do placar de partida de
    17/32. Achado principal: a página nunca reassegura quem tem medo de
    mandar mensagem sem saber o preço (maior risco de abandono).
  - **Audit Health: 18/20** (Excelente) — subiu de 14/20. Zero cor hardcoded
    fora do sistema de tokens, `prefers-reduced-motion` tratado em tudo,
    resiliência real a falha parcial de JS. Achado principal: a demo do
    Hero girava pra sempre sem controle de pausa (WCAG 2.2.2).
  - **Corrigido na hora** (commit `155bb1c`): demo do Hero para sozinha
    depois de 2 voltas completas; skip-link "Pular para o conteúdo";
    `.trust-strip__instagram` com alvo de toque de 44px; `role="img"`
    redundante removido de 8 SVGs decorativos; `#hero-touch-demo` com
    `aria-hidden`; `rel="noopener noreferrer"` padronizado nos links de
    WhatsApp.
  - **Decisões do dono sobre os achados do critique** (commit `314f683`
    pros aceitos): aceitou reasseguramento sem preço no CTA final e o link
    de nav pro `#diferencial` (que estava sendo pulado); **recusou** reabrir
    tipografia (mantém as 4 famílias do bloco 4), reestruturar os 6 casos de
    uso (Pix escondido atrás do toggle) e adicionar alternativa ao WhatsApp
    como canal único — os três continuam como estão, por decisão consciente,
    **não propor de novo sem pedido explícito**.
  - Snapshot do critique em `.impeccable/critique/2026-09-22T12-52-36Z__index-html.md`.

- **2026-09-22** — `/impeccable document` feito, commit `c886e76`. `DESIGN.md`
  na raiz + `.impeccable/design.json` (sidecar do painel ao vivo, agora
  versionado — `.gitignore` ganhou `!.impeccable/design.json`, decisão do
  dono). North Star **"The Live Circuit"**: lime (`Volt Lime`) = ação, ciano
  (`Circuit Cyan`) = interação do sistema — nunca intercambiáveis. 4 nomes de
  regra documentados (One Action, Border Role, One Headline Voice,
  Flat-At-Rest). Nomes de cor e tom gerais confirmados com o dono em 2
  rodadas de pergunta (North Star, tom, elevação, nomes de cor, personalidade
  de componente — todas as recomendadas foram aceitas).

- **2026-09-22** — `/impeccable init` feito, commit `8b15bf6`. `PRODUCT.md`
  na raiz. Confirmado com o dono nesta sessão: **preço** ainda sem modelo
  fechado — expectativa interna de ~R$60–80 por unidade, com recorrência
  mensal possível em contratos de várias unidades (múltiplas variáveis, não
  publicar na página); **tecnologia é solução própria** da Zap Tag, não
  revenda de plataforma terceirizada; **usuário primário é o dono do
  negócio** (compra e a Zap Tag configura), o cliente final que encosta o
  celular é ator do fluxo, não quem decide a compra. 5 princípios de produto
  registrados, os dois mais citáveis pra trabalho futuro: **nunca fabricar
  prova social** (segue sem depoimento/foto real) e **WhatsApp é o único
  canal de conversão** (não introduzir alternativa sem pedido explícito).
  **Com isso, o `IMPECCABLE.md` está 100% completo** — plano inteiro,
  critique+audit, document e init.

- **2026-09-22** — Slogan geral da marca definido: **"Encostou, ativou."**
  Escolhido entre três linhas de ideia (o gesto, brincadeira com "zap", o
  resultado para o negócio). Motivo: já estava testado na página, as duas
  palavras espelham os dois passos contra os quatro do QR code, e cabe no
  adesivo. "Num zap, tá feito." ficou como segunda opção — descartada porque
  "zap" também é gíria de WhatsApp e pode confundir quem não conhece a marca.
  - Aplicado no rodapé, embaixo da logo (`.site-footer__tagline`, Manrope 500
    em `--color-text-muted`, dentro do novo wrapper `.site-footer__brand`).
  - A seção "Diferencial vs. QR code" **continua** com o mesmo texto em
    destaque (Unbounded) — a repetição no rodapé é eco proposital.
  - `<title>` e metadados de compartilhamento **não** foram mexidos.
  - Registrado também em `PRODUCT.md` (Brand Commitments).

- **2026-09-22** — Nome fantasia definido: **"Zap Tag"**, igual à marca,
  sem complemento. Descartados "Zap Tag Adesivos Inteligentes" e "Zap Tag
  Automação por Aproximação". Motivos: o cliente nunca vê nome diferente
  (nota, Pix, Google), e o Perfil da Empresa no Google proíbe palavra-chave
  no nome — a descrição vai na categoria/bio. Ainda não há CNPJ; quando
  abrir, usar esse nome fantasia. Nada mudou no site (já usa "Zap Tag").

- **2026-09-22** — Quatro das "perguntas para considerar" da critique viraram
  mudança (pedido do dono). Detalhes das regras novas em `DESIGN.md`.
  - **Ícone do WhatsApp** nos 4 botões de conversão e no link do rodapé. É o
    glifo oficial (Simple Icons, CC0), definido uma vez só como
    `<symbol id="icon-whatsapp">` no topo do `<body>` e referenciado por
    `<use>`. Botão novo: `<svg class="btn-primary__icon" aria-hidden="true"
    focusable="false"><use href="#icon-whatsapp"/></svg>` antes do texto.
  - **"Como funciona" + "Diferencial vs. QR code" fundidas** numa seção só
    (`section.compare#como-funciona`). H2 novo: "Dois passos. O QR code pede
    quatro." A coluna Zap Tag vem primeiro e os 2 passos ganharam descrição.
    O "Resultado automático" da seção antiga entrou na descrição do passo 2.
    Saíram a `.how` inteira (HTML, CSS, `initHowSteps`/`syncHowTrack`) e o link
    "Diferencial" da navbar. A âncora `#diferencial` não existe mais.
  - **Silhueta da tag como forma de interface** (`--tag-tip-ratio: 0.383`):
    botão primário com a ponta da tag (lime num `::before` com clip-path,
    pra não cortar o anel de foco), selo dos ícones de casos de uso e
    marcador dos passos da Zap Tag. De brinde, corrigido um bug antigo: o
    `.btn-primary--compact` nunca ficava compacto, porque a regra base vinha
    depois na folha com a mesma especificidade.
  - **Hero interativo:** o celular virou `<button>`. Mouse arrasta até a tag,
    touch toca e teclado usa Enter. A demo automática continua como convite
    e para no primeiro gesto. Contato em `translateY(22px)` e repouso em
    `-40px`: os dois valores existem em `touch-animation.js` e em
    `global.css`, e precisam ficar iguais. No touch **não** tem arraste de
    propósito, porque prenderia a rolagem da página numa área de 168×300px.
  - Verificado com Playwright em 1440 e 390: arraste, toque e teclado
    disparam e anunciam, console limpo, sem overflow lateral. O detector dá
    38 avisos `advisory` (tamanhos de fonte e raios fora da escala do
    `DESIGN.md`, a maioria de antes desta mudança) e nenhum achado de verdade.

- **2026-09-22** — Nova rodada de `critique` + `audit` depois do `f61f861`:
  **22/32** (Aceitável) e **16/20** (Bom). Antes eram 27/32 e 18/20, mas o
  revisor desta vez não viu a nota anterior e foi mais exigente. Parte da
  queda foi regressão real do `f61f861`. Snapshot em
  `.impeccable/critique/2026-09-22T15-28-49Z__index-html.md`. Correções
  aplicadas no mesmo dia (escopo escolhido pelo dono: os 3 P1 e os defeitos
  da demo):
  - **Foco do celular da demo:** o `outline: 1px` do aro do aparelho anulava o
    anel ciano global (mesma especificidade, vinha depois). Agora
    `.touch-demo__phone:focus-visible` repõe o anel de 2px. **Armadilha
    recorrente deste CSS:** regra de componente que mexe em `outline` precisa
    repor o `:focus-visible`.
  - **Demo:** o `pointerdown` só registra o gesto. O controle muda de mão num
    gesto confirmado (arraste passou de 6px, ou toque/clique soltou), e o
    arraste parte da posição atual do celular. Isso corrigiu dois defeitos:
    no celular, rolar a página por cima do aparelho matava a demo; no
    desktop, o celular saltava 62px ao ser agarrado. Autoplay reduzido para
    **1 ciclo (~3,6s)**, dentro dos 5s da WCAG 2.2.2, e no fim o celular
    volta ao repouso. Também passou a tratar `lostpointercapture`.
  - **"2 contra 4":** os passos da Zap Tag voltaram a ser curtos como os do QR,
    e a explicação subiu pra um `.section-lead` sob o H2. As colunas ficam
    lado a lado em toda largura, inclusive no celular. Medido: desktop 172 ×
    296px, celular 137 × 272px (antes empatavam em ~220 × 236).
  - **Títulos:** H2 com `line-height: 1.1` e H3 com 1.25 (antes herdavam 1.5
    do body). H2 da seção com quebra forçada: "Dois passos. / O QR code pede
    quatro.".
  - **Texto, com fatos confirmados pelo dono:** o fact "Funciona com a tela
    bloqueada, em muitos aparelhos" virou "Funciona em iPhone e Android que
    pagam por aproximação". O CTA final trocou "fechamos um contrato simples"
    por "combina tudo por escrito".
  - **Ficou para depois** (P2 da crítica): demo abaixo da dobra e sem nome da
    marca no Hero mobile; reasseguramento de 13px no CTA final; horário de
    atendimento real; ícones de Wi-Fi e Pix; glows parados vs a regra
    Flat-At-Rest; `theme-color`; rodapé dentro do `<main>`.
  - **Correção de um número:** os "38 avisos do detector" do `f61f861` vieram
    de passar o CSS direto para o `impeccable detect`, e a ferramenta pede só
    markup. O certo é `impeccable detect --json index.html`, que dá 3 avisos
    advisory e 0 achados reais.

- **2026-09-22 (computador do trabalho, depois da rodada da máquina
  pessoal)** — `git pull` trouxe 6 commits (`8f250b7`..`37887a9`): nome
  fantasia "Zap Tag", slogan "Encostou, ativou.", seção "Como funciona"
  fundida com "Diferencial vs. QR code", Hero interativo (arrastar/tocar/
  teclado), ícone oficial do WhatsApp, silhueta da tag como forma de
  interface, e nova rodada de critique+audit (22/32, 16/20 — 3 P1 já
  corrigidos lá). `HANDOFF-CLAUDE.md` lido e removido, commit `0ca5de6`.
  Detalhe completo de cada mudança está nas entradas acima (vieram junto no
  pull) e em `IMPECCABLE.md` → "Rodada da máquina pessoal".
  - **Item 1 do P2 que sobrou — Hero mobile (`/impeccable adapt`) — feito**,
    commit `20adcac`. Demo encolhida abaixo de 640px (telefone 168×300 →
    128×228, ~0,76x em tudo dentro do `.touch-demo`); `TOUCH_DEMO_REST`/
    `CONTACT` do JS mantidos idênticos nos dois tamanhos, de propósito —
    evita a armadilha que o handoff avisou (os dois valores têm que ficar
    iguais entre CSS e JS). `.logo__wordmark` sempre visível (tirado o
    `display:none` que só liberava a partir de 768px). `.hero__scroll-hint`
    só aparece a partir de 960px, onde o Hero já tem espaço vertical de
    verdade. Sem Playwright nesta máquina — aprovado pelo dono sem
    verificação automatizada em 390×844.
  - **Item 2 (reasseguramento) — feito**, commit `888a5f1`. Horário real
    confirmado pelo dono: **todos os dias, das 7h às 23h**. `.final-cta__trust`
    trocou "Resposta em poucos minutos" por "Atendemos Anápolis e região,
    todos os dias das 7h às 23h" — junta o horário real com a área de
    atendimento (que antes só existia longe do botão, na faixa de confiança).
    Fonte de 13px cinza-fraco subiu pra ~15px em `--color-text`.
  - **Item 3 (polish) — feito**, commit `b00c595`.
    - Glow parado do `.hero__glow`/`.final-cta__glow`: perguntei ao dono se
      o `DESIGN.md` ou o código deveria mudar — ele confirmou que os glows
      sempre foram intenção consciente (já documentado nas supressões
      `dark-glow`/`radial-halo` do `.impeccable/config.json`). Corrigi o
      `DESIGN.md`: nova **Ambient-Glow Rule**, separada da Flat-At-Rest Rule
      (que agora é só sobre componentes). Sidecar `design.json` atualizado
      junto.
    - `theme-color` (`#0B0D0F`), `.link-secondary` com 44px de alvo de
      toque, `.touch-demo__panel-idle` de 11,2px pra 12px.
    - Ícone de Wi-Fi (era barra de sinal de celular, lia como "cobertura"
      não "conexão") trocado pelo glifo universal de ondas de Wi-Fi, igual
      na demo do Hero e nos cards. Ícone de Pix (era o check genérico da
      correção anterior) trocado por um cifrão — mais claramente
      "pagamento", sem reciclar o raio da marca nem usar a marca oficial do
      Pix.
    - `TAG_ICON`/`CHECK_ICON`/`svgIcon` → `TOUCH_DEMO_TAG_ICON`/
      `TOUCH_DEMO_CHECK_ICON`/`touchDemoSvgIcon` em `touch-animation.js`.
    - `.btn-primary:hover` atrás de `@media (hover: hover)` — não gruda mais
      depois do toque no celular; `:focus-visible` continua sempre ativo.
  - **Item 4 (critique+audit de novo) — feito**, commit `8a87ef3`. Design
    Health voltou a **27/32** (recuperou o placar do round 1). Audit deu
    **17/20**, com 2 P2 novos — ambos corrigidos na hora:
    - `.touch-demo__panel-label` tinha regredido pro mesmo bug do piso de
      12px já corrigido no seletor irmão (`.touch-demo__panel-idle`).
    - Race condition: se a pessoa ativasse a demo (teclado/toque) nos
      primeiros ~600ms, o ciclo automático podia escrever por cima do
      painel que o gesto dela tinha acabado de abrir. `switchPanel()`
      ganhou um parâmetro `isStale` — a chamada da demo automática recusa
      escrever se, quando o fade termina, a pessoa já assumiu o controle.
    - Também corrigido (achado do critique, não do audit): a demo do Hero
      **espera ~1,1s antes do primeiro ciclo automático**, pra não disputar
      atenção com o stagger de entrada do H1/subtítulo/CTA — era um P1 da
      crítica ("uma coisa de cada vez" da checklist de carga cognitiva).
    - **Reasseguramento espalhado**: você confirmou adicionar uma versão
      curta (`.trust-note`, discreta, `--color-text-muted`) perto do CTA
      do Hero e embaixo do grid de casos de uso — sem repetir a frase
      inteira do CTA final, que continua sendo o único lugar com a versão
      completa + horário.
    - Pix escondido atrás do toggle: o revisor achou de novo, mas é o
      mesmo achado do round 1 que você já decidiu manter — não reabri.
    - 3 avisórios do detector (2 falso positivo verificado, 1 já
      documentado no `DESIGN.md` como intencional) suprimidos em
      `.impeccable/config.json` com `ignores add-value` — detector volta a
      `[]` puro.
    - Snapshot em `.impeccable/critique/2026-09-22T18-05-45Z__index-html.md`.

- **2026-09-22 (noite, máquina `C:\Users\guica\.local\bin\zap-tag`)** — Sessão
  de atualização de contexto, sem mudança de código no site.
  - **`git pull` trouxe 8 commits** (`0ca5de6`..`e60bbc3`) que a outra máquina
    já tinha feito: os 4 itens que o `HANDOFF-CLAUDE.md` deixava pendentes
    (Hero mobile, reasseguramento com horário real, polish, fechar o ciclo) e
    a remoção do próprio handoff. **Lição de fluxo:** `git status` sem `git
    fetch` diz que está em dia mesmo estando 8 commits atrás — sempre fazer
    `git fetch` + `git log HEAD..origin/main` ao abrir a pasta.
  - **O verde foi medido e CONFIRMADO como está — não reabrir.** O dono
    achou que a identidade visual tinha clareado. Investigado: o
    `--color-primary: #D4FF3F` entrou no primeiro commit do site (`1a82caa`)
    e **nunca mudou** (`git log -S` no `css/global.css`). A impressão tem
    causa real, porém: amostrando 145 mil pixels do núcleo da tag em
    `design-reference/logo-zaptag.jpg`, a cor dominante da logo é **`#CFFB2C`**
    (luminosidade 57,8%) contra **`#D4FF3F`** do site (62,4%) — o site é ~4,6
    pontos mais claro e tem mais branco na mistura (azul `0x3F` contra `0x2C`).
    A paleta foi tirada "por aproximação" em 2026-09-18 e o ajuste fino nunca
    foi feito. O que mudou a percepção agora foi o `f61f861` espalhar esse
    mesmo verde por mais formas (silhueta da tag no botão, selo dos ícones,
    marcador de passo) e o logo do cabeçalho ser um SVG preenchido com o
    token, não a imagem original. **Decisão do dono: manter `#D4FF3F`.**
    Se algum dia quiser alinhar, o hex vive em `css/global.css:22`,
    `assets/favicon.svg`, `assets/og-image.png` (PNG, precisa regerar),
    `DESIGN.md` e `.impeccable/design.json` — e o contraste aguenta os dois
    (15,11:1 no botão com o verde da logo, contra 15,71:1 hoje).
  - **`/impeccable critique` round 4 rodado** (2 subagentes isolados):
    **Design Health 27/36 (75%, Bom)**, detector **0 achados / exit 0**, 0px
    de overflow em 1440/390/320, nenhum texto abaixo de 12px, console limpo.
    A página está mecanicamente limpa — o que sobra é estratégia, não defeito.
  - **Nada foi implementado, por decisão do dono:** "deixe tudo anotado nas
    alterações que temos que fazer, ao sair da faculdade faremos". A fila
    completa (6 problemas + higiene do config, cada um com medição, correção
    proposta e comando) está em `IMPECCABLE.md` → **"Fila pendente — round 4"**.
    Os dois P1 são do celular: o clímax da demo cai 135,8px abaixo da dobra em
    390×844, e há 1.784px de rolagem sem nenhum CTA bem depois do argumento
    que convence.
  - **Não decidido ainda** (perguntei, o dono adiou): por onde começar, o que
    fazer com o lime do `.hero__title-accent` (viola a One Action Rule do
    próprio `DESIGN.md`) e qual o escopo da próxima leva.

- **2026-09-22 (noite, máquina `guica`)** — **Fila round 4 aplicada**
  (pedido do dono: "faça as alterações"). **Não commitado.** Itens do
  `IMPECCABLE.md` → "Fila pendente — round 4":
  - **1. Demo no celular:** abaixo de 640px a demo fica deitada (celular
    96×170 à esquerda, adesivo à direita, 180px de altura). O arraste com
    mouse passou a ser horizontal nessa largura (`dragAxis()` em
    `touch-animation.js`). **Armadilha nova:** agora são DOIS pares de
    constantes a manter iguais entre JS e CSS: `TOUCH_DEMO_REST/CONTACT`
    (−40/22, `translateY`) e `TOUCH_DEMO_REST_ROW/CONTACT_ROW` (−24/14,
    `translateX`, na media query `max-width: 639px`). O gatilho do convite
    observa o `.touch-demo__tag` com threshold 0.9 (antes o root com 0.1).
    Hero com `min-height: min(100svh, 760px)`, e no celular o gap/padding
    do grid caíram de 48 para 28/24px. **Medido em 390×844:** demo em
    y 609→820 (antes 652→980), adesivo em 677→721. Em 320×568 o adesivo
    ainda fica abaixo da dobra (y 759): o texto do Hero sozinho já ocupa
    quase a tela.
  - **2. CTA na comparação:** `.compare__cta` com `.btn-primary` logo
    abaixo do slogan, mensagem própria ("vi a comparação com o QR code...").
    Entra junto com os facts no `initCompare()`. Não foi feito o CTA fixo
    na zona do polegar (opção b), que ficou como opcional.
  - **3. Lime:** `.hero__title-accent` removido, H1 todo em `--color-text`.
    Nenhum hex mudou.
  - **5. Rede de segurança do WhatsApp:** os 5 `.btn-primary` ganharam a
    seta diagonal (`#icon-external` no sprite) e o `.sr-only` "(abre o
    WhatsApp)". No CTA final: "ou salve o número: (62) 98223-3133", em
    texto puro, sem `tel:`, pra não virar um segundo canal.
  - **6. Alvos de 44px:** `.logo` (navbar e rodapé) e `.nav-link`.
  - **7. Config:** justificativas de `cramped-padding` e `dark-glow`
    reescritas (ver `IMPECCABLE.md`).
  - **Verificação:** `node --check` nos 3 JS, tags do HTML balanceadas,
    detector `[]` (exit 0), 0px de overflow lateral em 390/320/768/1440,
    os 5 botões com `?text=` correto, contato da demo deitada sobrando 6px
    até o adesivo. Medido em iframe no Chrome. A aba ficava em
    `visibilityState: hidden`, então as transições e a demo automática
    **não** puderam ser vistas animando: o dono precisa conferir no celular
    de verdade.
  - **Falta:** item 4 (FAQ de instalação), que depende das respostas do
    dono sobre onde cola, resistência, durabilidade, prazo e celular sem NFC.

- **2026-09-22 (noite)** — O dono mandou os **protótipos dos formatos
  físicos** (2 PDFs em `C:UsersguicaDownloadsProtótipos Imagens`, fora
  do repositório): cartão de mesa 70×100mm (PVC ou papel plastificado, tag
  Ø~25mm na zona tracejada), etiqueta redonda Ø55mm (vinil laminado, tag
  embaixo), etiqueta direta 40×60mm (vinil), porta-copo Ø90mm (papelão ou
  PVC), cartão CR-80 85×54mm, selo de cardápio Ø35mm, suporte acrílico em L
  com insert trocável e decalque de porta/vitrine ~110×110mm (vinil
  translúcido). São **mockups, não fotos**. Responde em parte o item 4 do
  round 4 ("onde cola") e a pergunta 3 (mostrar o objeto). Os mockups
  escrevem a marca como "zaptag" minúsculo, e a grafia oficial é "Zap Tag".
  **Respostas do dono (mesma noite):** os 8 são protótipos, mas a ideia é
  ter todos; testes de água e gordura não foram feitos; durabilidade e prazo
  de entrega ainda não existem; o caso do celular sem aproximação nunca foi
  pensado. **Consequência: o FAQ do item 4 fica parado.** Não escrever
  nenhuma dessas respostas no site até o dono ter o dado real.

- **2026-09-22 (noite)** — **Seção "Formatos" construída** (`section.formats#formatos`,
  entre "Casos de uso" e a faixa de confiança; link "Formatos" na navbar
  desktop e mobile). **Não commitado.** Os 8 protótipos desenhados em SVG
  inline, com viewBox em mm e largura `--fmt-w × --mm` (1,3px/mm no
  celular, 1,7 a partir de 640px, 2 a partir de 1100px): ficam em escala
  entre si, apoiados numa "prateleira" de altura fixa (112mm). Símbolos
  novos no sprite: `fmt-wave`, `fmt-mark`, `fmt-star`. Cada item mostra
  nome, onde fica e tamanho. **Material, prazo e resistência ficaram de
  fora de propósito**, porque não foram testados. Legenda honesta: "Desenhos
  ilustrativos, em escala entre si. O suporte acrílico ainda não tem medida
  definida." Sem JS e sem `data-reveal`: o conteúdo aparece mesmo se o script
  falhar. Na página a marca aparece como "Zap Tag" (nos mockups do dono está
  "zaptag"). Verificado: detector `[]`, 0px de overflow em 390 e 1100.
  - **Reorganizada a pedido do dono** ("mais organizado e distribuído"):
    trocado o `flex-wrap` (quebrava 5 + 3) por grade fixa, 2 colunas no
    celular e 4 a partir de 900px (2 linhas de 4). A 1ª linha é o que fica na
    mesa, a 2ª o que fica em parede, porta ou carteira. Cada célula tem uma
    linha de prateleira (`border-bottom` no `.format__stage`). A escala `--mm`
    acompanha a coluna: no celular `min(1.3px, (100vw − 64px) / 224)`, 1,7 a
    partir de 640, 1,55 a partir de 900 e 2 a partir de 1200. Medido: nenhum
    objeto passa da largura da célula em 320/390/900/1200, 0px de overflow.
  - **Soltada de novo** (dono: "não quero exatamente simétrico"): saiu a
    linha de prateleira. Cada `.format` ganhou deslocamento próprio (`--nx`,
    `--ny` por `nth-child`, multiplicados por `--loose`: 0,5 no celular e 1 a
    partir de 900px) e inclinação só no desenho (`--tilt`, de −6° a 8°). O
    decalque fica reto, porque vai colado alinhado na porta. A grade de 4/2
    colunas continua por baixo, e é ela que mantém a distribuição. Para mudar
    o arranjo, é só mexer nos 8 valores `nth-child` no `global.css`. Medido:
    nenhum desenho sai do container em 320/390/1200.
  - **Animação de entrada um por um** (pedido do dono): `initFormats()` em
    `main.js` põe `.formats--animate` na seção (só com JS e sem
    reduced-motion; sem a classe tudo nasce visível) e observa cada
    `.format` (threshold 0.35, rootMargin −30% embaixo). Quem cruza o gatilho
    vai pra uma fila que libera um a cada 240ms, na ordem do markup. Entrada:
    o desenho desce girando e assenta no `--tilt`, sai um pulso ciano
    (`format-ping`, a resposta do sistema) e depois entram nome, ideia e
    medida. `revealEverything()` inclui `.format`. A linha "onde fica" virou
    **"Ideia de uso: …"** (sugestões de uso, sem prometer material nem
    prazo). A legenda ganhou `margin-top: 80px`, porque encostava na medida
    do CR-80. **Verificação:** a ordem de entrada foi medida por log de
    classes (1º sozinho, os outros conforme o scroll). A animação em si
    **não** foi vista rodando: os prints do Chrome saíram pretos e a aba
    ficava em segundo plano. Precisa de conferência do dono.

- **2026-09-22 (noite)** — **Hero de tela larga preenchido** (dono: "as
  pontas muito vazias, parece que falta algo", print em 1920px). **Não
  commitado.** Só a partir de 1200px: grid do Hero passa pra `1fr 1fr`, e
  `#hero-touch-demo` fica em `scale(1.2)`. O arraste divide o deslocamento do
  cursor pela escala (`drag.scale`), senão o celular corria 1,2x mais que o
  mouse. Entraram 3 **etiquetas** (`.hero__chip`: avaliação, cardápio,
  Wi-Fi) em volta do celular. A do caso aberto acende em ciano via evento
  `touch-demo:open`, que o `showPanel()` dispara e o `initHeroChips()`
  escuta; ele precisa rodar ANTES do `initTouchAnimation`. Em qualquer
  largura acima de 640px: **campo de anéis ciano** (`.touch-demo__field`,
  SVG de 600px centrado no adesivo, opacidade 0,16) que sobe pra 0,4 no
  contato. **Armadilha:** a regra global `svg { max-width: 100% }` espremia o
  campo pra 240px; ele precisa de `max-width: none`. Medido: folga
  etiqueta↔celular de 21 a 25px em 1200 e de 47 a 62px em 1920, 0px de
  overflow. **Cache:** o navegador segurou o `touch-animation.js` antigo;
  ao conferir, dar Ctrl+F5.
  - **Ondas em movimento** (dono: "o círculo tá muito fixo, deve entrar
    suave sem a pessoa mexer"): os 4 anéis têm o mesmo raio e a animação
    `touch-field-wave` (6s, infinita) faz cada um crescer de 0,14 a 1 e se
    apagar; um novo sai a cada 1,5s. Os atrasos são positivos, então no load
    o campo se forma aos poucos. Pausa com `.is-field-paused` (observer
    próprio no root + `visibilitychange`), porque o observer da demo
    automática é desligado quando o convite acaba. Com reduced-motion ficam
    parados em escalas escalonadas. **Tensão com a WCAG 2.2.2:** é movimento
    automático de mais de 5s sem botão de pausa, e o projeto já tinha
    limitado a demo a 1 ciclo por esse motivo. Atenuantes: é fundo, fino,
    pausa fora de vista e respeita reduced-motion. Se o dono quiser seguir à
    risca, limitar a N ciclos (`animation-iteration-count`).

- **2026-09-22 (noite)** — **Demo do Hero em ciclo contínuo** (dono: "ainda
  está sendo necessário eu mexer no celular para conectar"). **Decisão do
  dono que substitui a de 1 ciclo só (WCAG 2.2.2).** O celular encosta
  sozinho, abre o caso, sobe com a tela mostrando o que abriu e repete pelos
  3 casos (~4s por ciclo). O gesto da pessoa assume o controle, e a demo
  volta sozinha depois de `AUTO_RESUME_MS` (6s) sem gesto (`lastUserAt`). O
  ciclo automático **não anuncia** no aria-live, pra não falar a cada 4s;
  só o gesto anuncia. Continua pausando fora de vista (adesivo 90% visível)
  e com a aba oculta, e com reduced-motion não se move. **Como testar
  quando a aba do Chrome fica `hidden`:** a demo nunca anda (é a pausa
  funcionando). Carregar o HTML num iframe via `document.write` com um
  stub de `visibilityState` e de `IntersectionObserver` no `<head>`.
  Assim confirmado: review → cardápio → …, com as etiquetas acompanhando.

- **2026-09-22 (noite)** — **Página mais larga em tela grande** (dono: "em
  todas as abas, mais espaçado pra preencher as pontas"). **Não commitado.**
  `.container` passou de 1280px/24px pra **1600px com respiro
  `clamp(24px, 5vw, 80px)`**: em 1920 o conteúdo foi de 1232 pra 1440px e a
  sobra lateral caiu de 337 pra 233px. Acompanhando: `.compare__columns` vai
  até 1080px a partir de 1400; a grade de formatos vai até 1400px, com
  `--mm: 2.4px` a partir de 1600; e no Hero, a partir de 1600, demo em
  `scale(1.32)` (via `--hero-demo-scale`, que o arraste já compensa) e texto
  com `max-width: 640px`. Medido em 1280/1440/1920/390: 0px de overflow,
  nenhum formato estoura a coluna, e a folga das etiquetas do Hero fica
  entre 21 e 93px. No celular nada muda (o clamp dá 24px até ~480px).

- **2026-09-22 (noite)** — **CTA final em duas colunas** (dono: "está
  vazio, aumentar o conteúdo sem ficar cansativo"). **Não commitado.** A
  partir de 960px, `.final-cta__inner` vira grid 1fr 1fr (até 1200px). À
  esquerda (`.final-cta__pitch`): título, "Sem compromisso: você decide
  depois de saber o valor.", botão (`#final-cta-button`) e o número. À
  direita (`.final-cta__next`): "O que acontece depois do clique", com uma
  **prévia de conversa** (`.wa-preview`) que mostra SÓ a mensagem que o
  botão manda (o JS copia o `data-wa-message` do botão pro balão), **sem
  resposta simulada da empresa**, e 3 passos numa linha do tempo. O
  parágrafo antigo virou esses passos, então o texto quase não cresceu.
  Horário e área foram pra prévia/passos. Superfície neutra, não o verde do
  WhatsApp. Marcadores dos passos em ciano, nunca lime. Animação (só com
  `.final-cta--animate`): o balão "chega" em 350ms e os passos acendem em
  850/1100/1350ms. `.final-cta__subtitle` removido. Balão com raios 16/8px
  (escala do DESIGN.md; 14/4 davam aviso no detector). Verificado: detector
  `[]`, tags balanceadas, 0px de overflow em 1440 e 390.

## Próximo passo sugerido

As 6 seções do fluxo estão prontas e no ar. O plano original do
`IMPECCABLE.md` (4 blocos + critique/audit + document + init), o trabalho
novo da máquina pessoal (nome fantasia, slogan, Hero interativo, seção
fundida) e os 4 P2 da rodada de casa (Hero mobile, reasseguramento, polish,
fechar o ciclo) **estão todos feitos**.

**O plano vigente é a "Fila pendente — round 4" do `IMPECCABLE.md`**, escrita
em 2026-09-22 à noite e ainda não iniciada por decisão do dono (retomar
quando ele sair da faculdade). São 6 problemas + higiene do config, com
medição e correção propostas para cada um; os dois P1 são de celular. Design
Health está em 27/36 no round 4 (denominador diferente das rodadas
anteriores — ver a nota no placar), detector zerado.

Fora isso, o que falta não é trabalho de código:

1. **CNPJ**: ainda não aberto. Nome fantasia já decidido: "Zap Tag".
2. **Registro de marca no INPI**: não pesquisado ainda. "Zap" é termo
   comum (ex.: ZAP Imóveis) — pesquisar "Zap Tag" nas classes 9 e 42 antes
   de investir em material impresso.
3. **Domínio próprio**: ainda não comprado, site publicado em
   `zap-tag.onrender.com` (provisório — ver comentário no `<head>` do
   `index.html` pra trocar em 3 lugares quando comprar).
4. **Skill `impeccable`** está instalada nas duas máquinas: na pessoal em
   `C:\Users\Guilherme\.claude\skills\impeccable` e na outra em
   `C:\Users\guica\.local\bin\.claude\skills\impeccable` (confirmado em
   2026-09-22, rodando o round 4 por lá). Se abrir o Claude Code numa máquina
   nova, confirmar antes de usar `/impeccable`.
   - **Duas armadilhas de execução medidas em 2026-09-22:** o launcher
     retorna vazio quando chamado pelo PowerShell (`$LASTEXITCODE` em branco)
     e funciona normalmente pelo Bash — usar Bash. E o `resize_window` do
     Chrome não tem efeito com a janela maximizada (`innerWidth` fica travado
     em 1920, `outerWidth` retorna 0); o contorno que funcionou foi medir num
     iframe same-origin de largura exata, descontando 15px de scrollbar.
