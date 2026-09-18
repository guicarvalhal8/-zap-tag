// Componente reutilizável: celular encostando na tag, com pulso de toque.
// Usado no Hero e, futuramente, na seção "Como funciona".

const USE_CASES = [
    {
        key: 'review',
        label: 'Avaliação no Google',
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L14.9 8.6 L22 9.3 L16.5 14.1 L18.2 21 L12 17.3 L5.8 21 L7.5 14.1 L2 9.3 L9.1 8.6 Z"/></svg>'
    },
    {
        key: 'cardapio',
        label: 'Cardápio digital',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="14" y2="18"/></svg>'
    },
    {
        key: 'wifi',
        label: 'Wi-Fi liberado',
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="14" width="4" height="7" rx="1"/><rect x="10" y="9" width="4" height="12" rx="1"/><rect x="17" y="4" width="4" height="17" rx="1"/></svg>'
    }
];

const TAG_ICON = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Adesivo Zap Tag">
        <mask id="zt-cutout-demo">
            <rect width="100" height="100" fill="white"/>
            <circle cx="30" cy="28" r="6" fill="black"/>
            <path d="M58 20 L38 54 L50 54 L42 80 L66 45 L53 45 Z" fill="black"/>
        </mask>
        <path fill="var(--color-primary)" d="M15 20 L62 20 L85 50 L62 80 L15 80 Z" mask="url(#zt-cutout-demo)"/>
    </svg>`;

const CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12 10 17 19 7"/></svg>';

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function initTouchAnimation(root) {
    if (!root) return;

    root.innerHTML = `
        <div class="touch-demo">
            <div class="touch-demo__phone">
                <div class="touch-demo__screen">
                    ${USE_CASES.map((useCase) => `
                        <div class="touch-demo__panel" data-panel="${useCase.key}">
                            <span class="touch-demo__panel-icon">${useCase.icon}</span>
                            <span class="touch-demo__panel-label">${useCase.label}</span>
                        </div>
                    `).join('')}
                    <div class="touch-demo__panel is-active" data-panel="idle">
                        <span class="touch-demo__panel-idle">Aproxime o celular</span>
                    </div>
                </div>
            </div>
            <div class="touch-demo__tag">
                ${TAG_ICON}
                <div class="touch-demo__ripple"></div>
                <div class="touch-demo__success">${CHECK_ICON}</div>
            </div>
        </div>
    `;

    const demo = root.querySelector('.touch-demo');
    const ripple = root.querySelector('.touch-demo__ripple');
    const panels = root.querySelectorAll('.touch-demo__panel');

    const showPanel = (key) => {
        panels.forEach((panel) => {
            panel.classList.toggle('is-active', panel.dataset.panel === key);
        });
    };

    const fireRipple = () => {
        ripple.animate(
            [
                { transform: 'translate(-50%, 0) scale(0.3)', opacity: 0.9 },
                { transform: 'translate(-50%, 0) scale(2.6)', opacity: 0 }
            ],
            { duration: 700, easing: 'ease-out' }
        );
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
        demo.classList.add('is-tapped');
        showPanel(USE_CASES[0].key);
        return;
    }

    let running = true;
    root.addEventListener('touch-demo:stop', () => { running = false; }, { once: true });

    (async () => {
        let i = 0;
        while (running) {
            const useCase = USE_CASES[i % USE_CASES.length];
            showPanel('idle');
            demo.classList.remove('is-tapped');
            await sleep(500);
            if (!running) break;
            demo.classList.add('is-tapped');
            fireRipple();
            await sleep(220);
            if (!running) break;
            showPanel(useCase.key);
            await sleep(2200);
            i += 1;
        }
    })();
}
