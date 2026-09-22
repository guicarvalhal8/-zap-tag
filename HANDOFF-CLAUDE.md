# Passagem de contexto — Zap Tag (para o Claude Code de outra máquina)

> **Claude, este arquivo é para você.** Ele foi escrito pelo Claude Code da
> máquina pessoal do Guilherme em **2026-09-22**, porque a máquina do trabalho
> não tem a memória acumulada dessas sessões. Siga a **Ordem de execução**
> abaixo antes de fazer qualquer outra coisa no projeto. O arquivo é
> **temporário**: no fim do passo 5 ele sai do repositório.

---

## Ordem de execução (faça nesta sequência)

1. **Leia este arquivo inteiro** antes de agir.
2. **Salve na sua memória persistente** o conteúdo da seção
   [O que salvar na memória](#o-que-salvar-na-memória): uma memória por item,
   no formato de memória que o seu harness usa. Não salve o que o repositório
   já registra (o histórico está em `MEMORY.md` e o plano em `IMPECCABLE.md`);
   salve os ponteiros para eles.
3. **Instale as skills** da seção [Skills e ferramentas](#skills-e-ferramentas)
   e confirme que o `/impeccable` aparece.
4. **Leia `CLAUDE.md`, `MEMORY.md` e `IMPECCABLE.md`** na raiz, nessa ordem.
   Eles são a fonte da verdade do projeto. Este arquivo só resume e ordena.
5. **Tire este arquivo do repositório:** `git rm HANDOFF-CLAUDE.md` e commit
   com a mensagem `Remove arquivo de passagem de contexto`. **Pergunte ao
   Guilherme antes de dar push** (a regra do projeto é não dar push sem pedido
   explícito, e o push dispara o deploy no Render).
6. Diga ao Guilherme, em uma ou duas frases, o que foi salvo e o que ficou
   instalado, e pergunte as **3 perguntas em aberto** da seção
   [Próximo passo](#próximo-passo-bloco-2-item-2) antes de mexer no bloco 2,
   item 2.

---

## O que salvar na memória

Salve cada item como uma memória separada.

### 1. Idioma (tipo: feedback)
Sempre responder em **português do Brasil**, inclusive em resumos, perguntas e
mensagens de commit.

### 2. Como trabalhar com o Guilherme (tipo: feedback)
- **Nunca commitar nem dar push sem pedido explícito.** Ele confere no
  navegador antes. Pedido de commit não autoriza push, nem o contrário.
- Trabalhar **seção por seção / item por item**, mostrando o resultado antes
  de seguir.
- **Verificar por medição, não por impressão:** `getComputedStyle`,
  `getBoundingClientRect` e console, em desktop **e** mobile, antes de dizer
  que está pronto.
- Antes de mudar copy factual ou afirmar algo sobre a empresa (área de
  atendimento, prazos, garantias), **perguntar**. Não inventar prova social.
- Quando achar um bug fora do escopo durante a verificação: se for pequeno e
  na mesma superfície, corrigir e **avisar que foi um extra**; se não, só
  relatar.
- Ao fim de cada etapa, atualizar `MEMORY.md` e `IMPECCABLE.md` no repo.
- **Por quê:** é o fluxo que funcionou nas sessões de 18 a 22/09/2026, e o
  `CLAUDE.md` do repo exige isso.

### 3. Projeto Zap Tag (tipo: project)
- Landing page da **Zap Tag**, que vende adesivos NFC (encostar o celular e
  disparar uma ação: avaliação no Google, cardápio, Wi-Fi, Pix, fidelidade,
  contato). Repo: `https://github.com/guicarvalhal8/-zap-tag` (repare no `-`
  antes de "zap-tag"). Branch `main`.
- Stack: HTML + CSS próprio + JS em **scripts clássicos** (sem módulos, sem
  build). Publicado no **Render** (`zap-tag.onrender.com`), que **só atualiza
  no push**.
- Estado em 2026-09-22: 6 seções prontas; bloco 1 do plano Impeccable e o
  item 1 do bloco 2 aplicados e commitados. **Próximo: bloco 2, item 2.**
- Contatos reais já no site: WhatsApp `5562982233133`, e-mail
  `usezaptag@gmail.com`, Instagram `@zap_tag_`.
- **Intocável:** logo, paleta de cores e identidade visual (palavras do dono).
  Pode criar token novo; não pode mudar hex existente.
- **Preço não vai para a página.**
- **Como aplicar:** ler `MEMORY.md` e `IMPECCABLE.md` antes de qualquer
  mudança; eles têm o histórico e as armadilhas.

### 4. Ambiente de verificação (tipo: reference)
- Servidor local: `python -m http.server 8777 --bind 127.0.0.1` dentro do
  repo; derrubar no fim.
- Viewport mobile: a ferramenta `resize_window` da extensão do Chrome **não
  funciona** (responde sucesso e continua em 1920). Usar **Playwright**, com
  `newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })`.
- `locator.screenshot()` de uma seção inteira rola a página e o reveal se
  desfaz. Cards "apagados" na captura não são bug. Posicionar com `scrollTo`
  e usar `page.screenshot()`.
- Detector: `impeccable detect --json index.html` (só markup, **nunca**
  passar CSS). Hoje retorna `[]`; qualquer achado novo significa que algo
  entrou.

---

## Skills e ferramentas

### Obrigatória: `impeccable` (versão usada: 4.3.1)

Na máquina pessoal a skill foi instalada com escopo de projeto numa pasta
acima do repo. **Na máquina do trabalho, instale global**, para funcionar em
qualquer pasta:

```bash
npx impeccable install
# escolha: [1] Detected only
# location: global (~)
```

Depois, **reinicie o Claude Code** e confirme que `/impeccable` aparece na
lista de skills.

- O launcher passa a ficar em `~/.claude/skills/impeccable/scripts/impeccable`
  (no Windows sem `sh`, use `impeccable.cmd`). **O caminho absoluto citado no
  `IMPECCABLE.md` (`C:/Users/guica/.local/bin/.claude/...`) é da máquina
  pessoal e não vale aí.**
- Rode `impeccable context --target index.html` uma vez por sessão. Ele vai
  dizer `NO_PRODUCT_MD` e pedir `init` para comandos de construção. Para os
  refinamentos com escopo fechado do plano, isso **não bloqueia** (a própria
  saída diz `SCOPED_EXISTING_ALLOWED`). O `init` está listado como
  "depois dos blocos".
- O `.impeccable/config.json` do repo já traz as supressões do detector,
  cada uma com o motivo por escrito. **Não suprimir nada novo sem
  autorização do Guilherme.**

### Para verificação visual (escolha uma)

- **Playwright (recomendado, é o único jeito de testar mobile de verdade):**
  ```bash
  npx playwright install chromium
  ```
  Escreva os scripts de verificação numa pasta temporária (scratchpad), **não
  dentro do repo** — o projeto não tem `package.json` nem build, e deve
  continuar assim.
- **Claude in Chrome** (extensão), para inspeção no desktop. Não serve para
  mobile (ver memória 4).

### Também precisa

- `git` com acesso ao repo `guicarvalhal8/-zap-tag`.
- `python` (para o servidor estático local) e `node` (para `npx`).

---

## Onde o trabalho está

| Bloco | Tema | Situação |
|---|---|---|
| 1 | Defeitos (harden, layout, colorize) | **Feito**, commit `aead732` |
| 2.1 | Cards de casos de uso como links de WhatsApp (shape) | **Feito**, commit `aead732` |
| 2.2 | Reasseguramento do CTA final + prova social (clarify) | **Próximo** — esperando 3 respostas |
| 2.3 | Open Graph, Twitter card, canonical, JSON-LD (harden) | Pendente |
| 3 | Motion e performance (animate, optimize) | Pendente |
| 4 | Acabamento e P3 (adapt, polish, typeset, harden) | Pendente |
| Depois | critique + audit de novo, document, init | Pendente |

Placar de partida: **17/32** Design Health e **14/20** Audit Health, com o
detector em 0 achados (era 8). Meta: ≥ 24/32 e ≥ 18/20. As notas só mudam
quando `critique`/`audit` rodarem de novo, e vale fazer isso **depois do
bloco 2**.

---

## Os blocos em detalhe

Cada item diz o comando, o que fazer, os arquivos e como verificar. O
`IMPECCABLE.md` tem o mesmo plano com linhas de código e o histórico do que
já foi feito.

### Bloco 1 — defeitos (FEITO)

Só para contexto; não refazer. Resumo do que mudou:
- 6 cards de casos de uso saíram do `innerHTML` e foram para o HTML; os CTAs
  ganharam `href` real; entrou `<noscript>`; cada `init` roda isolado com
  try/catch (`run()` em `js/main.js`).
- Hambúrguer escondido no desktop (a media query estava antes da regra base).
- Trilha de "Como funciona" alinhada (custom properties no ancestral comum) e
  altura mobile medida (`syncHowTrack()`), em vez do número mágico.
- Token `--color-border-strong` (4,0:1) para bordas com significado.
- Anel de foco ciano próprio; `Esc` devolve o foco ao hambúrguer.

### Bloco 2 — conversão

#### 2.1 — Cards como links (FEITO)
- Estrutura: `li.usecases__item > a.usecase-card`, com `data-wa-message`
  próprio ("Olá! Vi o site da Zap Tag e quero o adesivo de {caso}.") e
  rótulo "Quero esse →".
- Nome acessível: `aria-labelledby="uc-title-N uc-cta-N"`. **Um 7º card
  precisa de ids novos.**
- Hover só atrás de `@media (hover: hover)`; no toque, `:active` lime e
  `-webkit-tap-highlight-color: transparent`.
- Extra corrigido: o menu mobile fechado ocupava 41px sob a navbar (padding
  que o `0fr` não colapsa).

#### 2.2 — Reasseguramento sem preço + prova social (PRÓXIMO)
**Comando:** `/impeccable clarify` no `.final-cta` e no slot de prova social.

**Antes de começar, pergunte ao Guilherme** (ver [Próximo passo](#próximo-passo-bloco-2-item-2)).

O que fazer:
1. Reescrever o subtítulo do `.final-cta`. O "sem mensalidade
   **obrigatória**" introduz exatamente a suspeita que quer dissolver.
2. **Nomear o próximo passo** depois da mensagem (o que acontece quando a
   pessoa chama no WhatsApp), sem publicar preço.
3. Subir o "Resposta em poucos minutos" para **cima** do botão (hoje está
   depois; a pessoa precisa ler isso antes de decidir clicar).
4. Preencher o slot de prova social, já reservado no HTML entre "Casos de
   uso" e o CTA final (procure o comentário "PRÓXIMAS SEÇÕES"), só com o que
   é verdade hoje: `@zap_tag_`, área de atendimento confirmada e foto real se
   existir. **Não inventar depoimento, número de clientes nem logos.**

Verificar: copy lida em 390 e 1440 sem viúva no meio de frase; detector `[]`;
console limpo.

#### 2.3 — Metadados de compartilhamento
**Comando:** `/impeccable harden`.

A landing vive de ser colada em conversa de WhatsApp e hoje tem **zero** tags
sociais.
1. Open Graph completo (`og:title`, `og:description`, `og:type`, `og:url`,
   `og:image`, `og:locale=pt_BR`), Twitter card `summary_large_image` e
   `<link rel="canonical">`, com base em `https://zap-tag.onrender.com/`
   (confirmar o domínio definitivo com o Guilherme).
2. JSON-LD `LocalBusiness` com os contatos reais (e área de atendimento, se
   confirmada no 2.2).
3. `og:image` **1200×630, URL absoluta**. Base: `assets/logo-zaptag.jpg`
   (317 KB, versionado e não referenciado em lugar nenhum). Gerar a imagem de
   compartilhamento a partir dele (neon sobre preto) e **tirar o JPG original
   do diretório servido**.

Verificar: validar a prévia (por exemplo, o Sharing Debugger do Facebook)
depois do deploy, e também colando o link no WhatsApp.

### Bloco 3 — motion e performance

#### 3.1 — `/impeccable animate`
1. **Travar o reveal depois da primeira passagem completa** de cada seção
   (decisão do dono). Hoje `initHowSteps`, `initCompare`, `initUseCases` e
   `initFinalCta` removem `is-visible` quando a seção sai da tela e refazem a
   animação ao voltar. Depois da primeira sequência completa, desligar o
   observer (cuidado: "completa" = todos os timers do stagger terminaram; se
   sair no meio, pode refazer).
2. `.hero__scroll-hint-line`: única animação `infinite` do CSS e a única fora
   do bloco de `prefers-reduced-motion`. Cobrir.
3. `html { scroll-behavior: smooth }`: gatilho vestibular mais forte da
   página. Mover para dentro de `@media (prefers-reduced-motion: no-preference)`.
4. `initHeroReveal()` é o único dos inits que não consulta reduced motion.
   Dar a ele o branch.

#### 3.2 — `/impeccable optimize`
1. `initCardTilt()` (`js/usecases.js`) lê `getBoundingClientRect()` e escreve
   `style.transform` no mesmo `mousemove`, sem `requestAnimationFrame`.
   Cachear o rect no `mouseenter` e escrever em rAF.
2. O `.usecase-card` tem `transition` com `transform 500ms`, então o tilt que
   deveria seguir o cursor chega meio segundo atrasado. Tirar `transform` da
   transição **enquanto o tilt está ativo** (sem perder o reveal de entrada).
3. `touch-demo:stop` (`js/touch-animation.js`) tem listener, mas **nenhum
   arquivo dispara esse evento**: o loop do Hero roda para sempre, sem gate de
   visibilidade. Pausar com IntersectionObserver e `visibilitychange`.

### Bloco 4 — acabamento e P3

#### 4.1 — `/impeccable adapt`
Alvos de toque para 44×44: hambúrguer (hoje 38×38), links do footer (~20px
de altura, e são os 3 contatos do negócio) e `.btn-primary--compact`. Usar
`min-height` no lugar de `height` na navbar. Nenhum desses é falha de WCAG AA;
é o guideline prático.

#### 4.2 — `/impeccable polish`
- `.final-cta__glow`: SVG sólido a `opacity: 0.16`, sem blur nem gradiente.
  Derruba o contraste do subtítulo de 7,7:1 para 5,2:1 e o do botão de 16,9:1
  para 11,3:1. Suavizar.
- Ícone de "Fidelidade" com ~45% do tamanho óptico dos irmãos.
- O raio da marca foi reaproveitado para significar "Pix". Rever.
- Hero: `showPanel()` liga e desliga no mesmo tick, gerando 320ms de
  sobreposição dos painéis.
- A marca aparece com 3 grafias (`zaptag` / `Zaptag` / `Zap Tag`). **Pergunte
  ao Guilherme qual é a oficial.**
- Pontuação inconsistente nos H2; âncora morta `#fale-conosco`.

#### 4.3 — `/impeccable typeset`
- Decidir `--font-display-alt` (Bricolage Grotesque): carregar e aplicar nos
  H2/H3, ou remover o token morto. Hoje o CSS promete 4 vozes tipográficas e
  a página entrega 1 de display.
- `text-wrap: balance` nos 4 títulos (3 dos 4 H2 têm viúva; no H1 o artigo
  "A" fica órfão onde começa a cor de acento).
- Trocar os 2 `font-size` em px absoluto.

#### 4.4 — `/impeccable harden`
- Landmark `contentinfo`: tirar o `<footer>` de dentro de
  `<main>`/`<section>` (permitido; o visual vem só de `border-top` +
  `padding-block`) ou usar `role="contentinfo"`.
- `aria-hidden="true"` nos 5 SVGs gerados por `js/touch-animation.js`, de
  preferência com uma função `svgIcon()` que injete o atributo.
- `role="list"` nas 5 listas com `list-style: none` (no Safari, os dois `<ol>`
  perdem a semântica **e** os números do `counter()`).
- Renomear `USE_CASES` → `TOUCH_DEMO_CASES` e `sleep` → `touchDemoSleep`
  (escopo global compartilhado, ver armadilhas).
- Fechar o menu mobile ao cruzar o breakpoint de 860px.

### Depois dos blocos
1. `/impeccable critique` e `/impeccable audit` de novo, para comparar com o
   placar de partida.
2. `/impeccable document` para gerar o `DESIGN.md` (não existe; o projeto tem
   sistema de tokens real).
3. `/impeccable init` para o `PRODUCT.md`, que depende de decisões de produto
   ainda abertas: preço, como funciona a venda e slogan de marca.

---

## Armadilhas que já derrubaram o site

1. **Os JS são scripts clássicos com escopo global compartilhado.** Um
   `const`/`function` com o mesmo nome em dois arquivos dá `SyntaxError`
   silencioso: nada no visual, só no console. Aconteceu duas vezes. Checar:
   `for f in js/*.js; do grep -hoE '^(const|let|var|function) [A-Za-z_$]+' "$f" | awk '{print $2}'; done | sort | uniq -d`
2. **Não usar `type="module"`**: o fluxo inclui abrir o HTML via `file://`,
   e módulos são bloqueados por CORS.
3. **`[data-reveal]` nasce em `opacity: 0`**: qualquer elemento novo com esse
   atributo depende de JS para aparecer.
4. **Custom property herda para baixo, nunca para o lado.** Para um irmão
   usar a variável, declare no ancestral comum.
5. **`grid-template-rows: 0fr` não colapsa padding nem borda** do elemento
   colapsado. Use margem nos filhos (recortada pelo `overflow: hidden`).
6. **Link do WhatsApp com texto:** sempre via `data-wa-message` +
   `initWhatsappLinks()` (`encodeURIComponent`), nunca escrito à mão no HTML.
7. **O repo é CRLF.** Os avisos "LF will be replaced by CRLF" são esperados.

---

## Próximo passo (bloco 2, item 2)

Pergunte ao Guilherme antes de escrever qualquer copy:

1. **Área de atendimento:** pode escrever "atendemos Goiânia e região"? Se
   não, qual é?
2. **Foto real:** existe alguma foto do adesivo aplicado (mesa, balcão,
   vitrine)? Se não, deixar o slot preparado sem inventar imagem.
3. **O que acontece depois da mensagem no WhatsApp?** (por exemplo: vocês
   respondem, entendem o negócio, mandam orçamento e entregam o adesivo
   configurado). Esse texto substitui o "sem mensalidade obrigatória".
