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

## Próximo passo sugerido

**O plano do `IMPECCABLE.md` está 100% completo** (os 4 blocos, critique+audit,
`DESIGN.md`, `PRODUCT.md`) e as 6 seções do fluxo estão prontas e no ar
localmente. Não há mais um plano em andamento — o próximo trabalho de design
vem de um pedido novo do dono, não deste arquivo. Pendências reais que
sobraram, registradas como decisão em aberto (não bloqueiam nada):

- **CNPJ**: ainda não aberto. Nome fantasia já decidido: "Zap Tag".
- **Registro de marca no INPI**: não pesquisado ainda. "Zap" é termo
  comum (ex.: ZAP Imóveis) — pesquisar "Zap Tag" nas classes 9 e 42 antes
  de investir em material impresso.
- **Domínio próprio**: ainda não comprado, site publicado em
  `zap-tag.onrender.com` (provisório — ver comentário no `<head>` do
  `index.html` pra trocar em 3 lugares quando comprar).
- **Skill `impeccable` instalada global** nesta máquina
  (`C:\Users\Guilherme\.claude\skills\impeccable`) — `/impeccable` funciona
  em qualquer pasta aqui. Se abrir o Claude Code numa máquina diferente,
  confirmar se a skill está instalada antes de usar `/impeccable`.
