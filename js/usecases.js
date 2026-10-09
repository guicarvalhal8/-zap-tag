// Serviços (casos de uso): o CONTEÚDO dos 6 serviços vive no index.html.
//
// O HTML funciona sozinho: sem JS, a escolha e o "ver outro" ficam
// escondidos e os 6 painéis aparecem um embaixo do outro. Este arquivo liga,
// por cima dele:
// - a escolha: a seção abre só com os 6 botões; escolhido um, a escolha sai
//   e só aquele painel aparece, montando em cascata (.is-shown, ver o CSS);
// - o "Quer ver outro modelo?" no fim do painel: troca direto pra outro
//   serviço, ou fecha e volta à escolha;
// - a entrada da seção por scroll, com gatilho próprio pro título.
//
// O link de WhatsApp de cada serviço sai do data-wa-message, via
// initWhatsappLinks() em main.js.

function initUseCases() {
    const section = document.querySelector('.usecases');
    const svc = section ? section.querySelector('[data-svc]') : null;
    if (!svc) return;
    const header = section.querySelector('.section-header');
    const headerItems = section.querySelectorAll('.section-header [data-reveal]');
    const chooser = svc.querySelector('.svc__chooser');
    const choices = Array.from(svc.querySelectorAll('.svc__choice'));
    const panels = choices.map((choice) => document.getElementById(choice.getAttribute('aria-controls')));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let open = -1;

    // Reinicia uma animação de entrada: tira a classe, força o reflow e
    // devolve, pra cascata rodar de novo a cada abertura.
    const replay = (el) => {
        el.classList.remove('is-shown');
        void el.offsetWidth;
        el.classList.add('is-shown');
    };

    // Leva o alvo pra logo abaixo da navbar fixa. Necessário ao trocar pelo
    // "ver outro": a pessoa está no FIM do painel e o novo começa lá em cima.
    const bringIntoView = (el) => {
        const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = el.getBoundingClientRect().top + window.scrollY - nav - 16;
        window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
    };

    const show = (index) => {
        open = index;
        svc.classList.add('is-open');
        panels.forEach((panel, i) => {
            const on = i === index;
            panel.classList.toggle('is-active', on);
            if (!on) panel.classList.remove('is-shown');
            choices[i].setAttribute('aria-expanded', String(on));
        });
        replay(panels[index]);
        bringIntoView(panels[index]);
        panels[index].querySelector('.svc__verb').focus({ preventScroll: true });
    };

    const close = () => {
        const was = open;
        open = -1;
        svc.classList.remove('is-open');
        panels.forEach((panel, i) => {
            panel.classList.remove('is-active', 'is-shown');
            choices[i].setAttribute('aria-expanded', 'false');
        });
        replay(chooser);
        bringIntoView(section);
        if (was >= 0) choices[was].focus({ preventScroll: true });
    };

    chooser.hidden = false;
    svc.querySelectorAll('.svc__more').forEach((more) => { more.hidden = false; });
    svc.classList.add('is-interactive');

    choices.forEach((choice, i) => choice.addEventListener('click', () => show(i)));
    svc.querySelectorAll('[data-svc-open]').forEach((button) => {
        button.addEventListener('click', () => show(Number(button.dataset.svcOpen) - 1));
    });
    svc.querySelectorAll('[data-svc-close]').forEach((button) => button.addEventListener('click', close));

    const showHeader = () => headerItems.forEach((el) => el.classList.add('is-visible'));

    if (reducedMotion) {
        showHeader();
        return;
    }

    // Título e escolha têm gatilhos SEPARADOS: com um só, o título ficava
    // ~400px na tela com opacidade 0 no celular, logo depois do veredito.
    const headerObserver = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        headerObserver.disconnect();
        showHeader();
    }, { rootMargin: '0px 0px -10% 0px' });
    headerObserver.observe(header);

    section.classList.add('is-armed');
    const chooserObserver = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        chooserObserver.disconnect();
        section.classList.add('is-in');
        replay(chooser);
    }, { rootMargin: '0px 0px -15% 0px' });
    chooserObserver.observe(chooser);
}
