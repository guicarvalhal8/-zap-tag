// ==========================================================================
// Vitrine 3D — modal com as peças impressas em 3D (tag NFC dentro do plástico)
// ==========================================================================
//
// Complemento opcional dos "Casos de uso", nunca CTA: sem botão de WhatsApp
// aqui dentro. A cena é a do protótipo do dono (zaptag-placa-avalie-aqui.html,
// 24/09): mesma geometria, mesmas texturas, arraste + auto-rotação lenta.
//
// O three.js (r128, cdnjs, mesma versão do protótipo) só é baixado na
// primeira abertura do modal. Quem nunca abre a vitrine não paga os ~600 KB.
//
// Script clássico, escopo global compartilhado com os outros js/*.js: tudo no
// nível raiz leva o prefixo SHOWCASE_/showcase.

const SHOWCASE_THREE_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
const SHOWCASE_THREE_SRI = 'sha512-dLxUelApnYxpLt6K2iomGngnHO83iUvZytA3YjDUCjT0HDOHKXnVYdf3hU4JjM8uEhxf9nD1/ey98U3t2vZ0qQ==';

// Precisam bater com as transições de .showcase e .showcase__stage no CSS.
const SHOWCASE_OPEN_MS = 240;
const SHOWCASE_SWAP_MS = 160;

// Ordem pedida pelo dono. A frase é só o diferencial da peça: nada de
// material, prazo ou resistência, que ainda não foram testados.
const SHOWCASE_PIECES = [
    { key: 'chaveiro', name: 'Chaveiro / ímã', desc: 'O ícone da marca em miniatura, com a tag NFC selada dentro do plástico.' },
    { key: 'suporte', name: 'Suporte de mesa', desc: 'O ícone de pé sobre uma base, com a tag embutida durante a impressão.' },
    { key: 'coaster', name: 'Porta-copo', desc: 'O ícone em relevo no centro, com a tag selada dentro do disco.' },
    { key: 'placa', name: 'Placa "Avalie aqui"', desc: 'Para a entrada ou o caixa: encostou, abre a avaliação no Google.' },
    { key: 'cardapio', name: 'Disco "Cardápio"', desc: 'Fino e deitado na mesa, um por mesa, para abrir o cardápio digital.' },
    { key: 'pix', name: 'Etiqueta "Pix"', desc: 'Pequena, com uma aba para prender na pasta da conta.' },
    { key: 'fidelidade', name: 'Ficha de fidelidade', desc: 'Oito carimbos em volta da logo, e o progresso fica salvo no digital.' },
];

// Únicas cores fora dos tokens, de propósito: são as marcas de terceiros
// impressas na peça (o "Google" colorido da placa e o verde-água do Pix), não
// cor de interface do site.
const SHOWCASE_PRINT_COLORS = {
    google: ['#4285F4', '#EA4335', '#FBBC05', '#4285F4', '#34A853', '#EA4335'],
    pix: '#32BCAD',
};

let showcaseThreePromise = null;

function showcaseHasWebGL() {
    try {
        const c = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

function showcaseLoadThree() {
    if (window.THREE) return Promise.resolve(window.THREE);
    if (showcaseThreePromise) return showcaseThreePromise;
    showcaseThreePromise = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = SHOWCASE_THREE_SRC;
        s.integrity = SHOWCASE_THREE_SRI;
        s.crossOrigin = 'anonymous';
        s.referrerPolicy = 'no-referrer';
        s.onload = () => (window.THREE ? resolve(window.THREE) : reject(new Error('THREE ausente')));
        s.onerror = () => {
            // Deixa tentar de novo na próxima abertura (rede instável).
            showcaseThreePromise = null;
            s.remove();
            reject(new Error('falha ao baixar o three.js'));
        };
        document.head.appendChild(s);
    });
    return showcaseThreePromise;
}

// Lê os tokens do global.css: as texturas são desenhadas em <canvas> e os
// materiais do three.js não entendem var(--...), então o valor é resolvido
// aqui, uma vez, em vez de repetir hex no JS.
function showcaseTokens() {
    const css = getComputedStyle(document.documentElement);
    const v = (name) => css.getPropertyValue(name).trim();
    return {
        bg: v('--color-bg'),
        surface: v('--color-surface'),
        border: v('--color-border'),
        borderStrong: v('--color-border-strong'),
        primary: v('--color-primary'),
        secondary: v('--color-secondary'),
        text: v('--color-text'),
        muted: v('--color-text-muted'),
        fontDisplay: v('--font-display'),
        fontBody: v('--font-body'),
    };
}

// ---------- Cena (portada do protótipo) ----------
//
// Duas mudanças em relação ao protótipo, as duas de comportamento e não de
// forma:
// 1. Cada peça fica dentro de um "pivô". No protótipo o loop sobrescrevia o
//    rotation.x que cada builder definia, então a placa perdia a inclinação e
//    os discos (cardápio, Pix, fidelidade, porta-copo) apareciam quase de
//    perfil, com a arte ilegível. Agora o arraste gira o pivô e a inclinação
//    própria da peça continua valendo.
// 2. Os discos inclinam +55° (o protótipo tinha −55°, que com o item 1
//    corrigido deixaria a face impressa de costas para a câmera).
// Fora isso, geometria e texturas são as mesmas, trocando só "zaptag" por
// "Zap Tag" (grafia oficial) e as cores/fontes pelos tokens.
function showcaseCreateScene(THREE, stage, tokens) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.4, 5.2);

    // Fundo transparente: a cor vem do .showcase__stage no CSS.
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = 'showcase__canvas';
    stage.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key1 = new THREE.DirectionalLight(0xffffff, 0.9);
    key1.position.set(3, 4, 5);
    scene.add(key1);
    const key2 = new THREE.DirectionalLight(new THREE.Color(tokens.secondary), 0.25);
    key2.position.set(-4, -2, -3);
    scene.add(key2);

    const PENT = [[-0.81, 0.6], [0.39, 0.6], [0.81, 0], [0.39, -0.6], [-0.81, -0.6]];
    const HOLE_C = [-0.35, 0.24];
    const HOLE_R = 0.16;
    const BOLT = [[0.21, 0.48], [-0.19, -0.04], [0.05, -0.04], [-0.11, -0.56], [0.45, 0.08], [0.13, 0.08]];
    const DISC_TILT = THREE.MathUtils.degToRad(55);

    const primaryMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(tokens.primary), roughness: 0.55, metalness: 0.04 });
    const darkMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(tokens.surface), roughness: 0.6, metalness: 0.05 });
    const windowMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(tokens.text), roughness: 0.15, metalness: 0, transparent: true, opacity: 0.5 });
    const chipMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(tokens.bg), roughness: 0.4, metalness: 0.3 });
    const sharedMats = [primaryMat, darkMat, windowMat, chipMat];

    function buildTagShape() {
        const shape = new THREE.Shape();
        shape.moveTo(PENT[0][0], PENT[0][1]);
        for (let i = 1; i < PENT.length; i++) shape.lineTo(PENT[i][0], PENT[i][1]);
        shape.closePath();

        const hole = new THREE.Path();
        hole.absarc(HOLE_C[0], HOLE_C[1], HOLE_R, 0, Math.PI * 2, false);
        shape.holes.push(hole);

        const bolt = new THREE.Path();
        bolt.moveTo(BOLT[0][0], BOLT[0][1]);
        for (let j = 1; j < BOLT.length; j++) bolt.lineTo(BOLT[j][0], BOLT[j][1]);
        bolt.closePath();
        shape.holes.push(bolt);
        return shape;
    }

    function makeTagMesh(depth, material) {
        const geo = new THREE.ExtrudeGeometry(buildTagShape(), {
            depth, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 24,
        });
        geo.center();
        return new THREE.Mesh(geo, material || primaryMat);
    }

    function drawTagIcon2D(ctx, cx, cy, size, fill, cut) {
        ctx.save();
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.moveTo(cx + PENT[0][0] * size, cy - PENT[0][1] * size);
        for (let i = 1; i < PENT.length; i++) ctx.lineTo(cx + PENT[i][0] * size, cy - PENT[i][1] * size);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = cut;
        ctx.beginPath();
        ctx.arc(cx + HOLE_C[0] * size, cy - HOLE_C[1] * size, HOLE_R * size, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + BOLT[0][0] * size, cy - BOLT[0][1] * size);
        for (let j = 1; j < BOLT.length; j++) ctx.lineTo(cx + BOLT[j][0] * size, cy - BOLT[j][1] * size);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function canvasTexture(cv) {
        const tex = new THREE.CanvasTexture(cv);
        tex.needsUpdate = true;
        return tex;
    }

    function squareCanvas(W) {
        const cv = document.createElement('canvas');
        cv.width = W;
        cv.height = W;
        const ctx = cv.getContext('2d');
        ctx.fillStyle = tokens.surface;
        ctx.fillRect(0, 0, W, W);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        return { cv, ctx };
    }

    // Arco de "aproximação" (ondas + ponto), igual nas 4 peças com texto.
    function drawTapMark(ctx, x, y, arcs, lineWidth, dotR, waveColor, dotColor) {
        ctx.strokeStyle = waveColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        arcs.forEach(([r, alpha]) => {
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(x, y, r, -0.9, -0.15);
            ctx.stroke();
        });
        ctx.globalAlpha = 1;
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(x, y, dotR, 0, Math.PI * 2);
        ctx.fill();
    }

    function makePlacaTexture() {
        const cv = document.createElement('canvas');
        cv.width = 1024;
        cv.height = 620;
        const ctx = cv.getContext('2d');
        ctx.fillStyle = tokens.surface;
        ctx.fillRect(0, 0, cv.width, cv.height);

        drawTagIcon2D(ctx, 70, 64, 34, tokens.primary, tokens.surface);
        ctx.fillStyle = tokens.text;
        ctx.font = `500 30px ${tokens.fontDisplay}`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillText('Zap Tag', 112, 68);

        ctx.textAlign = 'center';
        ctx.fillStyle = tokens.text;
        ctx.font = `500 74px ${tokens.fontDisplay}`;
        let y = 200;
        ctx.fillText('AVALIE AQUI', cv.width / 2, y);

        y += 68;
        ctx.fillStyle = tokens.primary;
        ctx.font = `48px ${tokens.fontBody}`;
        ctx.fillText('★ ★ ★ ★ ★', cv.width / 2, y);

        y += 72;
        const word = 'Google';
        ctx.font = `500 56px ${tokens.fontBody}`;
        const widths = word.split('').map((ch) => ctx.measureText(ch).width);
        let cx = cv.width / 2 - widths.reduce((a, b) => a + b, 0) / 2;
        ctx.textAlign = 'left';
        for (let k = 0; k < word.length; k++) {
            ctx.fillStyle = SHOWCASE_PRINT_COLORS.google[k];
            ctx.fillText(word[k], cx, y);
            cx += widths[k];
        }
        ctx.textAlign = 'center';

        y += 90;
        ctx.fillStyle = tokens.muted;
        ctx.font = `500 34px ${tokens.fontBody}`;
        ctx.fillText('Só aproximar seu celular', cv.width / 2, y);

        drawTapMark(ctx, cv.width / 2 - 30, 520, [[36, 1], [58, 0.6], [80, 0.3]], 6, 12, tokens.secondary, tokens.primary);
        return canvasTexture(cv);
    }

    // Texturas circulares: o conteúdo fica dentro do círculo inscrito no
    // canvas quadrado, porque a CircleGeometry só mostra essa parte.
    function makeCardapioTexture() {
        const W = 700;
        const c = W / 2;
        const { cv, ctx } = squareCanvas(W);

        ctx.strokeStyle = tokens.primary;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(c, c, 300, 0, Math.PI * 2);
        ctx.stroke();

        // Garfo e faca.
        ctx.strokeStyle = tokens.muted;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        const fx = c - 34;
        const fy = c - 150;
        for (let t = -1; t <= 1; t++) {
            ctx.beginPath();
            ctx.moveTo(fx + t * 17, fy);
            ctx.lineTo(fx + t * 17, fy + 40);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(fx, fy + 40);
        ctx.lineTo(fx, fy + 95);
        ctx.stroke();
        const kx = c + 40;
        ctx.beginPath();
        ctx.moveTo(kx, fy);
        ctx.lineTo(kx, fy + 95);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(kx, fy, 14, Math.PI, 0);
        ctx.stroke();

        ctx.fillStyle = tokens.text;
        ctx.font = `500 62px ${tokens.fontDisplay}`;
        ctx.fillText('CARDÁPIO', c, c + 5);
        ctx.fillStyle = tokens.muted;
        ctx.font = `500 24px ${tokens.fontBody}`;
        ctx.fillText('encoste para ver', c, c + 52);

        drawTapMark(ctx, c, c + 175, [[26, 1], [42, 0.6]], 5, 9, tokens.secondary, tokens.primary);

        ctx.fillStyle = tokens.borderStrong;
        ctx.font = `500 20px ${tokens.fontDisplay}`;
        ctx.fillText('Zap Tag', c, c + 235);
        return canvasTexture(cv);
    }

    function makePixTexture() {
        const W = 700;
        const c = W / 2;
        const { cv, ctx } = squareCanvas(W);
        const pix = SHOWCASE_PRINT_COLORS.pix;

        ctx.globalAlpha = 0.12;
        ctx.fillStyle = pix;
        ctx.beginPath();
        ctx.arc(c, c, 290, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.55;
        ctx.strokeStyle = pix;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(c, c, 300, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.fillStyle = pix;
        ctx.font = `500 160px ${tokens.fontDisplay}`;
        ctx.fillText('PIX', c, c - 55);
        ctx.fillStyle = tokens.text;
        ctx.font = `500 27px ${tokens.fontBody}`;
        ctx.fillText('valor certo, sem digitar', c, c + 62);
        ctx.fillStyle = tokens.muted;
        ctx.font = `500 21px ${tokens.fontBody}`;
        ctx.fillText('encoste para pagar', c, c + 95);

        drawTapMark(ctx, c, c + 160, [[22, 1], [34, 0.6]], 5, 7, tokens.primary, tokens.secondary);

        ctx.fillStyle = tokens.borderStrong;
        ctx.font = `500 19px ${tokens.fontDisplay}`;
        ctx.fillText('Zap Tag', c, c + 220);
        return canvasTexture(cv);
    }

    function makeFidelidadeTexture() {
        const W = 700;
        const c = W / 2;
        const { cv, ctx } = squareCanvas(W);

        ctx.fillStyle = tokens.text;
        ctx.font = `500 46px ${tokens.fontDisplay}`;
        ctx.fillText('FIDELIDADE', c, c - 195);
        ctx.fillStyle = tokens.muted;
        ctx.font = `500 21px ${tokens.fontBody}`;
        ctx.fillText('encoste a cada visita', c, c - 160);

        // 8 carimbos, todos vazios: é a mesma peça para todo mundo, não
        // mostra o progresso de ninguém (esse fica no digital, pela tag).
        const stampCount = 8;
        const ringR = 115;
        const stampR = 16;
        ctx.strokeStyle = tokens.borderStrong;
        ctx.lineWidth = 2.5;
        ctx.setLineDash([3, 4]);
        for (let i = 0; i < stampCount; i++) {
            const ang = -Math.PI / 2 + i * (Math.PI * 2 / stampCount);
            ctx.beginPath();
            ctx.arc(c + Math.cos(ang) * ringR, c + Math.sin(ang) * ringR, stampR, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        drawTagIcon2D(ctx, c, c, 62, tokens.primary, tokens.surface);

        ctx.fillStyle = tokens.muted;
        ctx.font = `500 20px ${tokens.fontBody}`;
        ctx.fillText('seu progresso fica salvo sozinho', c, c + 205);
        ctx.fillStyle = tokens.borderStrong;
        ctx.font = `500 17px ${tokens.fontDisplay}`;
        ctx.fillText('Zap Tag', c, c + 240);
        return canvasTexture(cv);
    }

    function labelDisc(radius, segments, texture, y) {
        const plane = new THREE.Mesh(
            new THREE.CircleGeometry(radius, segments),
            new THREE.MeshStandardMaterial({ map: texture, roughness: 0.5 }),
        );
        plane.rotation.x = -Math.PI / 2;
        plane.position.set(0, y, 0);
        return plane;
    }

    function chipWithWindow(g, chipR, chipH, winR, winH, x, winY, z) {
        const chip = new THREE.Mesh(new THREE.CylinderGeometry(chipR, chipR, chipH, 32), chipMat);
        chip.position.set(x, 0, z);
        g.add(chip);
        const win = new THREE.Mesh(new THREE.CylinderGeometry(winR, winR, winH, 32), windowMat);
        win.position.set(x, winY, z);
        g.add(win);
    }

    const BUILDERS = {
        chaveiro() {
            const g = new THREE.Group();
            const mesh = makeTagMesh(0.16, primaryMat);
            mesh.scale.set(1.3, 1.3, 1.3);
            g.add(mesh);
            return g;
        },
        suporte() {
            const g = new THREE.Group();
            const base = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.16, 0.9), darkMat);
            base.position.set(0, -1.05, 0);
            g.add(base);
            const mesh = makeTagMesh(0.55, primaryMat);
            mesh.scale.set(1.55, 1.55, 1.55);
            mesh.rotation.x = THREE.MathUtils.degToRad(-16);
            mesh.position.set(0, 0.05, 0.15);
            g.add(mesh);
            return g;
        },
        coaster() {
            const g = new THREE.Group();
            g.add(new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.22, 48), darkMat));
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(1.18, 0.012, 8, 60),
                new THREE.MeshStandardMaterial({ color: new THREE.Color(tokens.border), roughness: 0.7 }),
            );
            ring.rotation.x = Math.PI / 2;
            ring.position.y = 0.115;
            g.add(ring);
            const badge = makeTagMesh(0.12, primaryMat);
            badge.scale.set(0.62, 0.62, 0.62);
            badge.rotation.x = -Math.PI / 2;
            badge.position.y = 0.16;
            g.add(badge);
            g.rotation.x = DISC_TILT;
            return g;
        },
        placa() {
            const g = new THREE.Group();
            g.add(new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.6, 0.26), darkMat));
            const label = new THREE.Mesh(
                new THREE.PlaneGeometry(2.34, 1.417),
                new THREE.MeshStandardMaterial({ map: makePlacaTexture(), roughness: 0.5 }),
            );
            label.position.set(0, 0, 0.131);
            g.add(label);

            const chip = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 32), chipMat);
            chip.rotation.x = Math.PI / 2;
            chip.position.set(0.42, -0.52, 0.09);
            g.add(chip);
            const win = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32), windowMat);
            win.rotation.x = Math.PI / 2;
            win.position.set(0.42, -0.52, 0.14);
            g.add(win);

            const stand = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.14, 0.55), darkMat);
            stand.position.set(0, -0.87, -0.22);
            g.add(stand);
            g.rotation.x = THREE.MathUtils.degToRad(-8);
            return g;
        },
        cardapio() {
            const g = new THREE.Group();
            g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.15, 48), darkMat));
            g.add(labelDisc(0.9, 48, makeCardapioTexture(), 0.076));
            chipWithWindow(g, 0.14, 0.1, 0.18, 0.05, 0.5, 0.04, 0.35);
            g.rotation.x = DISC_TILT;
            return g;
        },
        pix() {
            const g = new THREE.Group();
            g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.12, 40), darkMat));
            g.add(labelDisc(0.58, 40, makePixTexture(), 0.061));
            chipWithWindow(g, 0.1, 0.08, 0.13, 0.04, 0, 0.02, 0);
            // Aba para prender na pasta da conta.
            const tab = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.36), darkMat);
            tab.position.set(0, 0, -0.86);
            g.add(tab);
            const clipHole = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.018, 8, 24), chipMat);
            clipHole.position.set(0, 0, -0.86);
            g.add(clipHole);
            g.rotation.x = DISC_TILT;
            return g;
        },
        fidelidade() {
            const g = new THREE.Group();
            g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.1, 40), darkMat));
            g.add(labelDisc(0.51, 40, makeFidelidadeTexture(), 0.051));
            chipWithWindow(g, 0.09, 0.07, 0.12, 0.035, 0, 0.018, 0);
            g.rotation.x = DISC_TILT;
            return g;
        },
    };

    // Pivô: recebe arraste + auto-rotação. A peça fica dentro dele com a
    // inclinação própria intacta.
    const pivot = new THREE.Group();
    scene.add(pivot);
    let current = null;

    function disposeGroup(g) {
        g.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material && !sharedMats.includes(obj.material)) {
                if (obj.material.map) obj.material.map.dispose();
                obj.material.dispose();
            }
        });
    }

    // Enquadramento. O protótipo tinha a câmera fixa em z 5,2, pensada para
    // uma tela larga e para os discos vistos de perfil. Com os discos
    // inclinados, o porta-copo saía cortado, a ficha de fidelidade ficava
    // ilegível de tão pequena, e no celular (palco estreito) a placa também
    // cortava. Agora a distância sai do raio da peça (a esfera que ela varre
    // girando no pivô) e do lado mais estreito do palco. O piso de distância
    // impede que as peças pequenas fiquem do tamanho das grandes.
    const FIT_MARGIN = 1.15;
    const MIN_DISTANCE = 3.2;
    let pieceRadius = 1;

    function measurePiece() {
        const box = new THREE.Box3().setFromObject(current);
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        pieceRadius = sphere.radius + sphere.center.length();
    }

    function fitCamera() {
        const vHalf = THREE.MathUtils.degToRad(camera.fov / 2);
        const hHalf = Math.atan(Math.tan(vHalf) * camera.aspect);
        const d = Math.max(MIN_DISTANCE, (pieceRadius * FIT_MARGIN) / Math.sin(Math.min(vHalf, hHalf)));
        // Mesma proporção do protótipo (y 0,4 para z 5,2): olhar levemente
        // de cima.
        camera.position.set(0, d * (0.4 / 5.2), d);
        // O protótipo olhava reto para −z, o que deixava a peça abaixo do
        // centro; com a câmera mais perto isso ficava evidente no celular.
        camera.lookAt(0, 0, 0);
    }

    function setPiece(key) {
        if (current) {
            pivot.remove(current);
            disposeGroup(current);
        }
        current = BUILDERS[key]();
        pivot.add(current);
        pivot.rotation.set(0, 0, 0);
        pivot.updateMatrixWorld(true);
        measurePiece();
        fitCamera();
    }

    function resize() {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        fitCamera();
    }

    return { scene, camera, renderer, pivot, setPiece, resize };
}

// ---------- Modal ----------

function initShowcase() {
    const dialog = document.getElementById('showcase');
    const trigger = document.getElementById('showcase-open');
    if (!dialog || !trigger || typeof dialog.showModal !== 'function') return;

    const stage = document.getElementById('showcase-stage');
    const status = document.getElementById('showcase-status');
    const nameEl = document.getElementById('showcase-name');
    const descEl = document.getElementById('showcase-desc');
    const countEl = document.getElementById('showcase-count');
    const closeBtn = document.getElementById('showcase-close');
    const prevBtn = document.getElementById('showcase-prev');
    const nextBtn = document.getElementById('showcase-next');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let index = 0;
    let view = null; // cena montada (fica viva entre aberturas)
    let rafId = 0;
    let closing = false;
    let swapping = false;
    let dragRotY = 0;
    let dragRotX = 0.15;
    let autoRot = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    function wait(ms) {
        return new Promise((r) => setTimeout(r, reducedMotion.matches ? 0 : ms));
    }

    function showStatus(text) {
        status.textContent = text;
        status.hidden = false;
    }

    function renderInfo() {
        const piece = SHOWCASE_PIECES[index];
        nameEl.textContent = piece.name;
        descEl.textContent = piece.desc;
        countEl.textContent = `${index + 1} / ${SHOWCASE_PIECES.length}`;
        if (view) view.renderer.domElement.setAttribute('aria-label', `Modelo 3D: ${piece.name}`);
    }

    function loop() {
        rafId = requestAnimationFrame(loop);
        // Auto-rotação lenta do protótipo; parada com movimento reduzido
        // (o arraste continua funcionando).
        if (!dragging && !reducedMotion.matches) autoRot += 0.006;
        view.pivot.rotation.y = dragRotY + autoRot;
        view.pivot.rotation.x = dragRotX;
        view.renderer.render(view.scene, view.camera);
    }

    function startLoop() {
        if (view && !rafId) loop();
    }

    function stopLoop() {
        cancelAnimationFrame(rafId);
        rafId = 0;
    }

    function bindDrag(canvas) {
        canvas.addEventListener('pointerdown', (e) => {
            dragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            canvas.setPointerCapture(e.pointerId);
        });
        const end = () => { dragging = false; };
        canvas.addEventListener('pointerup', end);
        canvas.addEventListener('pointercancel', end);
        canvas.addEventListener('lostpointercapture', end);
        canvas.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            dragRotY += (e.clientX - lastX) * 0.008;
            dragRotX += (e.clientY - lastY) * 0.008;
            dragRotX = Math.max(-1.1, Math.min(1.1, dragRotX));
            lastX = e.clientX;
            lastY = e.clientY;
        });
    }

    async function mountScene() {
        if (!showcaseHasWebGL()) {
            showStatus('Seu navegador não suporta visualização 3D.');
            return;
        }
        showStatus('Carregando…');
        let THREE;
        try {
            THREE = await showcaseLoadThree();
        } catch (e) {
            showStatus('Não foi possível carregar a visualização 3D agora. Tente de novo em instantes.');
            return;
        }
        // As texturas escrevem com as fontes da página no <canvas>: esperar
        // que estejam prontas, senão a primeira peça sai em fonte do sistema.
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
        try {
            view = showcaseCreateScene(THREE, stage, showcaseTokens());
        } catch (e) {
            console.error('[zaptag] vitrine 3D falhou ao montar a cena:', e);
            showStatus('Seu navegador não suporta visualização 3D.');
            return;
        }
        status.hidden = true;
        const canvas = view.renderer.domElement;
        canvas.setAttribute('role', 'img');
        bindDrag(canvas);
        new ResizeObserver(() => view.resize()).observe(stage);
        view.resize();
        view.setPiece(SHOWCASE_PIECES[index].key);
        renderInfo();
        if (dialog.open && !closing) startLoop();
    }

    // Uma montagem só, mesmo que a pessoa feche e reabra com o three.js
    // ainda baixando. Se falhou sem cena, libera para tentar na próxima.
    let mounting = null;
    function ensureScene() {
        if (!mounting) {
            mounting = mountScene().then(() => {
                if (!view) mounting = null;
            });
        }
        return mounting;
    }

    function open() {
        closing = false;
        renderInfo();
        dialog.showModal();
        document.documentElement.classList.add('is-showcase-open');
        // Um frame no estado inicial (transparente, 96%) antes de animar.
        requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.add('is-open')));
        if (view) {
            view.resize();
            startLoop();
        } else {
            ensureScene();
        }
    }

    async function close() {
        if (!dialog.open || closing) return;
        closing = true;
        dialog.classList.remove('is-open');
        await wait(SHOWCASE_OPEN_MS);
        dialog.close();
        cleanup();
        // O Chromium devolve o foco ao gatilho só no próximo frame; aqui é
        // garantido.
        trigger.focus();
    }

    // Roda nos dois caminhos: direto no close() e no evento `close`. O evento
    // sozinho não basta, porque o Chromium só o entrega no próximo frame de
    // renderização (numa aba em segundo plano, nunca). E o close() sozinho
    // também não, porque o Chrome às vezes não deixa cancelar o Esc (dois Esc
    // seguidos sem outro gesto) e fecha o <dialog> direto, sem passar por ele.
    function cleanup() {
        stopLoop();
        dragging = false;
        dialog.classList.remove('is-open', 'is-swapping');
        document.documentElement.classList.remove('is-showcase-open');
        closing = false;
    }

    dialog.addEventListener('close', () => {
        if (!dialog.open) cleanup();
    });

    async function go(step) {
        if (swapping) return;
        swapping = true;
        index = (index + step + SHOWCASE_PIECES.length) % SHOWCASE_PIECES.length;
        dialog.classList.add('is-swapping');
        await wait(SHOWCASE_SWAP_MS);
        renderInfo();
        if (view) view.setPiece(SHOWCASE_PIECES[index].key);
        dialog.classList.remove('is-swapping');
        swapping = false;
    }

    trigger.hidden = false;
    trigger.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => go(-1));
    nextBtn.addEventListener('click', () => go(1));

    // Esc: o <dialog> fecharia na hora; o cancel é interceptado para fechar
    // com a mesma animação do X.
    dialog.addEventListener('cancel', (e) => {
        e.preventDefault();
        close();
    });

    // O <dialog> ocupa a tela toda e faz as vezes do overlay: clique nele
    // (e não no painel) é clique fora. Só conta se o clique também COMEÇOU
    // fora, pra um arraste do modelo que termina fora do painel não fechar.
    let downOnOverlay = false;
    dialog.addEventListener('pointerdown', (e) => {
        downOnOverlay = e.target === dialog;
    });
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog && downOnOverlay) close();
    });

    dialog.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
    });
}
