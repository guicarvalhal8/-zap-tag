// Casos de uso: lista de dados única. Pra adicionar um 7º caso, basta
// acrescentar um item aqui — layout e lógica de expand/collapse não mudam.
// Os 3 primeiros aparecem sempre; o resto entra no grid expansível.

const USECASES_LIST = [
    {
        title: 'Avaliação Google',
        desc: 'O cliente termina de comer, encosta o celular na mesa e a tela de avaliação já abre pronta pra 5 estrelas — sem precisar procurar o nome do estabelecimento.',
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L14.9 8.6 L22 9.3 L16.5 14.1 L18.2 21 L12 17.3 L5.8 21 L7.5 14.1 L2 9.3 L9.1 8.6 Z"/></svg>'
    },
    {
        title: 'Cardápio digital',
        desc: 'Mudou o preço ou tirou um prato do menu? Atualiza uma vez só e todo mundo que encostar no adesivo já vê a versão certa — nada de reimprimir cardápio.',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="14" y2="18"/></svg>'
    },
    {
        title: 'Wi-Fi automático',
        desc: 'Chega de gritar a senha do Wi-Fi pro salão inteiro. O cliente encosta o celular e conecta direto, sem digitar nada.',
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="14" width="4" height="7" rx="1"/><rect x="10" y="9" width="4" height="12" rx="1"/><rect x="17" y="4" width="4" height="17" rx="1"/></svg>'
    },
    {
        title: 'Pix',
        desc: 'A chave e o valor já vêm preenchidos na hora — o cliente só confirma o pagamento, sem erro de digitação nem confusão de valor.',
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 2 L6 14 L11 14 L9 22 L19 9 L13 9 Z"/></svg>'
    },
    {
        title: 'Fidelidade',
        desc: 'Cada encostada do cliente já conta como uma visita no seu programa de fidelidade — sem cartão de papel pra perder, sem carimbo manual.',
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><defs><path id="uc-star" d="M12 2 L14.9 8.6 L22 9.3 L16.5 14.1 L18.2 21 L12 17.3 L5.8 21 L7.5 14.1 L2 9.3 L9.1 8.6 Z"/></defs><use href="#uc-star" transform="translate(-2 -1) scale(0.5)" opacity="0.5"/><use href="#uc-star" transform="translate(4 4) scale(0.55)"/></svg>'
    },
    {
        title: 'Ficha de contato',
        desc: 'Seu cliente encosta o celular e o contato do negócio — telefone, endereço, redes sociais — já cai direto na agenda dele.',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10.5" r="2"/><line x1="5.5" y1="16" x2="11.5" y2="16"/><line x1="14" y1="9" x2="18" y2="9"/><line x1="14" y1="12.5" x2="18" y2="12.5"/></svg>'
    }
];

const USE_CASES_PRIMARY_COUNT = 3;

function renderUseCaseCard(item) {
    return `
        <li class="usecase-card">
            <span class="usecase-card__icon-wrap">
                <span class="usecase-card__icon">${item.icon}</span>
            </span>
            <h3 class="usecase-card__title">${item.title}</h3>
            <p class="usecase-card__desc">${item.desc}</p>
        </li>
    `;
}

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

    const primaryItems = USECASES_LIST.slice(0, USE_CASES_PRIMARY_COUNT);
    const restItems = USECASES_LIST.slice(USE_CASES_PRIMARY_COUNT);

    primaryGrid.innerHTML = primaryItems.map(renderUseCaseCard).join('');
    expandGrid.innerHTML = restItems.map(renderUseCaseCard).join('');

    const section = primaryGrid.closest('.usecases');
    const headerItems = section ? section.querySelectorAll('.section-header [data-reveal]') : [];

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const primaryCards = primaryGrid.querySelectorAll('.usecase-card');

    if (!reducedMotion) {
        initCardTilt(primaryCards);
        initCardTilt(expandGrid.querySelectorAll('.usecase-card'));
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

        const expandCards = expandGrid.querySelectorAll('.usecase-card');
        if (expanded) {
            expandTimers = revealCards(expandCards, reducedMotion ? 0 : 130);
        } else {
            hideCards(expandCards, expandTimers);
        }
    });
}
