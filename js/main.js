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
// aqui só o cabeçalho. O cronômetro é do initCrono e o veredito embaixo dele
// (slogan, frase e botão) é do initVerdict. Se a seção sair de vista no meio,
// desfaz e refaz na próxima entrada; depois de uma passagem, trava.
function initCompare() {
    const section = document.querySelector('.compare');
    if (!section) return;

    const headerItems = section.querySelectorAll('.section-header [data-reveal]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timer = 0;
    let observer = null;

    const show = () => {
        clearTimeout(timer);
        headerItems.forEach((el) => el.classList.add('is-visible'));
        timer = setTimeout(() => observer && observer.disconnect(), 720);
    };

    const hide = () => {
        clearTimeout(timer);
        headerItems.forEach((el) => el.classList.remove('is-visible'));
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

// Como contratar: o convite sobe, os 4 passos entram em sequência e o fio
// ciano entre os marcadores corre de cima pra baixo. Uma vez só. Com
// movimento reduzido fica o estado final do HTML (fio inteiro).
function initHire() {
    const section = document.querySelector('.hire');
    if (!section) return;
    const pitch = section.querySelector('.hire__pitch');
    const steps = section.querySelector('[data-hire]');
    const items = steps.querySelectorAll('.hire__step');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        pitch.classList.add('is-visible');
        return;
    }

    steps.classList.add('is-armed');
    const observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        pitch.classList.add('is-visible');
        steps.classList.add('is-in');
        items.forEach((item, i) => setTimeout(() => item.classList.add('is-visible'), 150 + i * 160));
    }, { rootMargin: '0px 0px -20% 0px' });
    observer.observe(section);
}

// Fechamento (contato): na primeira vez que o bloco entra na tela, a tag
// "encosta" e solta três ondas (.is-on), o fio ciano desce e as linhas de
// contato acendem uma a uma (.is-lit). Depois disso, enquanto o bloco estiver
// visível, a tag pulsa a cada ~5 s (.is-live); fora da tela o pulso para.
// Com movimento reduzido fica o HTML como está: tudo legível, sem ondas.
function initClosing() {
    const closing = document.querySelector('[data-closing]');
    if (!closing) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const items = closing.querySelectorAll('.closing__item');
    let started = false;
    let settled = false;
    let inView = false;

    closing.classList.add('is-armed');
    const observer = new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting;
        if (inView && !started) {
            started = true;
            closing.classList.add('is-on');
            items.forEach((item, i) => setTimeout(() => item.classList.add('is-lit'), 450 + i * 280));
            // O pulso de repouso só começa depois da primeira sequência.
            setTimeout(() => {
                settled = true;
                closing.classList.remove('is-on');
                closing.classList.toggle('is-live', inView);
            }, 2600);
            return;
        }
        if (settled) closing.classList.toggle('is-live', inView);
    }, { threshold: 0.35 });
    observer.observe(closing);
}

// Vídeo do Hero: com movimento reduzido fica parado no primeiro quadro (o
// autoplay do HTML já começou, então é preciso pausar). Fora da tela ou com a
// aba oculta ele pausa, pra não gastar bateria rodando um loop que ninguém vê.
function initHeroVideo() {
    const video = document.querySelector('.hero__video');
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.removeAttribute('autoplay');
        video.pause();
        return;
    }

    let inView = true;
    const sync = () => {
        if (inView && !document.hidden) {
            // play() devolve uma Promise que rejeita se o navegador barrar o
            // autoplay (economia de energia, por exemplo): fica o poster.
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    };

    new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting;
        sync();
    }).observe(video);
    document.addEventListener('visibilitychange', sync);
}

// Comparativo com cronômetro: os dois relógios largam juntos, em tempo real.
// Cada cartão para no próprio data-crono-end (Zap Tag 1,2 s, QR 14,2 s); as
// etapas aparecem no segundo do data-at e o selo quando o relógio trava. A
// régua das duas colunas é a mesma (0 até o maior fim), então a da Zap Tag
// para em ~8%. Roda sozinho UMA vez, quando metade do bloco entra na tela;
// depois só pelo botão. Com movimento reduzido fica o estado final do HTML.
function initCrono() {
    const root = document.querySelector('[data-crono]');
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = Array.from(root.querySelectorAll('[data-crono-card]')).map((card) => ({
        el: card,
        end: parseFloat(card.dataset.cronoEnd),
        num: card.querySelector('[data-crono-num]'),
        fill: card.querySelector('[data-crono-fill]'),
        steps: Array.from(card.querySelectorAll('.crono__step')).map((li) => ({ li, at: parseFloat(li.dataset.at) })),
        badge: card.querySelector('[data-crono-badge]'),
    }));
    const total = Math.max(...cards.map((c) => c.end));
    const button = root.querySelector('[data-crono-replay]');
    const label = root.querySelector('[data-crono-label]');
    const format = (t) => t.toFixed(1).replace('.', ',');
    let frame = 0;

    const render = (t) => {
        cards.forEach((c) => {
            const shown = Math.min(t, c.end);
            c.num.textContent = format(shown);
            c.fill.style.setProperty('--crono-progress', (shown / total).toFixed(4));
            c.steps.forEach((s) => s.li.classList.toggle('is-shown', t >= s.at));
            const locked = t >= c.end;
            c.badge.classList.toggle('is-shown', locked);
            c.el.classList.toggle('is-locked', locked);
        });
    };

    const run = () => {
        cancelAnimationFrame(frame);
        cards.forEach((c) => c.el.classList.remove('is-locked'));
        root.dataset.cronoState = 'running';
        root.dispatchEvent(new CustomEvent('crono:start', { bubbles: true }));
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min((now - start) / 1000, total);
            render(t);
            if (t < total) {
                frame = requestAnimationFrame(tick);
            } else {
                label.textContent = 'Repetir comparação';
                root.dataset.cronoState = 'done';
                root.dispatchEvent(new CustomEvent('crono:done', { bubbles: true }));
            }
        };
        frame = requestAnimationFrame(tick);
    };

    // Armado: zera relógios e esconde etapas (ocupando o lugar) até rodar.
    root.classList.add('is-armed');
    render(0);
    button.hidden = false;
    button.addEventListener('click', run);

    const observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        run();
    }, { threshold: 0.5 });
    observer.observe(root.querySelector('.crono__cards'));
}

// Veredito do cronômetro: slogan, frase e botão esperam o relógio do QR
// travar (crono:done) e entram juntos, com a linha ciano "fechando o
// circuito" embaixo do slogan. No "Repetir comparação" só a linha recolhe e
// volta no fim. Se o bloco entrar na tela sem o cronômetro ter largado (quem
// chegou por baixo, ou sem cronômetro na página), aparece na hora: ninguém
// fica olhando um buraco. Com movimento reduzido fica o HTML como está.
function initVerdict() {
    const verdict = document.querySelector('[data-verdict]');
    if (!verdict) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const crono = document.querySelector('[data-crono]');

    const reveal = () => verdict.classList.remove('is-armed', 'is-waiting');

    verdict.classList.add('is-armed', 'is-waiting');
    if (!crono) { reveal(); return; }

    crono.addEventListener('crono:start', () => {
        if (!verdict.classList.contains('is-armed')) verdict.classList.add('is-waiting');
    });
    crono.addEventListener('crono:done', reveal);

    const observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        if (!crono.dataset.cronoState) reveal();
    }, { threshold: 0.6 });
    observer.observe(verdict);
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
        .querySelectorAll('[data-reveal], .format')
        .forEach((el) => el.classList.add('is-visible'));
    // Cronômetro que quebrou no meio: volta ao estado final do HTML.
    document.querySelectorAll('.crono').forEach((el) => el.classList.remove('is-armed'));
    document.querySelectorAll('.usecases').forEach((el) => el.classList.remove('is-armed'));
    document.querySelectorAll('.hire__steps, .closing').forEach((el) => el.classList.remove('is-armed'));
    document.querySelectorAll('[data-verdict]').forEach((el) => el.classList.remove('is-armed', 'is-waiting'));
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
    run('initHeroVideo', initHeroVideo);
    run('initCompare', initCompare);
    run('initVerdict', initVerdict);
    run('initCrono', initCrono);
    run('initUseCases', initUseCases);
    run('initFormats', initFormats);
    run('initShowcase', initShowcase);
    run('initHire', initHire);
    run('initClosing', initClosing);
});
