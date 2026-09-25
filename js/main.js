// initTouchAnimation vem de touch-animation.js (carregado antes deste arquivo).

const WHATSAPP_NUMBER = '5562982233133';

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const onScroll = () => {
        navbar.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

// Menu mobile: hambúrguer que vira X, painel desliza (grid-template-rows,
// sem display:none abrupto — mesmo truque do expand de "Casos de uso").
function initNavbarMenu() {
    const toggle = document.getElementById('navbar-toggle');
    const menu = document.getElementById('navbar-mobile');
    if (!toggle || !menu) return;

    const closeMenu = () => {
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
        menu.classList.remove('is-open');
    };

    toggle.addEventListener('click', () => {
        const willOpen = !menu.classList.contains('is-open');
        toggle.classList.toggle('is-open', willOpen);
        menu.classList.toggle('is-open', willOpen);
        toggle.setAttribute('aria-expanded', String(willOpen));
        toggle.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
    });

    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        if (!menu.classList.contains('is-open')) return;
        closeMenu();
        // Devolve o foco a quem abriu. Sem isto, fechar por Esc deixava o
        // foco num link que o CSS acabou de esconder (`visibility: hidden`),
        // e a próxima tecla Tab recomeçava do topo do documento.
        toggle.focus();
    });

    // Tocar fora do menu (ou do hambúrguer) fecha — antes só Esc ou um link
    // interno fechavam, e o gesto mais natural em celular (tocar em outro
    // lugar da tela) não fazia nada.
    document.addEventListener('click', (event) => {
        if (!menu.classList.contains('is-open')) return;
        if (menu.contains(event.target) || toggle.contains(event.target)) return;
        closeMenu();
    });

    // O hambúrguer some acima de 860px (CSS), mas o estado `is-open` sozinho
    // não — se o menu ficasse aberto num celular deitado e a janela crescesse
    // (ou o DevTools redimensionasse) pra além do breakpoint, ele reaparecia
    // já aberto ao encolher de novo.
    const desktopQuery = window.matchMedia('(min-width: 860px)');
    desktopQuery.addEventListener('change', (event) => {
        if (event.matches) closeMenu();
    });
}

function initHeroReveal() {
    const items = document.querySelectorAll('.hero [data-reveal]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    items.forEach((el, i) => {
        if (reducedMotion) {
            el.classList.add('is-visible');
        } else {
            setTimeout(() => el.classList.add('is-visible'), 120 * i);
        }
    });
}

function initWhatsappLinks() {
    document.querySelectorAll('[data-wa-message]').forEach((link) => {
        const message = link.dataset.waMessage;
        link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    });
}

// Seção "Como funciona" (fundida com o antigo "Diferencial vs. QR code"):
// a coluna Zap Tag entra rápido (90ms entre passos) e a coluna QR devagar
// (180ms) — a diferença de ritmo mostra a diferença de espera antes mesmo
// da pessoa ler o texto. Slogan de destaque entra depois, com scale-in
// próprio (ver CSS), seguido pelos três diferenciais. Se a seção sair de
// vista no meio, desfaz e refaz na próxima entrada; depois de uma passagem
// completa, trava no estado final.
function initCompare() {
    const section = document.querySelector('.compare');
    if (!section) return;

    const headerItems = section.querySelectorAll('.section-header [data-reveal]');
    const qrSteps = section.querySelectorAll('.compare__column--qr .compare__step');
    const zaptagSteps = section.querySelectorAll('.compare__column--zaptag .compare__step');
    const slogan = section.querySelector('.compare__slogan');
    const cta = section.querySelector('.compare__cta');
    const facts = section.querySelector('.compare__facts');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timers = [];
    // A trava: os facts (720ms) são o último evento
    // agendado por show(), então marcam o fim de uma passagem completa.
    let observer = null;

    const clearTimers = () => {
        timers.forEach((id) => clearTimeout(id));
        timers = [];
    };

    const stagger = (items, delay) => {
        items.forEach((item, i) => {
            const id = setTimeout(() => item.classList.add('is-visible'), reducedMotion ? 0 : i * delay);
            timers.push(id);
        });
    };

    const show = () => {
        clearTimers();
        headerItems.forEach((el) => el.classList.add('is-visible'));
        stagger(qrSteps, 180);
        stagger(zaptagSteps, 90);
        timers.push(setTimeout(() => slogan && slogan.classList.add('is-visible'), reducedMotion ? 0 : 550));
        // O botão entra junto com os facts, logo depois do slogan: é o
        // "e agora?" do argumento, não uma peça que compete com ele.
        timers.push(setTimeout(() => {
            if (cta) cta.classList.add('is-visible');
            if (facts) facts.classList.add('is-visible');
            if (observer) observer.disconnect();
        }, reducedMotion ? 0 : 720));
    };

    const hide = () => {
        clearTimers();
        headerItems.forEach((el) => el.classList.remove('is-visible'));
        qrSteps.forEach((el) => el.classList.remove('is-visible'));
        zaptagSteps.forEach((el) => el.classList.remove('is-visible'));
        if (slogan) slogan.classList.remove('is-visible');
        if (cta) cta.classList.remove('is-visible');
        if (facts) facts.classList.remove('is-visible');
    };

    if (reducedMotion) {
        show();
        return;
    }

    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                show();
            } else {
                hide();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(section);
}

// CTA final: bloco único, fade + slide-up ao entrar no viewport, sem
// stagger (não é uma lista de itens). Some de novo ao sair da tela.
function initFinalCta() {
    const section = document.querySelector('.final-cta');
    if (!section) return;
    const block = section.querySelector('[data-reveal]');
    if (!block) return;

    // A prévia da conversa mostra a MESMA mensagem que o botão envia: lê do
    // data-wa-message, pra as duas nunca ficarem diferentes.
    const button = document.getElementById('final-cta-button');
    const bubbleText = section.querySelector('.wa-preview__text');
    if (button && bubbleText && button.dataset.waMessage) {
        bubbleText.textContent = button.dataset.waMessage;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
        block.classList.add('is-visible');
        return;
    }
    section.classList.add('final-cta--animate');

    // Sem stagger aqui — a própria entrada em viewport já é "a sequência
    // completa", então trava e desliga o observer na primeira vez que aparece.
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                block.classList.add('is-visible');
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });
    observer.observe(block);
}

// Etiquetas em volta da demo do Hero (só aparecem a partir de 1200px): a do
// caso que o celular acabou de abrir acende. "idle" apaga todas.
function initHeroChips() {
    const demo = document.querySelector('.hero__demo');
    if (!demo) return;
    const chips = demo.querySelectorAll('.hero__chip');
    demo.addEventListener('touch-demo:open', (event) => {
        chips.forEach((chip) => {
            chip.classList.toggle('is-active', chip.dataset.case === event.detail.key);
        });
    });
}

// Formatos: cada objeto entra quando chega na tela, UM POR VEZ. Se vários
// cruzam o gatilho juntos (uma linha inteira da grade, ou quem chega pelo
// link #formatos), eles vão pra uma fila e saem em ordem, a cada 240ms.
// Depois de revelado, fica: mesma trava das outras seções.
function initFormats() {
    const section = document.querySelector('.formats');
    if (!section) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const items = Array.from(section.querySelectorAll('.format'));
    section.classList.add('formats--animate');

    const queue = [];
    let draining = false;

    const drain = () => {
        if (!queue.length) { draining = false; return; }
        draining = true;
        queue.sort((a, b) => items.indexOf(a) - items.indexOf(b));
        queue.shift().classList.add('is-visible');
        setTimeout(drain, 240);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            queue.push(entry.target);
        });
        if (!draining) drain();
    // -30% embaixo: o gatilho fica no terço de baixo da tela, então a 2ª
    // linha da grade espera a pessoa rolar, mesmo em monitor alto.
    }, { threshold: 0.35, rootMargin: '0px 0px -30% 0px' });

    items.forEach((item) => observer.observe(item));
}

// Rede de segurança: mostra tudo que depende de JS pra aparecer. Chamada
// quando algum init falha — a página perde a animação, não o conteúdo.
function revealEverything() {
    document
        .querySelectorAll('[data-reveal], .usecase-card, .compare__slogan, .format')
        .forEach((el) => el.classList.add('is-visible'));
}

// Cada init roda ISOLADO, e isso não é paranoia genérica: o modo de falha
// histórico deste projeto (duas vezes) foi um SyntaxError num dos js/*.js
// com o JavaScript perfeitamente ligado. Como os três scripts são clássicos
// e compartilham escopo global, um `const` repetido fazia o arquivo inteiro
// não executar; a função dele deixava de existir; a chamada aqui lançava
// ReferenceError; e o callback ABORTAVA no meio, levando embora todos os
// inits seguintes. Foi assim que o CTA de fechamento ficou invisível sem
// nada no visual indicando a causa.
// O <noscript> do index.html cobre o caso de JS desligado ou bloqueado.
// Isto cobre o caso de JS ligado que quebra — que é o mais provável aqui.
function run(name, fn) {
    try {
        fn();
    } catch (error) {
        console.error(`[zaptag] ${name} falhou, seguindo sem ele:`, error);
        revealEverything();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    run('initNavbarScroll', initNavbarScroll);
    run('initNavbarMenu', initNavbarMenu);
    run('initHeroReveal', initHeroReveal);
    run('initWhatsappLinks', initWhatsappLinks);
    run('initHeroChips', initHeroChips);
    run('initTouchAnimation', () => initTouchAnimation(document.getElementById('hero-touch-demo')));
    run('initCompare', initCompare);
    run('initUseCases', initUseCases);
    run('initFormats', initFormats);
    run('initShowcase', initShowcase);
    run('initFinalCta', initFinalCta);
});
