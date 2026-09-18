# Zap Tag — instruções de trabalho

Este arquivo é carregado automaticamente pelo Claude Code sempre que eu trabalho
nesta pasta. **Antes de fazer qualquer coisa, leia também `MEMORY.md`** — lá
fica o histórico de decisões, o que já foi feito e o que falta.

## O que é a Zap Tag

Empresa que vende **adesivos NFC** (etiquetas com chip de aproximação) para
criar automações físicas simples. O cliente encosta o celular no adesivo e ele
dispara uma ação, sem precisar de app. Casos de uso principais:

- Abrir direto a tela de **avaliação no Google** (Google Reviews) — pra
  negócios coletarem mais avaliações 5 estrelas.
- Abrir o **cardápio digital** de restaurantes/bares.
- Automatizar **cobrança via Pix** (encostar e já cair na tela de pagamento).
- Outras automações no mesmo espírito: encostar o celular = ação instantânea.

Detalhes de produto, preço, diferenciais e identidade visual ainda **não**
foram definidos — completar conforme o usuário for passando.

## Escopo deste repositório

Vai ser o **site institucional/landing page** da Zap Tag, no mesmo espírito do
projeto irmão `../s7-erp-landing` (site da SN Sistemas). Ainda não existe
código aqui — este é o ponto de partida.

## Convenções deste projeto

Diferente do s7-erp-landing (que usa Tailwind CDN): a Zap Tag tem uma spec de
design própria (cores/fontes em variáveis CSS, ver `css/global.css`), então
o stack aqui é **HTML semântico + CSS próprio + JS em módulos ES nativos**,
sem framework CSS e sem build step. Manter assim:

- `css/global.css` é a fonte única das variáveis de design (`--color-*`,
  `--font-*`). **Nunca hardcodar hex ou nome de fonte direto num componente**
  — sempre via `var(--...)`.
- Fontes: Space Grotesk (display/H1), Bricolage Grotesque (H2/H3, ainda não
  carregada), Unbounded (números de destaque, ainda não carregada), Manrope
  (corpo/UI). Só adicionar uma fonte ao `<link>` do Google Fonts quando a
  seção que a usa for de fato construída — não carregar fonte à toa.
- JS em `js/*.js`, carregado como **script clássico** (`<script src="...">`,
  sem `type="module"`) — ES modules são bloqueados por CORS quando o HTML é
  aberto direto via `file://`, e o fluxo de trabalho aqui é sempre abrir o
  arquivo direto, sem servidor. Ordem dos `<script>` no HTML importa: quem
  define funções compartilhadas (ex: `touch-animation.js`) vem antes de quem
  as usa (`main.js`). Componentes reutilizáveis expõem uma função
  `init...()` global que recebe o elemento host e renderiza nele.
  - **Cuidado:** scripts clássicos compartilham o mesmo escopo global. Um
    `const`/`function` de mesmo nome em dois arquivos `js/*.js` quebra
    silenciosamente (`SyntaxError` no console, nada visível na página) —
    já aconteceu com `USE_CASES` duplicado entre `touch-animation.js` e
    `usecases.js` (ver MEMORY.md). Prefixar nomes de dados por
    arquivo/seção (ex: `USECASES_LIST`) ao criar um novo arquivo JS.
- Conteúdo em **pt-BR**, tom direto e comercial, sem emoji no código/copy.
- Mobile-first; testar em telas pequenas antes de dar por pronto.
- CTA principal é **WhatsApp** — construir o link via JS
  (`wa.me/<numero>?text=<mensagem>`) usando `encodeURIComponent`, nunca à mão
  no HTML (acentuação quebra fácil se codificada manualmente).
- Animações/demos de produto: preferir SVG leve + CSS/Web Animations API
  (sem vídeo/Lottie pesado) enquanto não houver assets hospedados no
  Supabase, como fizemos no Hero.
- Respeitar `prefers-reduced-motion` em qualquer animação em loop.
- Ao terminar uma seção/etapa: validar que as tags HTML fecham corretamente,
  abrir no navegador pra conferir visualmente, e só então commitar.

## Fluxo de trabalho com o usuário

- Trabalhamos seção por seção (como no s7-erp-landing): adiciona uma parte,
  usuário confere no navegador, só commita/dá push quando ele pedir
  explicitamente.
- Sempre que uma sessão terminar ou for retomada, atualizar `MEMORY.md` com o
  que mudou — não deixar esse arquivo desatualizado.
