# Passagem de contexto: o que continuar no computador do trabalho

> Escrito em 2026-09-22 pelo Claude Code da máquina pessoal, para o Claude Code
> do computador do trabalho. **Se você é esse Claude: siga a "Ordem de
> execução" no fim deste arquivo.**

## Onde paramos

Sua última sessão terminou no commit `f1bc249`, com o plano do `IMPECCABLE.md`
100% completo. Depois disso, na máquina pessoal, entraram 5 commits:

| Commit | O que fez |
|---|---|
| `8f250b7` | Slogan da marca definido: **"Encostou, ativou."** Aparece também no rodapé, embaixo da logo. |
| `410b893` | Nome fantasia definido: **"Zap Tag"**, sem complemento. Ainda não existe CNPJ. |
| `f61f861` | Quatro mudanças grandes: ícone oficial do WhatsApp nos botões; "Como funciona" e "Diferencial vs. QR code" **fundidas numa seção só** (`section.compare#como-funciona`); silhueta da tag como forma de interface (botão primário, selo dos ícones de casos de uso, marcador de passo); **Hero interativo** (arrastar com mouse, tocar no celular, Enter no teclado). |
| `ea2e72b` | Placar do `IMPECCABLE.md` atualizado. |
| `1c9aa2f` | Nova rodada de `critique` + `audit` deu **22/32 e 16/20**. Os 3 P1 e os defeitos da demo foram corrigidos no mesmo dia. |

O detalhe de cada um está no `MEMORY.md`. As regras visuais novas (forma da
tag, entrelinha dos títulos) estão no `DESIGN.md`. O que vale de produto
(slogan, nome fantasia) está no `PRODUCT.md`.

## Próximo trabalho, em ordem

Os itens abaixo são os P2 que sobraram da crítica de 22/09
(`.impeccable/critique/2026-09-22T15-28-49Z__index-html.md` existe só na
máquina pessoal, porque a pasta está no `.gitignore`; o resumo está aqui).

### 1. Hero mobile (`/impeccable adapt`), o mais importante

O público principal (dono de negócio) está no celular, e a primeira tela do
celular é a mais fraca da página.

- **A demo fica abaixo da dobra.** Em 390×844, o celular da demo começa em
  y≈553 e a instrução "Toque no celular…" em y≈951. Encolher o celular da
  demo só no mobile (ex.: ~128×228) e trazer a instrução pra junto dele.
- **O nome da marca não aparece na primeira tela.** `.logo__wordmark` tem
  `display: none` abaixo de 768px. Cabe em 390px ao lado do hambúrguer.
- **A linha de "role para baixo" corta a instrução da demo.** Esconder
  `.hero__scroll-hint` abaixo de 960px.
- Verificar em 390 e 320 com Playwright (ver "Como testar" abaixo).

### 2. Reasseguramento no CTA final (`/impeccable clarify`)

- **A frase de reasseguramento está fraca.** `.final-cta__trust` ("Sem
  compromisso — você decide depois de saber o valor. Resposta em poucos
  minutos.") tem 13px em cinza. É o texto mais fraco do bloco, justo no
  momento de maior ansiedade. Subir para 15–16px, em `--color-text`.
- **Falta o horário de atendimento.** "Resposta em poucos minutos" deveria
  virar o horário real. **Perguntar ao dono**; ele ainda não passou esse dado.
- **"Atendemos Anápolis e região" está escondido** na faixa de confiança,
  longe do botão. Considerar levar pra perto do CTA.

### 3. Acabamento (`/impeccable polish`)

- **Ícones semanticamente errados:** o Wi-Fi usa barras de sinal de celular e
  o Pix usa um check genérico (na demo do Hero e nos cards).
- **Glows parados:** `.hero__glow` e `.final-cta__glow` contradizem a regra
  Flat-At-Rest do `DESIGN.md`. **Perguntar ao dono** se o documento muda ou o
  código muda.
- **Cor da barra do navegador:** falta
  `<meta name="theme-color" content="#0B0D0F">`.
- **Alvo de toque pequeno:** `.link-secondary` ("Ver como funciona") tem 23px
  de altura, abaixo da regra de 44px do projeto.
- **Texto abaixo do piso:** `.touch-demo__panel-idle` tem 11,2px, e o piso do
  `DESIGN.md` é 12px.
- **Nomes globais sem prefixo:** `TAG_ICON`, `CHECK_ICON` e `svgIcon` em
  `touch-animation.js`. É o mesmo tipo de nome que já quebrou o site duas
  vezes; renomear para `TOUCH_DEMO_*`.
- **Hover do botão primário:** o `scale` + `drop-shadow` do `.btn-primary`
  fica fora de `@media (hover: hover)` e "gruda" depois do toque no celular.

### 4. Fechar o ciclo

Depois dos itens acima, rodar `/impeccable critique` + `/impeccable audit` de
novo (A e B como subagentes isolados, mais um terceiro para o audit) e
atualizar o placar do `IMPECCABLE.md`. Meta: ≥ 24/32 e ≥ 18/20.

## Decisões já tomadas: não perguntar de novo

- **Hexes da paleta:** intocáveis. Token novo pode ser criado.
- **Canal de conversão:** WhatsApp é o único, de propósito.
- **Preço:** nunca aparece na página.
- **Prova social:** nunca fabricar. Não existe foto real do adesivo, nem
  depoimento, nem contagem de clientes.
- **Fontes:** as 4 famílias ficam.
- **Rodapé:** continua aninhado dentro do CTA final, por decisão do dono.
- **Demo no celular:** no touch é toque, não arraste. Arrastar prenderia a
  rolagem da página numa área de 168×300px.
- **Compatibilidade:** o dono confirmou que o adesivo funciona em iPhone e
  Android. Na página está "Funciona em iPhone e Android que pagam por
  aproximação".
- **"Contrato":** a palavra saiu da copy; agora é "combina tudo por escrito".
- **Domínio próprio:** ainda não foi comprado. O site continua em
  `zap-tag.onrender.com`.

## Armadilhas novas desta rodada

- **Cascata de mesma especificidade.** Foi a causa de três bugs até agora:
  hambúrguer no desktop, `--compact` que nunca ficava compacto, e foco
  invisível no celular da demo. Regra de componente que mexe em `outline`
  precisa repor o `:focus-visible`.
- **Posição do celular da demo em dois lugares.** Repouso (`-40px`) e contato
  (`22px`) estão em `touch-animation.js` (`TOUCH_DEMO_REST` /
  `TOUCH_DEMO_CONTACT`) e em `global.css`. Mudou um, muda o outro.
- **Detector:** passar só o markup (`impeccable detect --json index.html`).
  Passar o CSS direto infla a contagem de avisos.
- **Heredoc no shell:** o Bash do Claude Code quebrou heredocs longos com
  crases e aspas. Para editar com script, gravar o `.py` com a ferramenta
  Write e rodar o arquivo.

## Como testar

Playwright é o caminho para o mobile. Se não estiver no cache do npx dessa
máquina, rodar `npx playwright install chromium`. Viewports: 1440×900 e
390×844 (`isMobile: true, hasTouch: true`), e 320 para overflow. Os reveals
disparam no scroll: posicionar com `window.scrollTo`, esperar ~1,5s e usar
`page.screenshot()`. Medir com `getComputedStyle` e `getBoundingClientRect`
em vez de julgar a olho.

## Ordem de execução (para o Claude do trabalho)

1. `git pull` e ler este arquivo inteiro.
2. Ler `CLAUDE.md`, `MEMORY.md`, `PRODUCT.md`, `DESIGN.md` e `IMPECCABLE.md`.
3. Atualizar a sua memória persistente com o que mudou: slogan, nome
   fantasia, a seção fundida, o Hero interativo, a forma da tag e as notas
   22/32 e 16/20.
4. Confirmar que o `/impeccable` está disponível (nessa máquina ele está
   instalado global).
5. Tirar este arquivo do repositório com `git rm HANDOFF-CLAUDE.md` e um
   commit. **O push, só depois de perguntar ao dono.**
6. Perguntar ao dono por onde começar. A sugestão é o item 1 (Hero mobile).
   Se ele quiser o item 2, perguntar antes o horário de atendimento real.
