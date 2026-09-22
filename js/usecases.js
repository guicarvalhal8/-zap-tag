// Casos de uso: o CONTEÚDO dos 6 cards vive no index.html, não aqui.
//
// Antes este arquivo era a fonte única dos dados (um array USECASES_LIST) e
// montava os cards por innerHTML. Era bom pra manutenção e ruim pra entrega:
// sem JS, os 6 cards não existiam no DOM e a seção de maior intenção de
// compra da página desaparecia inteira. Agora o HTML é a fonte da verdade e
// este arquivo só liga comportamento no que já está renderizado — reveal por
// scroll, tilt 3D no hover e o expand/collapse dos 3 extras.
//
// Pra adicionar um 7º caso de uso: copie um <li class="usecases__item">
// dentro de #usecases-expand no HTML. Nada aqui precisa mudar — o link de
// WhatsApp do card sai do data-wa-message, via initWhatsappLinks() em main.js.

function revealCards(cards, stagger) {
    const timers = [];
    cards.forEach((card, i) => {
        timers.push(setTimeout(() => card.classList.add('is-visible'), i * stagger));
    });
    return timers;
}

function hideCards(cards, timers) {
    if (timers) timers.forEach((id) => clearTimeout(id));
    cards.forEach((card) => card.classList.remove('is-visible'));
}

// Tilt 3D sutil que segue o cursor — só como progressive enhancement,
// nunca substitui o hover simples do CSS (fallback pra touch/reduced motion).
function initCardTilt(cards) {
    const maxTilt = 7;

    cards.forEach((card) => {
        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            const rotateY = (x - 0.5) * maxTilt * 2;
            const rotateX = (0.5 - y) * maxTilt * 2;
            card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

function initUseCases() {
    const primaryGrid = document.getElementById('usecases-primary');
    const expandGrid = document.getElementById('usecases-expand');
    const expandWrap = document.getElementById('usecases-expand-wrap');
    const toggleBtn = document.getElementById('usecases-toggle');
    const toggleLabel = toggleBtn ? toggleBtn.querySelector('.usecases-toggle__label') : null;
    if (!primaryGrid || !expandGrid || !expandWrap || !toggleBtn) return;

    const section = primaryGrid.closest('.usecases');
    const headerItems = section ? section.querySelectorAll('.section-header [data-reveal]') : [];

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const primaryCards = primaryGrid.querySelectorAll('.usecase-card');
    const expandCards = expandGrid.querySelectorAll('.usecase-card');

    if (!reducedMotion) {
        initCardTilt(primaryCards);
        initCardTilt(expandCards);
    }

    let primaryTimers = [];
    const revealPrimary = () => {
        headerItems.forEach((el) => el.classList.add('is-visible'));
        primaryTimers = revealCards(primaryCards, reducedMotion ? 0 : 130);
    };
    const concealPrimary = () => {
        headerItems.forEach((el) => el.classList.remove('is-visible'));
        hideCards(primaryCards, primaryTimers);
    };

    if (reducedMotion) {
        revealPrimary();
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    revealPrimary();
                } else {
                    concealPrimary();
                }
            });
        }, { threshold: 0.3 });
        observer.observe(primaryGrid);
    }

    let expanded = false;
    let expandTimers = [];
    toggleBtn.addEventListener('click', () => {
        expanded = !expanded;
        toggleBtn.setAttribute('aria-expanded', String(expanded));
        toggleBtn.classList.toggle('is-expanded', expanded);
        if (toggleLabel) toggleLabel.textContent = expanded ? 'Ver menos' : 'Ver todas as opções';
        expandWrap.classList.toggle('is-open', expanded);

        if (expanded) {
            expandTimers = revealCards(expandCards, reducedMotion ? 0 : 130);
        } else {
            hideCards(expandCards, expandTimers);
        }
    });
}
