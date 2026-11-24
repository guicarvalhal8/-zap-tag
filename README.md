# Zap Tag

**Encostou, ativou.**

Landing page da Zap Tag — adesivos NFC que disparam uma ação instantânea quando o cliente encosta o celular: avaliação no Google, cardápio digital, Wi-Fi automático, cobrança via Pix, fidelidade ou ficha de contato. Sem app, sem cadastro.

🔗 **Site no ar:** [zap-tag.onrender.com](https://zap-tag.onrender.com) *(domínio provisório — ainda não foi comprado um domínio próprio)*

## Stack

HTML semântico + CSS próprio + JavaScript puro, sem framework e sem build step. Os 3 arquivos `js/*.js` são carregados como scripts clássicos (não `type="module"`), de propósito — ver `CLAUDE.md` para o porquê.

```
index.html            Página única
css/global.css         Todas as variáveis de design (--color-*, --font-*) e estilos
js/main.js              Navbar, reveals por scroll, seções "Como funciona"/"Casos de uso"/CTA final
js/touch-animation.js   Demo interativa do Hero (arrastar/tocar/teclado)
js/usecases.js          Comportamento dos cards de caso de uso (tilt, expand/collapse)
assets/                  Favicon e imagem de compartilhamento (og-image)
design-reference/       Logo original, só referência — não é servida pela página
```

## Rodar localmente

Sem build. Basta servir a pasta com qualquer servidor estático:

```bash
python -m http.server 8777
# ou
npx serve .
```

Depois abra `http://localhost:8777`.

## Documentação do projeto

| Arquivo | O que tem |
|---|---|
| [`PRODUCT.md`](PRODUCT.md) | Usuários, posicionamento, preço, restrições — verdade de produto |
| [`DESIGN.md`](DESIGN.md) | Sistema de design: cores, tipografia, componentes, regras nomeadas |
| [`CLAUDE.md`](CLAUDE.md) | Convenções técnicas do repositório |
| [`MEMORY.md`](MEMORY.md) | Histórico vivo de decisões e mudanças, sessão por sessão |
| [`IMPECCABLE.md`](IMPECCABLE.md) | Plano e placar de qualidade (critique/audit), feito com a skill `impeccable` |

## Estado atual

- **Design Health:** 27/32 (Bom)
- **Audit Health:** 17/20 (Bom)
- Detector de qualidade (`impeccable detect`): 0 achados

Placar completo e histórico de cada rodada em `IMPECCABLE.md`.

## Contato

- WhatsApp: [+55 62 98223-3133](https://wa.me/5562982233133)
- Instagram: [@zap_tag_](https://instagram.com/zap_tag_)
- E-mail: usezaptag@gmail.com
