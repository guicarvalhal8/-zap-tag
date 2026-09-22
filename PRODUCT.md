# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primário:** donos de pequenos negócios locais com atendimento presencial (restaurantes, bares, salões) em Anápolis e região, que decidem comprar o adesivo NFC. A compra não é self-service: eles compram e a Zap Tag configura o adesivo pra eles, pro caso de uso escolhido.

**Ator secundário (não é quem decide a compra):** o cliente final do negócio, que encosta o celular no adesivo pra disparar a ação (avaliação, cardápio, Wi-Fi, Pix, fidelidade, contato). O produto precisa funcionar bem pra essa pessoa mesmo que ela nunca converse diretamente com a Zap Tag.

## Product Purpose

Adesivos NFC que disparam uma ação instantânea quando o celular do cliente encosta — sem app, sem cadastro, sem baixar nada. Existe pra fechar o vão entre "o cliente quer fazer algo simples" (avaliar, pagar, conectar no Wi-Fi, ver o cardápio) e o negócio conseguir captar isso sem esforço manual repetido. Sucesso = mais avaliações no Google, menos fricção operacional (gritar senha de Wi-Fi, digitar chave Pix errada, reimprimir cardápio), mais fidelização — sem o negócio precisar manter um app próprio.

## Positioning

Mecanismo concreto e diferente do concorrente direto óbvio, o QR code: encostar é 2 passos (aproximar o celular, a ação abre) contra os 4 do QR (abrir câmera, focar, esperar reconhecer, às vezes cair em anúncio ou app store). A diferença não é alegada, é demonstrada na própria página (seção "Diferencial vs. QR code"). A tecnologia de gravação e redirecionamento é solução própria da Zap Tag, não revenda de plataforma terceirizada.

## Operating Context

O adesivo é instalado fisicamente no ambiente do negócio (mesa, balcão, vitrine). A Zap Tag configura cada adesivo pro caso de uso do cliente — não é um produto de prateleira que o dono do negócio configura sozinho. O canal de vendas e suporte é o WhatsApp; o site funciona como vitrine e qualificação de lead, não como checkout. O fluxo comercial hoje: conversa no WhatsApp → Zap Tag entende o negócio → contrato simples → produção/configuração do adesivo.

## Capabilities and Constraints

- **6 casos de uso confirmados hoje:** avaliação no Google, cardápio digital, Wi-Fi automático, Pix, fidelidade, ficha de contato.
- **Preço:** ainda não fechado num modelo único — hoje a expectativa interna é algo entre R$60–80 por unidade, com possibilidade de recorrência mensal negociada em contratos de várias unidades. Múltiplas variáveis em aberto (volume, recorrência ou não). **Não publicar preço na página** — decisão deliberada, não um esquecimento; o valor só é discutido na conversa.
- **Tecnologia proprietária:** a própria Zap Tag grava os adesivos e controla os redirecionamentos.
- **Canal único de conversão:** WhatsApp. Decisão deliberada (confirmada em 2026-09-22 numa rodada de critique) — não introduzir um segundo canal (telefone visível, formulário) como alternativa sem pedido explícito do dono.
- **Área de atendimento:** Anápolis e região.

## Brand Commitments

- **Nome:** Zap Tag.
- **Slogan da marca:** "Encostou, ativou." (definido em 2026-09-22). Vale para a marca inteira — rodapé do site, bio do Instagram, adesivo, material impresso — e não só para a seção "Diferencial vs. QR code", onde nasceu. As duas palavras espelham os dois passos do produto contra os quatro do QR code.
- **Identidade visual travada:** logo, paleta de cores e sistema visual são intocáveis por palavras do dono — documentados em `DESIGN.md` (Volt Lime = ação, Circuit Cyan = interação do sistema, sobre fundo quase-preto). Token novo pode ser criado; hex existente não muda sem decisão consciente dele.
- **Contatos reais:** WhatsApp `5562982233133`, e-mail `usezaptag@gmail.com`, Instagram `@zap_tag_`.
- **Voz:** pt-BR, direta e coloquial, sem jargão técnico (“NFC”, “IoT”) na copy visível — a copy nomeia o resultado concreto pro cliente, não a tecnologia por trás.

## Evidence on Hand

- **Nenhum depoimento real, nenhuma contagem de clientes, nenhuma foto real de adesivo instalado ainda** — o negócio está em estágio inicial, só há protótipos hoje (confirmado pelo dono em 2026-09-22). Trabalho futuro não deve fabricar prova social até que ela exista de verdade — nem depoimento, nem "N clientes", nem foto.
- Logo original em `design-reference/logo-zaptag.jpg` (referência de design, não servida pela página).

## Product Principles

1. **Fricção é o produto.** Cada decisão de UX deve reduzir passos entre "o cliente quer algo simples" e a ação acontecer — é a razão de existir frente ao QR code, não um detalhe de polimento.
2. **Preço nunca aparece publicamente antes da conversa.** A confiança se constrói na conversa via WhatsApp, não numa tabela de preços — a página existe pra qualificar o interesse, não pra fechar a venda sozinha.
3. **WhatsApp é o único canal de conversão.** Nenhuma feature nova deve introduzir um segundo caminho de contato como substituto, sem decisão explícita do dono.
4. **Nunca fabricar prova social.** Enquanto não houver depoimento, contagem de clientes ou foto real, a página não finge que eles existem.
5. **A Zap Tag configura, o cliente não se autosserve.** A tecnologia é proprietária e o adesivo chega pronto — isso molda a copy (fala de "conversa" e "contrato", não de "configure você mesmo").

## Accessibility & Inclusion

Nenhum requisito de acessibilidade específico foi levantado pelo dono além da prática geral já perseguida no código (WCAG AA como padrão, com achados e correções documentados em `IMPECCABLE.md` e `MEMORY.md` — contraste medido, `prefers-reduced-motion` tratado em tudo, foco por teclado visível em toda a página).
