// Componente reutilizável: celular encostando na tag, com pulso de toque.
// Usado no Hero e, futuramente, na seção "Como funciona".

// Injeta a acessibilidade de cada SVG num lugar só: com `label`, vira ícone
// nomeado (role="img" + aria-label); sem `label`, decorativo (aria-hidden).
// O padrão sistêmico deste projeto é a disciplina de acessibilidade evaporar
// quando o HTML vira string em JS — isto existe pra não depender de lembrar
// de repetir o atributo em cada ícone novo.
function svgIcon(markup, label) {
    const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
    return markup.replace('<svg ', `<svg ${a11y} `);
}

const TOUCH_DEMO_CASES = [
    {
        key: 'review',
        label: 'Avaliação no Google',
        icon: svgIcon('<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L14.9 8.6 L22 9.3 L16.5 14.1 L18.2 21 L12 17.3 L5.8 21 L7.5 14.1 L2 9.3 L9.1 8.6 Z"/></svg>')
    },
    {
        key: 'cardapio',
        label: 'Cardápio digital',
        icon: svgIcon('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="14" y2="18"/></svg>')
    },
    {
        key: 'wifi',
        label: 'Wi-Fi liberado',
        icon: svgIcon('<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="14" width="4" height="7" rx="1"/><rect x="10" y="9" width="4" height="12" rx="1"/><rect x="17" y="4" width="4" height="17" rx="1"/></svg>')
    }
];

const TAG_ICON = svgIcon(`
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <mask id="zt-cutout-demo">
            <rect width="100" height="100" fill="white"/>
            <circle cx="30" cy="28" r="6" fill="black"/>
            <path d="M58 20 L38 54 L50 54 L42 80 L66 45 L53 45 Z" fill="black"/>
        </mask>
        <path fill="var(--color-primary)" d="M15 20 L62 20 L85 50 L62 80 L15 80 Z" mask="url(#zt-cutout-demo)"/>
    </svg>`, 'Adesivo Zap Tag');

const CHECK_ICON = svgIcon('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12 10 17 19 7"/></svg>');

function touchDemoSleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function initTouchAnimation(root) {
    if (!root) return;

    root.innerHTML = `
        <div class="touch-demo">
            <div class="touch-demo__phone">
                <div class="touch-demo__screen">
                    ${TOUCH_DEMO_CASES.map((useCase) => `
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

    // `.touch-demo__panel` tem `transition: opacity 320ms`, e os painéis são
    // absolutamente posicionados uns sobre os outros. Ligar o novo e desligar
    // o velho no mesmo tick faz os dois cruzarem em opacidade ao mesmo tempo
    // — como o conteúdo é diferente (ícone e texto trocam, não é a mesma
    // imagem), o resultado é sobreposição visível, não um dissolve limpo.
    // switchPanel() apaga tudo, espera a transition de saída terminar, e só
    // então acende o próximo — sem overlap.
    const PANEL_FADE_MS = 320;

    const showPanel = (key) => {
        panels.forEach((panel) => {
            panel.classList.toggle('is-active', panel.dataset.panel === key);
        });
    };

    const switchPanel = async (key) => {
        panels.forEach((panel) => panel.classList.remove('is-active'));
        await touchDemoSleep(PANEL_FADE_MS);
        showPanel(key);
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
        showPanel(TOUCH_DEMO_CASES[0].key);
        return;
    }

    let running = true;
    root.addEventListener('touch-demo:stop', () => { running = false; }, { once: true });

    // O loop nunca tinha gate de visibilidade: rodava pra sempre, mesmo com a
    // aba em segundo plano ou o Hero rolado pra fora da tela. `paused` só some
    // a checagem — não interrompe a sequência no meio, apenas volta a
    // verificar a cada 200ms até a demo ficar visível de novo.
    let inView = true;
    let paused = document.visibilityState === 'hidden';
    const updatePaused = () => {
        paused = !inView || document.visibilityState === 'hidden';
    };

    document.addEventListener('visibilitychange', updatePaused);

    const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { inView = entry.isIntersecting; });
        updatePaused();
    }, { threshold: 0.1 });
    visibilityObserver.observe(root);

    root.addEventListener('touch-demo:stop', () => visibilityObserver.disconnect(), { once: true });

    (async () => {
        let i = 0;
        while (running) {
            if (paused) {
                await touchDemoSleep(200);
                continue;
            }
            const useCase = TOUCH_DEMO_CASES[i % TOUCH_DEMO_CASES.length];
            await switchPanel('idle');
            demo.classList.remove('is-tapped');
            await touchDemoSleep(500);
            if (!running) break;
            demo.classList.add('is-tapped');
            fireRipple();
            await touchDemoSleep(220);
            if (!running) break;
            await switchPanel(useCase.key);
            await touchDemoSleep(2200);
            i += 1;
        }
    })();
}
