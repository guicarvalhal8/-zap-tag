// Componente reutilizável: celular encostando na tag, com pulso de toque.
// Usado no Hero. Roda sozinha como convite e, assim que a pessoa mexe,
// passa o controle pra ela: arrastar (mouse) ou tocar (touch/teclado).

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

// Deslocamento vertical (px) do celular em repouso e no contato com a tag.
// O CSS usa os mesmos valores no `transform` de `.touch-demo__phone` (repouso)
// e de `.touch-demo.is-tapped .touch-demo__phone` (contato) — manter iguais.
// No contato sobram ~6px até a tag: o celular precisa parecer que ENCOSTOU.
const TOUCH_DEMO_REST = -40;
const TOUCH_DEMO_CONTACT = 22;

function initTouchAnimation(root) {
    if (!root) return;

    // O celular é um <button>: é o alvo do arraste (mouse), do toque (touch)
    // e do Enter/Espaço (teclado). O nome acessível vem do aria-label; o
    // conteúdo da tela é decorativo e o resultado é anunciado pela região
    // `aria-live` logo abaixo.
    root.innerHTML = `
        <div class="touch-demo">
            <button type="button" class="touch-demo__phone" aria-label="Encostar o celular no adesivo">
                <span class="touch-demo__screen" aria-hidden="true">
                    ${TOUCH_DEMO_CASES.map((useCase) => `
                        <span class="touch-demo__panel" data-panel="${useCase.key}">
                            <span class="touch-demo__panel-icon">${useCase.icon}</span>
                            <span class="touch-demo__panel-label">${useCase.label}</span>
                        </span>
                    `).join('')}
                    <span class="touch-demo__panel is-active" data-panel="idle">
                        <span class="touch-demo__panel-idle">Aproxime o celular</span>
                    </span>
                </span>
            </button>
            <div class="touch-demo__tag">
                ${TAG_ICON}
                <div class="touch-demo__ripple" aria-hidden="true"></div>
                <div class="touch-demo__success" aria-hidden="true">${CHECK_ICON}</div>
            </div>
        </div>
        <p class="touch-demo__hint" aria-hidden="true">
            <span class="touch-demo__hint-drag">Arraste o celular até o adesivo</span>
            <span class="touch-demo__hint-tap">Toque no celular pra encostar no adesivo</span>
        </p>
        <span class="sr-only" aria-live="polite"></span>
    `;

    const demo = root.querySelector('.touch-demo');
    const phone = root.querySelector('.touch-demo__phone');
    const ripple = root.querySelector('.touch-demo__ripple');
    const panels = root.querySelectorAll('.touch-demo__panel');
    const live = root.querySelector('[aria-live]');

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

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const fireRipple = () => {
        if (reducedMotion) return;
        ripple.animate(
            [
                { transform: 'translate(-50%, 0) scale(0.3)', opacity: 0.9 },
                { transform: 'translate(-50%, 0) scale(2.6)', opacity: 0 }
            ],
            { duration: 700, easing: 'ease-out' }
        );
    };

    // Índice compartilhado entre a demo automática e a interação: quem
    // assume o controle continua do próximo caso, não volta pro primeiro.
    let caseIndex = 0;

    // ---- Interação ------------------------------------------------------

    let userInControl = false;
    let busy = false;

    const takeOver = () => {
        if (userInControl) return;
        userInControl = true;
        // A demo automática pode ter deixado o celular abaixado; o gesto da
        // pessoa sempre começa do repouso.
        demo.classList.remove('is-tapped');
        demo.classList.add('is-interactive');
    };

    // Um "encostar": o celular desce até a tag, o pulso sai, a tela abre o
    // caso seguinte. Depois o celular sobe de volta — e a tela CONTINUA
    // mostrando o que abriu, como num celular de verdade.
    const tap = async () => {
        if (busy) return;
        busy = true;
        takeOver();
        const useCase = TOUCH_DEMO_CASES[caseIndex % TOUCH_DEMO_CASES.length];
        caseIndex += 1;
        demo.classList.remove('is-near');
        demo.classList.add('is-tapped');
        fireRipple();
        await touchDemoSleep(reducedMotion ? 0 : 220);
        await switchPanel(useCase.key);
        live.textContent = `Abriu: ${useCase.label}`;
        await touchDemoSleep(reducedMotion ? 600 : 1200);
        demo.classList.remove('is-tapped');
        busy = false;
    };

    // Arraste só com mouse/caneta. No touch, arrastar dentro de uma área de
    // 168×300px sequestraria a rolagem da página inteira no celular — então
    // lá o gesto é um toque, e o `touch-action: pan-y` do CSS devolve a
    // rolagem vertical ao navegador (se a pessoa rolar, vem `pointercancel`
    // e nada dispara).
    let drag = null;

    const endDrag = () => {
        if (!drag) return;
        drag = null;
        demo.classList.remove('is-dragging', 'is-near');
        phone.style.transform = '';
    };

    // O `pointerdown` só REGISTRA o início. Assumir o controle ali tinha dois
    // efeitos ruins: no celular, rolar a página começando em cima do aparelho
    // (pointerdown → pointercancel) matava a demo automática sem a pessoa ter
    // interagido; e no desktop o celular saltava 62px, porque tirar o
    // `is-tapped` no mesmo instante em que a transition é desligada o levava
    // do contato pro repouso sem animação. Agora o controle só muda de mão
    // num gesto confirmado — arraste passou de 6px, ou toque/clique soltou —
    // e o arraste parte de onde o celular ESTÁ, não do repouso.
    const currentPhoneY = () => new DOMMatrixReadOnly(getComputedStyle(phone).transform).m42;

    phone.addEventListener('pointerdown', (event) => {
        if (busy || event.button !== 0) return;
        drag = {
            id: event.pointerId,
            type: event.pointerType,
            startX: event.clientX,
            startY: event.clientY,
            baseY: currentPhoneY(),
            moved: false
        };
        if (event.pointerType !== 'touch') phone.setPointerCapture(event.pointerId);
    });

    phone.addEventListener('pointermove', (event) => {
        if (!drag || drag.id !== event.pointerId || drag.type === 'touch') return;
        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        if (!drag.moved) {
            if (Math.abs(dx) + Math.abs(dy) <= 6) return;
            drag.moved = true;
            // Ordem importa: congelar a posição (sem transition) ANTES de
            // takeOver() tirar o `is-tapped`, senão o celular pula.
            demo.classList.add('is-dragging');
            phone.style.transform = `translate(0px, ${drag.baseY}px)`;
            takeOver();
        }

        // Pra baixo segue o cursor 1:1 até o contato; pra cima e pros lados
        // cede com resistência — o celular "quer" ir pra tag.
        const y = dy > 0
            ? Math.min(drag.baseY + dy, TOUCH_DEMO_CONTACT)
            : drag.baseY + Math.max(dy * 0.25, -14);
        const x = Math.max(-18, Math.min(18, dx * 0.25));
        phone.style.transform = `translate(${x}px, ${y}px)`;

        const progress = (y - TOUCH_DEMO_REST) / (TOUCH_DEMO_CONTACT - TOUCH_DEMO_REST);
        demo.classList.toggle('is-near', progress > 0.55);

        if (y >= TOUCH_DEMO_CONTACT) {
            phone.releasePointerCapture(event.pointerId);
            endDrag();
            tap();
        }
    });

    phone.addEventListener('pointerup', (event) => {
        if (!drag || drag.id !== event.pointerId) return;
        const wasClick = !drag.moved;
        endDrag();
        if (wasClick) tap();
    });

    phone.addEventListener('pointercancel', endDrag);
    // Captura perdida sem pointerup (janela perde o foco, alt-tab no meio do
    // arraste): sem isto o celular ficava preso em `is-dragging`.
    phone.addEventListener('lostpointercapture', endDrag);

    // Teclado: Enter/Espaço disparam `click` com `detail === 0`. Clique de
    // ponteiro já foi tratado no pointerup — ignorá-lo aqui evita disparar
    // duas vezes.
    phone.addEventListener('click', (event) => {
        if (event.detail === 0) tap();
    });

    // ---- Demo automática (convite) ----------------------------------------

    if (reducedMotion) {
        // Sem movimento automático: a tela já mostra o primeiro caso aberto,
        // e a interação continua disponível (quem move é a pessoa).
        showPanel(TOUCH_DEMO_CASES[0].key);
        caseIndex = 1;
        return;
    }

    let running = true;
    root.addEventListener('touch-demo:stop', () => { running = false; }, { once: true });
    const alive = () => running && !userInControl;

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

    // WCAG 2.2.2 (Pause, Stop, Hide): movimento automático que dura mais de
    // 5s precisa de um controle de pausa. Antes eram 6 ciclos (~21s) sem
    // controle nenhum. Agora é UM ciclo (~3,6s): o celular encosta, abre a
    // avaliação e sobe de novo — o convite; daí em diante só se move quando
    // a pessoa move.
    const MAX_CYCLES = 1;

    (async () => {
        // Cada `await` pode terminar com a pessoa já no controle: o loop
        // confere antes de mexer em qualquer estado, pra não brigar com ela.
        let cycles = 0;
        while (alive() && cycles < MAX_CYCLES) {
            if (paused) {
                await touchDemoSleep(200);
                continue;
            }
            const useCase = TOUCH_DEMO_CASES[caseIndex % TOUCH_DEMO_CASES.length];
            await switchPanel('idle');
            if (!alive()) break;
            demo.classList.remove('is-tapped');
            await touchDemoSleep(500);
            if (!alive()) break;
            demo.classList.add('is-tapped');
            fireRipple();
            await touchDemoSleep(220);
            if (!alive()) break;
            await switchPanel(useCase.key);
            if (!alive()) break;
            caseIndex += 1;
            await touchDemoSleep(2200);
            cycles += 1;
        }
        visibilityObserver.disconnect();
        document.removeEventListener('visibilitychange', updatePaused);
        // Fim natural do convite: o celular volta ao repouso e a tela continua
        // mostrando o que abriu. Antes ele ficava encostado pra sempre — e era
        // de lá que o próximo arraste partia.
        if (!userInControl) demo.classList.remove('is-tapped');
        // Se a pessoa assumiu no meio de um "encostar", o loop pode ter
        // parado com o celular abaixado ou com a tela apagada pelo fade.
        // Deixa um estado limpo — a menos que o toque dela já esteja rodando.
        if (userInControl && !busy) {
            demo.classList.remove('is-tapped');
            if (!root.querySelector('.touch-demo__panel.is-active')) showPanel('idle');
        }
    })();
}
