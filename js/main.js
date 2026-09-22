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

// Seção "Como funciona": passos entram em sequência ao rolar até lá, e a
// trilha conectora acende junto com cada passo. Ao sair da tela (pra cima
// ou pra baixo), desfaz tudo — se o usuário voltar, a sequência roda de novo
// do zero, em vez de ficar só marcada como "já vista".
// A trilha vertical do mobile precisa ir do centro do 1º ícone ao centro do
// 3º, e essa distância depende da altura REAL do passo — a descrição quebra
// em 2 ou 3 linhas conforme a largura, porque está presa a ~26 caracteres por
// linha pelo `max-width: 26ch`. O CSS assumia 148px fixos (`--how-card-h`) e
// o passo mede 158px já com 2 linhas, então a trilha parava ~20px antes do
// terceiro ícone em toda largura mobile. Aqui a altura é medida em vez de
// estimada.
//
// Isto é leitura de layout, mas não é o padrão de thrash: são duas leituras
// (init e resize), não uma por evento contínuo. O `transform` do reveal não
// contamina a medida porque os dois ícones estão deslocados igualmente e o
// que interessa é a diferença entre eles.
function syncHowTrack(section) {
    const wrap = section.querySelector('.how__steps-wrap');
    const icons = section.querySelectorAll('.how__step-icon');
    if (!wrap || icons.length < 2) return;

    const first = icons[0].getBoundingClientRect();
    const last = icons[icons.length - 1].getBoundingClientRect();
    const height = (last.top + last.height / 2) - (first.top + first.height / 2);

    // No desktop os ícones ficam lado a lado e a distância vertical é 0 — não
    // tem problema, a media query de 900px sobrescreve a altura com 2px.
    wrap.style.setProperty('--how-track-h', `${Math.max(0, Math.round(height))}px`);
}

function initHowSteps() {
    const section = document.querySelector('.how');
    if (!section) return;

    syncHowTrack(section);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => syncHowTrack(section), 150);
    });

    // As fontes do Google chegam depois do primeiro paint e mudam a altura da
    // descrição, então remede quando elas assentarem.
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => syncHowTrack(section));
    }

    const steps = section.querySelectorAll('.how__step');
    const fill = section.querySelector('.how__track-fill');
    const headerItems = section.querySelectorAll('.section-header [data-reveal]');
    if (!steps.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timers = [];
    // Decisão do dono: a sequência desconstrói/reconstrói ao rolar, mas só até
    // terminar de rodar uma vez inteira — depois disso trava no estado final e
    // o observer desliga. "Completa" = o timer do último passo disparou; se a
    // seção sair de vista no meio, hide() cancela os timers pendentes e a
    // próxima entrada refaz a sequência do zero (comportamento de antes).
    let observer = null;

    const clearTimers = () => {
        timers.forEach((id) => clearTimeout(id));
        timers = [];
    };

    const show = () => {
        clearTimers();
        headerItems.forEach((el) => el.classList.add('is-visible'));
        steps.forEach((step, i) => {
            const id = setTimeout(() => {
                step.classList.add('is-visible');
                if (fill) fill.style.setProperty('--how-fill', (i + 1) / steps.length);
                if (i === steps.length - 1 && observer) observer.disconnect();
            }, reducedMotion ? 0 : i * 180);
            timers.push(id);
        });
    };

    const hide = () => {
        clearTimers();
        headerItems.forEach((el) => el.classList.remove('is-visible'));
        steps.forEach((step) => step.classList.remove('is-visible'));
        if (fill) fill.style.setProperty('--how-fill', 0);
    };

    if (reducedMotion) {
        show();
        return; // sem observer: fica sempre visível, sem reconstrução
    }

    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                show();
            } else {
                hide();
            }
        });
    }, { threshold: 0.35 });

    observer.observe(section);
}

// Seção "Diferencial vs. QR code": coluna QR entra com stagger mais lento
// (180ms) que a coluna Zaptag (90ms) — a diferença de ritmo reforça a
// diferença de "quantidade de espera" antes mesmo da pessoa ler o texto.
// Slogan de destaque entra depois, com scale-in próprio (ver CSS), seguido
// pelos três diferenciais técnicos. Desconstrói ao sair da tela, como as
// outras seções com scroll reveal (ver initHowSteps/initUseCases).
function initCompare() {
    const section = document.querySelector('.compare');
    if (!section) return;

    const headerItems = section.querySelectorAll('.section-header [data-reveal]');
    const qrSteps = section.querySelectorAll('.compare__column--qr .compare__step');
    const zaptagSteps = section.querySelectorAll('.compare__column--zaptag .compare__step');
    const slogan = section.querySelector('.compare__slogan');
    const facts = section.querySelector('.compare__facts');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timers = [];
    // Mesma trava do initHowSteps: os facts (720ms) são o último evento
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
        timers.push(setTimeout(() => {
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

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
        block.classList.add('is-visible');
        return;
    }

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

// Rede de segurança: mostra tudo que depende de JS pra aparecer. Chamada
// quando algum init falha — a página perde a animação, não o conteúdo.
function revealEverything() {
    document
        .querySelectorAll('[data-reveal], .usecase-card, .compare__slogan')
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
    run('initTouchAnimation', () => initTouchAnimation(document.getElementById('hero-touch-demo')));
    run('initHowSteps', initHowSteps);
    run('initCompare', initCompare);
    run('initUseCases', initUseCases);
    run('initFinalCta', initFinalCta);
});
