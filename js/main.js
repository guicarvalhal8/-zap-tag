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
        if (event.key === 'Escape') closeMenu();
    });
}

function initHeroReveal() {
    const items = document.querySelectorAll('.hero [data-reveal]');
    items.forEach((el, i) => {
        setTimeout(() => el.classList.add('is-visible'), 120 * i);
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
function initHowSteps() {
    const section = document.querySelector('.how');
    if (!section) return;

    const steps = section.querySelectorAll('.how__step');
    const fill = section.querySelector('.how__track-fill');
    const headerItems = section.querySelectorAll('.section-header [data-reveal]');
    if (!steps.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timers = [];

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

    const observer = new IntersectionObserver((entries) => {
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

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            block.classList.toggle('is-visible', entry.isIntersecting);
        });
    }, { threshold: 0.3 });
    observer.observe(block);
}

document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initNavbarMenu();
    initHeroReveal();
    initWhatsappLinks();
    initTouchAnimation(document.getElementById('hero-touch-demo'));
    initHowSteps();
    initUseCases();
    initFinalCta();
});
