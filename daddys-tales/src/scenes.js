/* ==========================================================================
   Daddy's Tales: the pop-up scenes, one per story.
   Each returns { layers, tab:{label, snd}, css }.
   Layers: B = flat background, P(baseY) = pops up hinged at baseY, F = overlay.
   Anything with an sv-* class changes when the reader pulls the tab.
   ========================================================================== */
'use strict';

const Scenes = (() => {
  const A = Art;
  const { B, P, F, sky, stars, moon, ridge, hill, pine, tree, bareTree, cottage, house, grass, fog, rain, eyes, bubble, person, weeMan, sheep, donkey, bear, dog, mushroom, rat, crisps, blob, lg, rg, ink, seed, rr, rnd, f } = A;
  const NIGHT = ['#1d2148', '#3a3a6e', '#6a5a8a', '#d9a58a'];
  const DUSK = ['#3b3a6e', '#8a6a96', '#e6a07a', '#f3cf96'];
  const DAY = ['#8fb3d9', '#bcd4e8', '#e9eef0'];
  const STORM = ['#1a1f2e', '#2e3550', '#4a5470'];
  const tiles = (y0, c1, c2) => { let o = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 10; c++) o += `<rect x="${c * 40}" y="${y0 + r * 26}" width="40" height="26" fill="${(c + r) % 2 ? c1 : c2}"/>`; return o; };
  const wallpaper = (col, stripe, y1 = 400) => { let o = `<rect x="-10" y="-10" width="420" height="${y1 + 10}" fill="${col}"/>`; for (let x = 0; x < 420; x += 28) o += `<rect x="${x}" y="-10" width="9" height="${y1 + 10}" fill="${stripe}" opacity=".35"/>`; return o; };
  const windowFrame = (x, y, w, h, inner) => `<rect x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${h + 12}" fill="#5a3a26" ${ink}/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${inner}"/><path d="M${x + w / 2},${y}V${y + h}M${x},${y + h / 2}H${x + w}" stroke="#5a3a26" stroke-width="4"/>`;

  const S = {};

  // ---------------------------------------------------------------- cover
  S.cover = () => ({
    layers: [
      B(sky(NIGHT) + moon(310, 90, 26, '#2b2d5c') + ridge(330, 90, '#4b4a78', 3, 40) + ridge(360, 50, '#3a3a62', 8, 30), stars(70, 300, 3)),
      P(400, hill(372, 6, '#cfd3e2', 2) + cottage(150, 392, 120) + pine(40, 400, 110, '#22382e', true) + pine(80, 396, 80, '#2a4436', true)),
      P(460, hill(430, 8, '#e3e5ef', 5) + `<path d="M200,440h180v-30h-180Z" fill="#8a8a94" ${ink}/>` + (() => { let o = ''; seed(5); for (let i = 0; i < 14; i++) o += blob(210 + i * 13, 424 + (i % 2) * 8, 9, 7, i % 3 ? '#9a9aa6' : '#7a7a86', .2); return o; })(),
        weeMan(296, 418, 1, 26) + eyes(60, 330, '#ffe06a', 2, 7) + eyes(370, 300, '#ffe06a', 1.6, 6)),
    ],
  });

  // ---------------------------------------------------- 1 The Wee Man in the Well
  S.well = () => ({
    tab: { label: 'Peek into the well', snd: 'peek' },
    layers: [
      B(sky(NIGHT) + moon(320, 80, 22) + ridge(320, 70, '#4a4877', 2, 40) + hill(345, 10, '#3d4a5a', 4), stars(60, 260, 9)),
      P(360, cottage(70, 352, 60) + cottage(340, 350, 70) + cottage(260, 340, 44) + bareTree(130, 370, 120, '#2a2230')),
      P(470, hill(420, 4, '#556b4a', 7) + grass(426, '#3e5236', 30, 3) +
        // back rim + dark mouth
        `<ellipse cx="200" cy="350" rx="66" ry="16" fill="#6a6a72" ${ink}/><ellipse cx="200" cy="351" rx="56" ry="11" fill="#0d0d16"/>` +
        // roof and posts
        `<path d="M138,352V250M262,352V250" stroke="#4a3022" stroke-width="7"/><path d="M118,262L200,214L282,262Z" fill="#7a3b2a" ${ink}/><path d="M138,282H262" stroke="#3a2a1a" stroke-width="4"/><path d="M215,282v38" stroke="#c8b48a" stroke-width="1.4"/><path d="M206,320h18l-3,16h-12Z" fill="#7a5a3a" ${ink}/>`,
        // peeking wee man rises from inside the well
        `<g class="sv-pre">${eyes(200, 352, '#ffe36b', 2, 8)}</g>` +
        `<g class="sv-rise" style="--dy:44px">${weeMan(200, 386, 1.15, 0, { cloth: '#4a3a2c' })}</g>` +
        // front wall drawn over him
        `<path d="M134,352Q200,372 266,352V430Q200,450 134,430Z" fill="#8a8890" ${ink}/>` +
        (() => { let o = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) o += `<path d="M${140 + c * 21 + (r % 2) * 10},${366 + r * 17}h18" stroke="#5e5c66" stroke-width="1.4" opacity=".6"/>`; return o; })() +
        `<g transform="translate(250,352) rotate(-8)"><rect x="-14" y="-7" width="28" height="9" rx="3" fill="#e2b46a" ${ink}/><rect x="-11" y="-9" width="22" height="3" fill="#ffe28a"/></g>`),
    ],
  });

  // ---------------------------------------------------- 2 The wee man in the walls
  S.walls = () => ({
    tab: { label: 'Open the fridge', snd: 'fridge' },
    layers: [
      B(wallpaper('#3c4462', '#5a6488') + `<rect x="-10" y="380" width="420" height="20" fill="#2a2a3a"/>` + tiles(400, '#cfc8b8', '#5a5a6a') + windowFrame(40, 70, 90, 100, lg(['#1d2148', '#4a4a7a'])) + moon(100, 100, 12) +
        `<path d="M60,400v-22q12,-14 24,0v22Z" fill="#0f0f18"/>`, eyes(72, 388, '#ffe36b', 1.4, 5)),
      P(430, // fridge, open interior behind the door
        `<rect x="190" y="160" width="150" height="262" rx="12" fill="#e9e3d2" ${ink}/>` +
        `<rect x="198" y="168" width="134" height="246" rx="6" fill="${lg(['#fff6c8', '#f3e2a0'])}"/>` +
        `<path d="M198,240h134M198,310h134" stroke="#c9bb88" stroke-width="3"/>` +
        `<rect x="214" y="222" width="22" height="18" rx="3" fill="#c94a3a"/><rect x="300" y="210" width="16" height="30" rx="3" fill="#6aa04a"/>` +
        `<path d="M232,310l48,0l-6,-10h-36Z" fill="#dfe6ee" ${ink}/><rect x="240" y="292" width="30" height="10" rx="2" fill="#ffd94a"/>` +
        `<path d="M226,370h80" stroke="#c9bb88" stroke-width="3"/>` +
        weeMan(296, 309, .55, 30, { skin: '#c9b58a', cloth: '#7a6a5a' }) + `<path d="M287,281q-8,4 -12,12" stroke="#e07a8a" stroke-width="2" fill="none" stroke-linecap="round"/>`,
        // the door
        `<g class="sv-door"><rect x="190" y="160" width="150" height="262" rx="12" fill="${lg(['#f4efe2', '#d8d0bc'], 1, 0)}" ${ink}/><path d="M190,250H340" stroke="#bdb39a" stroke-width="2"/><rect x="204" y="190" width="7" height="44" rx="3" fill="#9a907a"/><rect x="204" y="268" width="7" height="60" rx="3" fill="#9a907a"/><circle cx="300" cy="200" r="7" fill="#e85a4a"/><rect x="280" y="210" width="34" height="22" fill="#fff" transform="rotate(4 297 221)" ${ink}/></g>`),
      P(470, `<rect x="20" y="300" width="140" height="12" fill="#7a4a2a" ${ink}/><rect x="30" y="312" width="8" height="150" fill="#5a3a22"/><rect x="142" y="312" width="8" height="150" fill="#5a3a22"/>` +
        `<rect x="70" y="270" width="40" height="28" rx="4" fill="#3a3a44" ${ink}/><circle cx="90" cy="284" r="9" fill="#1a1a22"/><circle cx="90" cy="284" r="4" fill="#4a6a9a"/>`,
        `<circle class="blinkred" cx="104" cy="275" r="2.4" fill="#ff3b30"/>`),
    ],
  });

  // ---------------------------------------------------- 3 The butter licker
  S.butter = () => ({
    tab: { label: 'Spring the trap', snd: 'snap' },
    layers: [
      B(wallpaper('#4a3a5a', '#6a5a7a', 330) + `<rect x="250" y="120" width="90" height="210" fill="#2a2030" ${ink}/><path d="M250,120h40v210h-40Z" fill="#ffd774" opacity=".8"/>` +
        person(282, 300, .8, { kid: true, coat: '#3a6a9a', hair: '#3a2416', face: 'scared' }) + `<rect x="-10" y="330" width="420" height="200" fill="#7a5032"/>`),
      P(440, `<path d="M-10,350H410V520H-10Z" fill="${lg(['#a06a3e', '#7a4a28'])}" ${ink}/>` + (() => { let o = ''; for (let i = 0; i < 6; i++) o += `<path d="M-10,${370 + i * 24}Q200,${366 + i * 24} 410,${372 + i * 24}" stroke="#6a3e20" stroke-width="1.2" opacity=".5" fill="none"/>`; return o; })() +
        // butter dish
        `<ellipse cx="110" cy="404" rx="62" ry="14" fill="#e6eaf0" ${ink}/><rect x="72" y="380" width="70" height="22" rx="3" fill="#ffd94a" ${ink}/><path d="M80,382q10,6 20,0q10,-6 20,0" stroke="#e9b82a" stroke-width="2" fill="none"/>` +
        // trap with cheese
        `<rect x="236" y="408" width="70" height="8" fill="#b88a5a" ${ink}/><path d="M256,408l18,-14l14,14Z" fill="#ffcf4a" ${ink}/><circle cx="268" cy="402" r="2.4" fill="#e0a82a"/><circle cx="278" cy="404" r="1.8" fill="#e0a82a"/>` +
        // tiny butter licker
        `<g transform="translate(210,412)">${blob(0, -10, 12, 10, '#5a4a52', .15, 9, ink)}<circle cx="-4" cy="-14" r="3.2" fill="#fff6b0"/><circle cx="5" cy="-14" r="3.2" fill="#fff6b0"/><circle cx="-3.4" cy="-14" r="1.3" fill="#111"/><circle cx="5.6" cy="-14" r="1.3" fill="#111"/><path d="M-2,-6q4,6 8,0" stroke="#e07a8a" stroke-width="2.2" fill="none"/><path d="M-12,-4q-10,2 -14,-8" stroke="#5a4a52" stroke-width="2" fill="none"/></g>`,
        // cage drops
        `<g class="sv-drop"><path d="M190,418V362Q246,320 302,362V418" fill="none" stroke="#6a6a72" stroke-width="3"/>` +
        (() => { let o = ''; for (let i = 0; i < 7; i++) { const x = 198 + i * 15; o += `<path d="M${x},418V${360 - Math.sin((i / 6) * Math.PI) * 26}" stroke="#7a7a84" stroke-width="2"/>`; } return o; })() +
        `<path d="M188,418h116" stroke="#5a5a62" stroke-width="5"/></g>` + `<g class="sv-hid" style="--d:.8s">${bubble(150, 300, 110, 40, 'Just a wee lick!', 'right', 14)}</g>`),
    ],
  });

  // ---------------------------------------------------- 4 Jamie
  S.jamie = () => ({
    tab: { label: 'Open the jar', snd: 'cork' },
    css: `.on .sv-lidoff{transform:translate(70px,-120px) rotate(40deg);opacity:0}`,
    layers: [
      B(`<rect x="-10" y="-10" width="420" height="520" fill="#d9cdb2"/>` + (() => {
        let o = ''; const cols = ['#c0392b', '#8e44ad', '#e67e22', '#c0392b', '#7a2a5a'];
        for (let r = 0; r < 3; r++) { const y = 110 + r * 110; o += `<rect x="-10" y="${y}" width="420" height="10" fill="#8a6a4a"/>`; for (let i = 0; i < 9; i++) { const x = 10 + i * 44; o += `<rect x="${x}" y="${y - 44}" width="30" height="44" rx="5" fill="${cols[(i + r) % 5]}" opacity=".85"/><rect x="${x - 1}" y="${y - 50}" width="32" height="8" rx="2" fill="#d9b44a"/><rect x="${x + 4}" y="${y - 30}" width="22" height="14" fill="#f6efdc"/>`; } }
        return o;
      })()),
      P(470, `<ellipse cx="200" cy="462" rx="110" ry="14" fill="#000" opacity=".2"/>` +
        `<path d="M110,250Q110,232 130,230H270Q290,232 290,250V440Q290,462 270,462H130Q110,462 110,440Z" fill="${lg(['#c6304a', '#8a1a30'])}" ${ink}/>` +
        `<g class="sv-pre"><circle cx="186" cy="320" r="4" fill="#ffd0a0" opacity=".8"/><circle cx="214" cy="320" r="4" fill="#ffd0a0" opacity=".8"/></g>` +
        `<path d="M110,250Q110,232 130,230H270Q290,232 290,250V440Q290,462 270,462H130Q110,462 110,440Z" fill="#fff" opacity=".12"/><path d="M128,250v170" stroke="#fff" stroke-width="8" opacity=".25" stroke-linecap="round"/>` +
        `<rect x="140" y="350" width="120" height="60" fill="#f6efdc" ${ink}/><text x="200" y="378" text-anchor="middle" font-family="IM Fell English SC, serif" font-size="17" fill="#8a1a30">Mixed Fruit</text><text x="200" y="400" text-anchor="middle" font-family="IM Fell English SC, serif" font-size="14" fill="#2a1a12" letter-spacing="2">DEFECTIVE</text>` +
        `<circle cx="262" cy="350" r="22" fill="#ffd72a" ${ink}/><text x="262" y="347" text-anchor="middle" font-family="IM Fell English, serif" font-size="9" fill="#a01a1a">reduced</text><text x="262" y="360" text-anchor="middle" font-family="IM Fell English, serif" font-size="12" fill="#a01a1a">10p</text>`,
        `<g class="sv-rise" style="--dy:80px">${bear(200, 300, .78, { col: '#8a4a2a' })}<path d="M175,250q4,14 0,22M228,248q3,16 -2,26M200,232q2,10 0,16" stroke="#c0304a" stroke-width="5" stroke-linecap="round" fill="none"/></g>` +
        `<path d="M112,246H288V262Q200,270 112,262Z" fill="#c6304a" opacity=".9"/>` +
        `<g class="sv-lidoff"><rect x="104" y="208" width="192" height="30" rx="5" fill="#d9b44a" ${ink}/><path d="M110,216h180M110,230h180" stroke="#b08a2a" stroke-width="2"/><path d="M104,214Q200,190 296,214" fill="#f2efe6" stroke="#2a1d14" stroke-opacity=".3"/></g>`),
    ],
  });

  // ---------------------------------------------------- 5 Corn patch jack
  S.corn = () => ({
    tab: { label: 'Who is in the corn?', snd: 'chomp' },
    layers: [
      B(sky(DAY) + blob(90, 80, 50, 14, '#fff', .2) + blob(300, 60, 60, 16, '#fff', .2) + ridge(250, 50, '#8aa0b0', 4, 50) + `<rect x="-10" y="250" width="420" height="60" fill="${lg(['#5a8aaa', '#9ac0d0'])}"/>` +
        `<path d="M40,262q20,-3 40,0M160,280q30,-3 60,0M290,266q20,-3 40,0" stroke="#fff" stroke-width="1.5" opacity=".7"/>`,
        `<g class="bob"><circle cx="150" cy="274" r="6" fill="#f0c9a6"/><path d="M144,272a6,6 0 0 1 12,0" fill="#5a3a22"/></g><g class="bob" style="animation-delay:-1s"><circle cx="196" cy="278" r="6" fill="#e8b890"/><path d="M190,276a6,6 0 0 1 12,0" fill="#c9a050"/></g>`),
      P(310, hill(300, 4, '#7aa05a', 3) + `<g transform="translate(40,286) scale(.6)"><rect x="0" y="-30" width="60" height="30" rx="4" fill="#c0392b" ${ink}/><rect x="44" y="-50" width="22" height="22" fill="#d9e2ea" ${ink}/><circle cx="12" cy="0" r="10" fill="#2a2a2a"/><circle cx="54" cy="2" r="12" fill="#2a2a2a"/><rect x="-26" y="-22" width="28" height="16" fill="#e0b040"/></g>`),
      P(400, (() => { let o = `<rect x="200" y="300" width="220" height="110" fill="#c9b04a"/>`; seed(8); for (let i = 0; i < 26; i++) { const x = 200 + i * 8.5 + rr(-3, 3), h = rr(100, 150); o += `<path d="M${f(x)},400Q${f(x + 3)},${f(400 - h / 2)} ${f(x + rr(-6, 6))},${f(400 - h)}" stroke="${i % 3 ? '#8aa04a' : '#a0b05a'}" stroke-width="3" fill="none"/><path d="M${f(x)},${f(400 - h * .5)}q12,-8 18,-2M${f(x)},${f(400 - h * .7)}q-12,-8 -18,-2" stroke="#7a9a40" stroke-width="2.4" fill="none"/><ellipse cx="${f(x + 4)}" cy="${f(400 - h * .6)}" rx="3" ry="8" fill="#e8c84a"/>`; } return o; })(),
        `<g class="sv-pre">${eyes(282, 300, '#fff0a0', 1.8, 8)}</g>` + `<g class="sv-rise" style="--dy:60px">${person(282, 370, 1, { hairStyle: 'wild', hair: '#e6e2d6', coat: '#5a5a3a', skin: '#e2b896' })}<circle cx="278" cy="278" r="1" fill="#000"/></g>` +
        (() => { let o = ''; seed(9); for (let i = 0; i < 18; i++) { const x = 200 + i * 12 + rr(-3, 3); o += `<path d="M${f(x)},404Q${f(x + 2)},360 ${f(x + rr(-5, 5))},${f(rr(310, 330))}" stroke="#93a84e" stroke-width="3.4" fill="none"/>`; } return o; })()),
      P(480, hill(420, 3, '#8ab060', 6) + `<path d="M30,440L210,424L240,470L50,488Z" fill="#c94a3a" ${ink}/>` + (() => { let o = ''; for (let i = 1; i < 6; i++) o += `<path d="M${30 + i * 36},${440 - i * 3}L${50 + i * 38},${488 - i * 3}" stroke="#fff" stroke-width="5" opacity=".5"/><path d="M${30 + i * 4},${440 + i * 8}L${210 + i * 6},${424 + i * 8}" stroke="#fff" stroke-width="5" opacity=".4"/>`; return o; })() +
        `<ellipse cx="130" cy="452" rx="34" ry="10" fill="#f4f0e6" ${ink}/><path d="M108,448L150,440L156,450L114,458Z" fill="#e8c48a" ${ink}/><path d="M110,446L152,438" stroke="#7aa04a" stroke-width="3"/>`,
        `<circle class="sv-hid" cx="150" cy="444" r="8" fill="#f4f0e6"/>`),
    ],
  });

  // ---------------------------------------------------- 6 The wee man (forest)
  S.weeman = () => ({
    tab: { label: 'Wander off the trail', snd: 'creak' },
    css: `.sv-legs{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(.08);transition:transform 1.4s cubic-bezier(.3,1.3,.5,1)}.on .sv-legs{transform:none}`,
    layers: [
      B(sky(['#141a24', '#26343a', '#3a4a48']) + (() => { let o = ''; seed(3); for (let i = 0; i < 16; i++) { const x = rr(-10, 410); o += `<rect x="${f(x)}" y="0" width="${f(rr(8, 16))}" height="360" fill="#1e2a2a" opacity=".8"/>`; } return o; })() + hill(340, 6, '#2a3a30', 3)),
      P(380, (() => { let o = ''; seed(5); for (let i = 0; i < 9; i++) { const x = 20 + i * 46 + rr(-8, 8); o += pine(x, 380, rr(150, 220), '#1f3a2e', false, '#24402f'); } return o; })() +
        `<path d="M160,500Q220,430 196,380Q186,360 214,350" stroke="#c9b48a" stroke-width="40" fill="none" opacity=".55" stroke-linecap="round"/>`),
      P(470, bareTree(70, 470, 260, '#2a2222', 4) + `<path d="M330,470V200q14,-8 28,0V470Z" fill="#2a2222"/>` +
        person(210, 430, .7, { coat: '#c0392b', pack: '#e0a020', hat: '#2a4a6a', hairStyle: 'none' }),
        `<g class="sv-pre">${eyes(344, 300, '#ffe36b', 2, 8)}</g><g class="sv-legs">${weeMan(310, 470, 1.4, 160, { skin: '#7a8a5a' })}</g>` + grass(472, '#2a3a2a', 30, 8, 16)),
    ],
  });

  // ---------------------------------------------------- 7 The banshee
  S.banshee = () => ({
    tab: { label: 'Count thirteen knocks', snd: 'knock13', delay: 3300 },
    css: `.on .sv-knock{animation:knockdoor .24s 13 ease-in-out}@keyframes knockdoor{50%{transform:translateX(2px)}}.sv-ban{opacity:0;transform:translateY(40px);transition:all 1.2s ease}.on.late .sv-ban{opacity:.92;transform:none}`,
    layers: [
      B(sky(STORM) + `<path d="M0,0" />` + ridge(300, 40, '#2a3048', 5, 60) + hill(330, 6, '#2a3a3a', 3), moon(70, 70, 16, '#1e2440', '#c8cce0')),
      P(420, hill(380, 4, '#34463e', 4) + bareTree(60, 400, 170, '#1a1a22', 2) +
        `<rect x="150" y="230" width="210" height="170" fill="#d9d4c8" ${ink}/><path d="M136,236Q150,170 255,160Q360,170 374,236Z" fill="#6a5a3a" ${ink}/>` +
        `<rect x="300" y="270" width="40" height="44" fill="#ffd774" ${ink}/><path d="M320,270v44M300,292h40" stroke="#d9d4c8" stroke-width="3"/>` +
        `<rect x="170" y="270" width="40" height="44" fill="#ffd774" ${ink}/><path d="M190,270v44M170,292h40" stroke="#d9d4c8" stroke-width="3"/>`,
        `<g class="sv-knock"><rect x="232" y="300" width="46" height="100" rx="3" fill="#3a5a4a" ${ink}/><circle cx="268" cy="352" r="3" fill="#d9b44a"/><path d="M240,316h30M240,340h30M240,364h30" stroke="#2a4a3a" stroke-width="1.5"/></g>`),
      P(470, `<g class="sv-ban"><path d="M60,470Q50,380 74,320Q92,276 110,276Q128,276 146,320Q170,380 160,470Q148,452 134,470Q122,450 110,470Q98,450 86,470Q74,452 60,470Z" fill="#f2f4fa" opacity=".9"/>` +
        `<path d="M86,300Q84,250 110,246Q136,250 134,300Q140,340 150,360L136,330Q124,300 110,300Q96,300 84,330L70,360Q80,340 86,300Z" fill="#dcdce8"/>` +
        `<ellipse cx="110" cy="276" rx="16" ry="20" fill="#eef0f8"/><ellipse cx="103" cy="272" rx="4" ry="6" fill="#1a1a2a"/><ellipse cx="117" cy="272" rx="4" ry="6" fill="#1a1a2a"/><ellipse cx="110" cy="288" rx="4" ry="7" fill="#1a1a2a"/>` +
        `<path d="M78,330q-26,10 -34,-14M142,330q26,10 34,-14" stroke="#eef0f8" stroke-width="8" stroke-linecap="round" fill="none"/></g>`,
        fog(440, .55) + fog(470, .45, 'drift slow')),
    ],
  });

  // ---------------------------------------------------- 8 Bobby Jelly Belly
  S.bobby = () => ({
    tab: { label: 'One more spoonful', snd: 'bobby' },
    css: `.on .sv-belly{animation:inflate 1.1s forwards}@keyframes inflate{60%{transform:scale(1.5)}80%{transform:scale(1.7)}100%{transform:scale(1.8);opacity:0}}.sv-belly{transform-box:fill-box;transform-origin:50% 80%}`,
    layers: [
      B(sky(['#8ec0e8', '#cfe6f2', '#f2f6ee']) + blob(320, 70, 50, 16, '#fff', .2) + blob(80, 110, 40, 12, '#fff', .2) + hill(300, 10, '#8ac06a', 3), moon(60, 60, 18, false, '#ffe68a')),
      P(330, `<path d="M240,330L270,210L300,330M370,330L340,210" stroke="#c0392b" stroke-width="6" fill="none"/><path d="M262,210H350" stroke="#c0392b" stroke-width="6"/>` +
        `<g class="swing"><path d="M290,212V286M310,212V286" stroke="#555" stroke-width="1.5"/><rect x="284" y="286" width="32" height="6" fill="#3a6aa0"/></g>` +
        `<path d="M40,330L100,230H130L130,330M100,230L40,330" stroke="#3a7aba" stroke-width="5" fill="none"/><path d="M130,236Q160,250 190,330" stroke="#f0c040" stroke-width="12" fill="none" stroke-linecap="round"/>`),
      P(400, `<g transform="translate(250,400)"><rect x="0" y="-80" width="140" height="70" rx="10" fill="#f6dce4" ${ink}/><rect x="10" y="-70" width="50" height="30" fill="#bfe0f0" ${ink}/><rect x="70" y="-68" width="60" height="22" fill="#fff6e0"/><text x="100" y="-52" text-anchor="middle" font-family="IM Fell English, serif" font-size="11" fill="#c0306a">Ices</text><circle cx="30" cy="-6" r="12" fill="#333"/><circle cx="110" cy="-6" r="12" fill="#333"/><path d="M60,-80l10,-30l10,30Z" fill="#e8b46a"/><circle cx="70" cy="-112" r="10" fill="#f6a0c0"/></g>` +
        person(60, 402, .7, { kid: true, coat: '#e67e22', arms: 'up', hair: '#2a1a12' }) + person(110, 404, .7, { kid: true, coat: '#27ae60', arms: 'up', hairStyle: 'long', hair: '#8a5a2a' })),
      P(470, hill(440, 4, '#9ad070', 6),
        `<g class="sv-belly">${person(200, 468, 1.2, { kid: true, coat: '#f0e050', belly: 18, legs: '#3a5a9a', hair: '#a06a3a', armR: 'out' })}<circle cx="200" cy="436" r="20" fill="#f0e050" ${ink}/><path d="M232,404l10,-24l8,24Z" fill="#e8b46a"/><circle cx="242" cy="378" r="9" fill="#fff4f8"/><circle cx="242" cy="370" r="4" fill="#c0304a"/></g>` +
        (() => { let o = ''; const cols = ['#f6b0c8', '#fff4e4', '#8a5030', '#c8f0b0', '#f6b0c8', '#fff4e4']; seed(12); for (let i = 0; i < 16; i++) { const x = rr(20, 380), y = rr(400, 480), r = rr(10, 26); o += `<g class="sv-grow" style="--d:${f(1 + rnd() * .5)}s">${blob(x, y, r, r * .6, cols[i % 6], .3)}</g>`; } for (let i = 0; i < 30; i++) o += `<rect class="sv-grow" style="--d:1.1s" x="${f(rr(20, 380))}" y="${f(rr(380, 480))}" width="5" height="2" fill="${['#e74c3c', '#3498db', '#f1c40f', '#2ecc71'][i % 4]}"/>`; return o; })()),
    ],
  });

  // ---------------------------------------------------- 9 The knocking box
  S.box = () => ({
    tab: { label: 'Open the box', snd: 'knock3' },
    css: `.sv-lid{transform-box:fill-box;transform-origin:50% 0%;transition:transform .9s cubic-bezier(.3,1.4,.5,1) .7s}.on .sv-lid{transform:translateY(-34px) scaleY(-.8)}.on .sv-boxshake{animation:boxshake .18s 4}@keyframes boxshake{50%{transform:translate(2px,-2px) rotate(.6deg)}}`,
    layers: [
      B(sky(DUSK) + moon(300, 120, 30, false, '#f3d29a') + `<rect x="-10" y="290" width="420" height="230" fill="#5a4630"/>` + ridge(296, 24, '#6a5070', 6, 50), ''),
      P(330, `<rect x="-10" y="300" width="420" height="40" fill="#6a5232"/>` + cottage(320, 316, 60, { roof: '#5a4a3a' }) +
        (() => { let o = ''; for (let i = 0; i < 6; i++) o += `<rect x="${30 + i * 26}" y="${300 - (i % 2) * 6}" width="22" height="12" rx="2" fill="#3a2a1a" ${ink}/>`; return o; })()),
      P(400, `<path d="M-10,350H410V520H-10Z" fill="#4a3a26"/>` + blob(80, 380, 70, 10, '#2a2a3a', .3) + blob(330, 400, 60, 8, '#2a2a3a', .3) + grass(352, '#6a6a3a', 26, 4) +
        `<path d="M70,380l6,-80l10,0l-6,80Z" fill="#6a4a2a"/><path d="M66,296h24v10h-24Z" fill="#8a8a92" ${ink}/>`),
      P(480, `<path d="M-10,430H410V520H-10Z" fill="#3e2e1e"/>`,
        `<g class="sv-boxshake"><rect x="120" y="360" width="160" height="90" fill="#7a5230" ${ink}/><path d="M120,384h160M120,416h160" stroke="#5a3a1e" stroke-width="2"/><rect x="190" y="378" width="20" height="16" fill="#b08a3a" ${ink}/>` +
        `<rect x="124" y="326" width="152" height="34" fill="#0a0810"/>${eyes(200, 340, '#ff5a3a', 2.6, 14, 'sv-hid')}` +
        `<g class="sv-lid"><path d="M116,330H284V362H116Z" fill="#8a6038" ${ink}/><path d="M116,344H284" stroke="#5a3a1e" stroke-width="2"/></g></g>` +
        blob(200, 460, 110, 12, '#3e2e1e', .2)),
    ],
  });

  // ---------------------------------------------------- 10 The curse of the weresheep
  S.weresheep = () => ({
    tab: { label: 'Wait for the moon', snd: 'growl' },
    css: `.sv-were{transform-box:fill-box;transform-origin:50% 100%;transition:transform 1s cubic-bezier(.3,1.5,.5,1)}.on .sv-were{transform:scale(1.3)}`,
    layers: [
      B(sky(NIGHT) + ridge(310, 120, '#3a3a66', 4, 60) + ridge(330, 60, '#2e3354', 9, 40),
        stars(50, 220, 4) + moon(250, 110, 36) + `<circle class="sv-hid" cx="250" cy="110" r="36" fill="#c0303a" opacity=".85"/>`),
      P(380, hill(350, 8, '#3a4a40', 3) + cottage(100, 360, 110) + `<text x="100" y="246" text-anchor="middle" font-family="IM Fell English SC, serif" font-size="11" fill="#e8e0c8" opacity=".7">Ballagh Cottage</text>`),
      P(470, hill(420, 4, '#46584a', 5) + (() => { let o = ''; seed(3); for (let i = 0; i < 18; i++) o += blob(10 + i * 23, 428 + rr(-3, 3), 12, 9, i % 2 ? '#7a7a80' : '#6a6a72', .25); return o; })() + grass(440, '#2e3a2e', 30, 6),
        `<g class="sv-were">${sheep(200, 470, 1.6, { wool: '#bab4a4', face: '#2a2420' })}<g class="sv-hid">${eyes(250, 419, '#ff2a2a', 2.2, 11, '')}<path d="M242,436l2,7l2,-7M254,436l2,7l2,-7" fill="#fff"/>` +
        (() => { let o = ''; seed(6); for (let i = 0; i < 12; i++) { const x = 170 + i * 6, y = 418 + rr(-6, 6); o += `<path d="M${f(x)},${f(y)}l${f(rr(-4, 4))},-10" stroke="#5a5048" stroke-width="2"/>`; } return o; })() + `</g></g>`),
    ],
  });

  // ---------------------------------------------------- 11 Diet Coke
  S.coke = () => ({
    tab: { label: 'Give her a big burp', snd: 'burp' },
    css: `.sv-up{transition:transform 1.2s cubic-bezier(.3,1.5,.5,1)}.on .sv-up{transform:translateY(-60px)}`,
    layers: [
      B(sky(['#7ab0e0', '#b8d8f0', '#eef6f6']) + blob(70, 90, 60, 18, '#fff', .2) + blob(320, 150, 70, 20, '#fff', .2) + hill(330, 12, '#9ac87a', 3) + hill(370, 10, '#86b866', 7)),
      P(470, hill(410, 6, '#7aae5a', 9) + grass(420, '#5a8a3a', 26, 3) +
        donkey(120, 440, .9, { extra: '' }) + sheep(250, 446, .7) + dog(330, 448, 1.1, '#c9a06a') +
        `<g transform="translate(40,446)">${blob(0, -16, 24, 14, '#f4f0e8', .1)}<circle cx="-6" cy="-18" r="5" fill="#2a2a2a"/><circle cx="12" cy="-12" r="4" fill="#2a2a2a"/><path d="M-14,-4v8M12,-4v8" stroke="#555" stroke-width="3"/><circle cx="24" cy="-24" r="8" fill="#f4f0e8" ${ink}/></g>`,
        `<g class="sv-hid" style="--d:.4s">${bubble(150, 330, 130, 36, 'Hee-haw! This way!', 'left', 13)}</g>`),
      F(`<g class="sv-up"><g class="floaty">` + (() => { let o = ''; seed(4); for (let i = 0; i < 18; i++) o += `<circle class="rise-bub" style="animation-delay:${f(rr(0, 3))}s" cx="${f(rr(150, 260))}" cy="${f(rr(200, 300))}" r="${f(rr(3, 8))}" fill="#fff" fill-opacity=".25" stroke="#fff" stroke-width="1"/>`; return o; })() +
        person(205, 240, 1, { coat: '#c0397a', hairStyle: 'long', hair: '#7a3a1a', arms: 'up', legs: '#2a3a5a' }) +
        `<g transform="translate(232,146) rotate(15)"><rect x="-7" y="-12" width="14" height="24" rx="3" fill="#d8dce2" ${ink}/><rect x="-7" y="-4" width="14" height="8" fill="#c0392b"/></g></g>` +
        `<g class="sv-hid"><path d="M160,260q-30,-6 -34,20q-24,6 -10,26q20,14 40,0q20,8 30,-12q4,-26 -26,-34Z" fill="#f2e6c8" opacity=".9"/><text x="146" y="290" text-anchor="middle" font-family="IM Fell English, serif" font-size="18" fill="#7a3a1a" transform="rotate(-10 146 290)">BURP!</text></g></g>`),
    ],
  });

  // ---------------------------------------------------- 12 Bear
  S.bear = () => ({
    tab: { label: 'Open the tin', snd: 'tin' },
    css: `.sv-lean{transform-box:fill-box;transform-origin:50% 100%;transition:transform .5s cubic-bezier(.3,1.6,.5,1)}.on .sv-lean{transform:rotate(-8deg) translateX(-10px)}.sv-tlid{transform-box:fill-box;transform-origin:0% 100%;transition:transform .5s .4s cubic-bezier(.3,1.8,.5,1)}.on .sv-tlid{transform:rotate(-110deg)}`,
    layers: [
      B(sky(['#cfe6c8', '#e8f2d8', '#f6f0d8']) + (() => { let o = ''; seed(2); for (let i = 0; i < 10; i++) o += tree(rr(-20, 420), rr(320, 340), rr(150, 220), i % 2 ? '#7aa060' : '#6a9050'); return o; })() + hill(340, 4, '#a8c87a', 4),
        `<g opacity=".35">${blob(120, 200, 40, 30, '#fff8d0', .3)}${blob(300, 240, 50, 30, '#fff8d0', .3)}</g>`),
      P(400, tree(40, 410, 260, '#4e7a3a', '#5a3a22', 7) + tree(370, 410, 240, '#5a8a40', '#5a3a22', 9) + hill(396, 4, '#9ac06a', 3) + grass(398, '#6a9a4a', 20, 2)),
      P(470, hill(440, 4, '#b0d080', 6) + grass(446, '#7aa050', 30, 5),
        `<g class="sv-lean">${bear(250, 460, 1.15, { fang: true })}</g>` + person(118, 462, 1.15, { kid: true, coat: '#3a6a9a', hair: '#c08a40', armR: 'out' }) +
        `<g transform="translate(160,414)"><rect x="-12" y="-8" width="24" height="22" rx="2" fill="#c8ccd2" ${ink}/><rect x="-12" y="-2" width="24" height="10" fill="#e67e22"/><g class="sv-tlid"><ellipse cx="0" cy="-8" rx="12" ry="3.5" fill="#e0e4ea" ${ink}/></g></g>` +
        (() => { let o = ''; for (let i = 0; i < 8; i++) o += `<circle class="sv-grow" style="--d:${.6 + i * .05}s" cx="${152 + i * 4 - 14}" cy="${398 - (i % 3) * 6}" r="3" fill="#e0602a"/>`; for (let i = 0; i < 3; i++) o += `<path class="sv-hid heart" style="--d:${.9 + i * .2}s" d="M${190 + i * 22},${330 - i * 10}c-6,-8 -16,0 0,10c16,-10 6,-18 0,-10Z" fill="#e05a6a"/>`; return o; })()),
    ],
  });

  // ---------------------------------------------------- 13 Donkey
  S.donkey = () => ({
    tab: { label: 'Listen for hooves', snd: 'hooves' },
    css: `.on .sv-flash{animation:flash 2.2s}@keyframes flash{0%,100%{opacity:0}8%{opacity:.85}14%{opacity:.1}20%{opacity:.7}40%{opacity:0}}`,
    layers: [
      B(sky(STORM) + ridge(280, 80, '#232a40', 6, 50) + hill(300, 10, '#2a3436', 2), `<path class="sv-hid" style="--d:.15s" d="M300,0l-20,60l14,0l-24,70l40,-90l-16,0l20,-40Z" fill="#f4f0ff"/>`),
      P(330, hill(300, 8, '#2e3a3a', 8),
        `<g class="sv-hid" style="--d:.25s">${donkey(300, 300, .9, { col: '#8a9a8a', dark: '#4a5a4a', eyes: eyes(345, 239, '#9aff6a', 1.4, 0, '') + '', extra: '<path d="M-20,-46v12M-10,-48v14M0,-48v14M10,-47v13" stroke="#3a443a" stroke-width="2.4"/>' })}</g>`),
      P(470, hill(380, 4, '#28322e', 4) + cottage(170, 430, 230, { roof: '#4a4030' }) + bareTree(360, 440, 180, '#141418', 6) + grass(434, '#1e2a22', 30, 4)),
      F(rain(80, 2) + `<rect class="sv-flash" x="-10" y="-10" width="420" height="520" fill="#eef0ff" opacity="0"/>`),
    ],
  });

  // ---------------------------------------------------- 14 Belfast Zoo Weremonkey
  S.monkey = () => ({
    tab: { label: 'Shake the cage', snd: 'rattle' },
    css: `.on .sv-cage{animation:cage .12s 6}@keyframes cage{50%{transform:translateX(3px)}}`,
    layers: [
      B(sky(['#5a6a5a', '#8a9a7a', '#c8c8a0']) + (() => { let o = ''; seed(5); for (let i = 0; i < 14; i++) o += blob(rr(-20, 420), rr(220, 320), rr(40, 70), rr(30, 50), i % 2 ? '#4a6a3a' : '#5a7a40', .25); return o; })()),
      P(430, `<rect x="90" y="190" width="220" height="230" fill="#14140f"/>`,
        `<g class="sv-pre">${eyes(200, 300, '#ffb84a', 2, 10)}</g>` +
        `<g class="sv-rise" style="--dy:30px"><g transform="translate(200,300)">${blob(0, 0, 50, 46, '#5a3a24', .12, 11)}<ellipse cx="-44" cy="-4" rx="12" ry="14" fill="#8a5a3a"/><ellipse cx="44" cy="-4" rx="12" ry="14" fill="#8a5a3a"/><ellipse cx="0" cy="8" rx="32" ry="30" fill="#c08a6a"/><path d="M-26,-16l18,8M26,-16l-18,8" stroke="#2a1a10" stroke-width="5" stroke-linecap="round"/><circle cx="-14" cy="-2" r="6" fill="#ffe08a"/><circle cx="14" cy="-2" r="6" fill="#ffe08a"/><circle cx="-14" cy="-2" r="2.4" fill="#111"/><circle cx="14" cy="-2" r="2.4" fill="#111"/><path d="M-4,10h8" stroke="#5a3020" stroke-width="3"/><path d="M-18,24q18,-10 36,0l-4,6l-4,-4l-4,6l-4,-6l-4,6l-4,-6l-4,4Z" fill="#fff" stroke="#5a2020" stroke-width="1.4"/></g>` +
        `<circle cx="140" cy="380" r="10" fill="#5a3a24"/><circle cx="262" cy="384" r="10" fill="#5a3a24"/></g>` +
        `<g class="sv-cage">` + (() => { let o = `<rect x="84" y="180" width="232" height="14" fill="#8a4a2a" ${ink}/><rect x="84" y="414" width="232" height="14" fill="#8a4a2a" ${ink}/>`; for (let i = 0; i < 10; i++) o += `<rect x="${92 + i * 23.5}" y="190" width="6" height="226" fill="${i % 3 ? '#9a5a32' : '#7a4426'}"/>`; return o; })() + `</g>`),
      P(480, (() => { let o = ''; seed(8); for (let i = 0; i < 60; i++) { const x = rr(-10, 410), h = rr(60, 130); o += `<path d="M${f(x)},500Q${f(x + rr(-8, 8))},${f(500 - h / 2)} ${f(x + rr(-20, 20))},${f(500 - h)}" stroke="${['#6a8a3a', '#7a9a40', '#5a7a30'][i % 3]}" stroke-width="3" fill="none"/>`; } return o; })() +
        `<g transform="translate(50,420) rotate(-12)"><rect x="-4" y="0" width="8" height="70" fill="#5a3a22"/><rect x="-44" y="-30" width="88" height="34" fill="#e8dcc0" ${ink}/><text x="0" y="-8" text-anchor="middle" font-family="IM Fell English SC, serif" font-size="13" fill="#8a2020">Keep Out</text></g>`),
    ],
  });

  // ---------------------------------------------------- 15 Birdie
  S.birdie = () => ({
    tab: { label: 'Offer the crisps', snd: 'squawk' },
    css: `.sv-lean2{transform-box:fill-box;transform-origin:0% 100%;transform:rotate(-30deg) translateX(30px);opacity:0;transition:all .8s cubic-bezier(.3,1.5,.5,1)}.on .sv-lean2{transform:none;opacity:1}`,
    layers: [
      B(sky(['#6a8ab0', '#a8c0d0', '#f0d8b0']) + `<rect x="-10" y="300" width="420" height="220" fill="${lg(['#3a6a8a', '#2a4a6a'])}"/>` + `<path d="M20,330q20,-4 40,0M100,360q30,-4 60,0M40,400q20,-4 40,0" stroke="#cfe2ee" stroke-width="2" opacity=".6"/>`,
        `<path class="gull" d="M60,120q8,-8 16,0q8,-8 16,0" stroke="#fff" stroke-width="2" fill="none"/><path class="gull" style="animation-delay:-2s" d="M120,90q6,-6 12,0q6,-6 12,0" stroke="#fff" stroke-width="2" fill="none"/>`),
      P(480, `<path d="M180,520L196,300L230,160L280,90L330,70L410,60V520Z" fill="${lg(['#6a6a62', '#4a4a44'])}" ${ink}/>` +
        `<path d="M220,240l40,-10M240,300l60,-6M260,180l50,-8M250,380l70,-4" stroke="#3a3a34" stroke-width="2" opacity=".6"/>` +
        `<ellipse cx="300" cy="160" rx="36" ry="28" fill="#141414"/>` + grass(90, '#6a8a3a', 0) + `<path d="M270,92Q330,60 410,62V80Q330,76 276,98Z" fill="#6a8a3a"/>` +
        `<path d="M196,300Q140,360 120,520H180Z" fill="#5a5a52"/>`,
        `<g class="sv-lean2"><g transform="translate(296,184)"><path d="M-14,0Q0,-6 14,0L16,30H-16Z" fill="#6a4a3a" ${ink}/><circle cx="0" cy="-16" r="15" fill="#3a3a4a" ${ink}/><path d="M-8,-30l4,-10l4,8l4,-10l3,12" fill="#3a3a4a"/><path d="M-12,-14L-40,-10L-12,-6Z" fill="#e8b030" ${ink}/><circle cx="-4" cy="-19" r="4" fill="#fff"/><circle cx="-5" cy="-19" r="2" fill="#111"/></g></g>` +
        `<g class="sv-hid" style="--d:.6s">${bubble(170, 90, 110, 40, 'Squawk! Ta!', 'right', 15)}</g>`),
      P(480, `<path d="M-10,430Q100,410 200,450V520H-10Z" fill="#7a9a4a"/>` + grass(440, '#5a7a30', 20, 3),
        person(110, 448, 1.1, { kid: true, coat: '#2a6a4a', hair: '#3a2416', armR: 'up' }) + crisps(138, 360, 1.3)),
    ],
  });

  // ---------------------------------------------------- 16 The fungus child
  S.fungus = () => ({
    tab: { label: 'Follow the humming', snd: 'hum' },
    layers: [
      B(sky(['#141224', '#2a2440', '#3a3a50']) + (() => { let o = ''; seed(6); for (let i = 0; i < 12; i++) o += `<rect x="${f(rr(-10, 410))}" y="0" width="${f(rr(10, 22))}" height="380" fill="#1a1a2a"/>`; return o; })() + hill(370, 6, '#22283a', 3), stars(20, 120, 6)),
      P(420, hill(400, 6, '#2a3a2e', 4) + bareTree(60, 420, 220, '#1a1620', 8) + bareTree(350, 420, 200, '#1a1620', 3) + mushroom(90, 404, 1, '#b07a4a', true) + mushroom(330, 402, .8, '#9a6a3a', true)),
      P(480, hill(450, 4, '#2e4232', 6) + grass(456, '#1e2e22', 26, 2),
        `<g transform="translate(200,462)"><circle cx="0" cy="0" r="60" fill="${rg([[0, '#c8ff8a', .3], [1, '#c8ff8a', 0]])}"/>${person(0, 0, 1.15, { kid: true, coat: '#6a8a4a', skin: '#a8c07a', hairStyle: 'none', legs: '#5a7a3a' })}${mushroom(-8, -82, .9, '#c87a4a')}${mushroom(10, -78, .7, '#e0a05a')}${mushroom(-20, -40, .6, '#c87a4a')}</g>` +
        (() => { let o = ''; seed(3); for (let i = 0; i < 18; i++) { const x = rr(20, 380), y = rr(440, 495); o += `<g class="sv-grow" style="--d:${f(i * .08)}s">${mushroom(x, y, rr(.6, 1.3), ['#c87a4a', '#e0a05a', '#b05a3a'][i % 3], i % 3 === 0)}</g>`; } for (let i = 0; i < 14; i++) o += `<circle class="sv-hid spore" style="--d:${f(.4 + i * .07)}s;animation-delay:${f(rnd() * 3)}s" cx="${f(rr(60, 340))}" cy="${f(rr(300, 440))}" r="${f(rr(1.5, 3))}" fill="#e6ffb0"/>`; return o; })()),
    ],
  });

  // ---------------------------------------------------- 17 Clean Up Time
  S.cleanup = () => ({
    tab: { label: 'Look behind the sofa', snd: 'cuckoo' },
    css: `.sv-bird{transform:translate(220px,-200px) scale(.4);transition:transform 1s cubic-bezier(.3,1.3,.5,1) 1s}.on .sv-bird{transform:none}`,
    layers: [
      B(wallpaper('#c9b48a', '#a8865a', 380) + windowFrame(40, 60, 110, 90, lg(['#9ac0e0', '#d8e8f0'])) + `<path d="M40,130l30,-30l26,20l30,-30l24,24V150H40Z" fill="#6a8a6a"/>` + `<rect x="-10" y="380" width="420" height="140" fill="#7a4a3a"/>` + (() => { let o = ''; for (let i = 0; i < 6; i++) o += `<path d="M-10,${392 + i * 22}H410" stroke="#6a3a2a" stroke-width="1"/>`; return o; })()),
      P(380, `<rect x="270" y="250" width="100" height="78" rx="8" fill="#5a4a3a" ${ink}/><rect x="280" y="258" width="70" height="58" rx="6" fill="#8ab0c0"/><path d="M300,250l-14,-24M320,250l14,-26" stroke="#333" stroke-width="2"/><rect x="276" y="328" width="88" height="50" fill="#6a4a30" ${ink}/>`,
        `<rect class="tvflick" x="280" y="258" width="70" height="58" rx="6" fill="#d8f0ff" opacity=".4"/>`),
      P(470, `<g class="sv-rise" style="--dy:90px"><g transform="translate(170,300)">` + (() => { let o = ''; seed(9); for (let i = 0; i < 6; i++) { const a = -2.6 + i * .5; o += `<path class="wiggle" style="animation-delay:-${i * .3}s;transform-origin:0 0" d="M0,0Q${f(Math.cos(a) * 60)},${f(Math.sin(a) * 40 - 30)} ${f(Math.cos(a) * 100)},${f(Math.sin(a) * 70)}" stroke="#d8a050" stroke-width="10" stroke-linecap="round" fill="none"/>`; } o += blob(0, 0, 66, 48, '#e0aa5a', .2, 12, ink); for (let i = 0; i < 16; i++) o += `<ellipse cx="${f(rr(-50, 50))}" cy="${f(rr(-34, 34))}" rx="${f(rr(6, 10))}" ry="4" fill="#f2c870" transform="rotate(${f(rr(0, 180))} 0 0)" opacity=".8"/>`; return o; })() +
        `<circle cx="-20" cy="-14" r="16" fill="#fff" ${ink}/><circle cx="20" cy="-14" r="16" fill="#fff" ${ink}/><circle cx="-16" cy="-12" r="7" fill="#111"/><circle cx="16" cy="-12" r="7" fill="#111"/><path d="M-30,16Q0,40 30,16Q0,26 -30,16Z" fill="#5a1a1a"/></g></g>` +
        `<path d="M60,470V360Q60,330 90,330H310Q340,330 340,360V470Z" fill="#4a6a4a" ${ink}/><path d="M40,470V390Q40,370 60,370H80V470ZM360,470V390Q360,370 340,370H320V470Z" fill="#3e5a3e" ${ink}/><path d="M80,400H320V440H80Z" fill="#5a7a5a" ${ink}/><path d="M200,400v40" stroke="#3e5a3e" stroke-width="2"/>`,
        `<g transform="translate(110,474) rotate(70)"><rect x="-10" y="-30" width="20" height="60" rx="8" fill="#c0392b" ${ink}/><ellipse cx="0" cy="-30" rx="10" ry="3" fill="#e8c048"/></g>` + (() => { let o = ''; seed(2); for (let i = 0; i < 24; i++) o += `<ellipse cx="${f(rr(30, 380))}" cy="${f(rr(474, 496))}" rx="${f(rr(2, 5))}" ry="2" fill="#e8b860"/>`; return o; })() +
        `<g class="sv-bird"><g transform="translate(180,236)"><path class="flap" d="M-4,0Q-30,-26 -44,-6Q-24,-6 -4,6Z" fill="#8a7a6a"/><ellipse cx="0" cy="4" rx="18" ry="11" fill="#7a6a5a" ${ink}/><circle cx="16" cy="-4" r="8" fill="#7a6a5a"/><path d="M23,-4l9,2l-9,3Z" fill="#e8b030"/><circle cx="18" cy="-6" r="2" fill="#fff"/><circle cx="18.5" cy="-6" r="1" fill="#111"/><path d="M-16,6l-16,6l16,0Z" fill="#5a4a3a"/><path d="M-6,6q6,4 12,0M-6,10q6,4 12,0" stroke="#efe6d6" stroke-width="1.2" fill="none"/></g></g>`),
    ],
  });

  // ---------------------------------------------------- 18 Poo Man
  S.pooman = () => ({
    tab: { label: 'Here come the dogs', snd: 'bark' },
    css: `.sv-run{transform:translateX(-360px);transition:transform 1.3s cubic-bezier(.4,0,.3,1)}.on .sv-run{transform:none}.sv-fall{transform-box:fill-box;transform-origin:20% 100%;transition:transform .6s cubic-bezier(.5,0,.5,1.6) 1.1s}.on .sv-fall{transform:rotate(-82deg) translate(-10px,10px)}`,
    layers: [
      B(sky(['#a8c8d8', '#d0e2d8', '#eef0dc']) + (() => { let o = ''; seed(4); for (let i = 0; i < 12; i++) o += tree(rr(-20, 420), 330, rr(150, 230), i % 2 ? '#4e7a44' : '#3e6a3a'); return o; })()),
      P(400, hill(330, 6, '#7aa05a', 2) + `<path d="M120,520Q160,420 220,380Q270,350 300,330" stroke="#c8b08a" stroke-width="60" fill="none" stroke-linecap="round"/>` + tree(40, 400, 240, '#3a6a34', '#4a3022', 6) + tree(380, 400, 220, '#4a7a3a', '#4a3022', 8)),
      P(480, hill(440, 4, '#8ab060', 7) + grass(446, '#5a8a3a', 26, 9),
        `<ellipse cx="236" cy="470" rx="40" ry="10" fill="#6a4426"/>` + blob(240, 462, 22, 10, '#7a4a2a', .3) + blob(244, 454, 14, 7, '#7a4a2a', .3) +
        `<g class="sv-fall">${person(240, 462, 1.2, { coat: '#6a6a3a', hair: '#555', hat: '#3a3a2a', armR: 'out' })}<path d="M276,350l30,-40" stroke="#6a4a22" stroke-width="4" stroke-linecap="round"/><circle cx="306" cy="310" r="5" fill="#6a4426"/></g>` +
        `<g class="sv-hid" style="--d:1.6s"><circle class="fly" cx="200" cy="420" r="1.6" fill="#111"/><circle class="fly" style="animation-delay:-.5s" cx="260" cy="430" r="1.6" fill="#111"/><circle class="fly" style="animation-delay:-1s" cx="230" cy="410" r="1.6" fill="#111"/></g>` +
        `<g class="sv-run">${dog(110, 470, 1.4, '#a0703e')}${dog(60, 486, 1.2, '#2a2a2a')}${dog(150, 494, 1.1, '#e0d0b0')}</g>`),
    ],
  });

  // ---------------------------------------------------- 19 What's that shadow?
  S.shadow = () => ({
    tab: { label: 'What is that shadow?', snd: 'bubbles' },
    css: `.sv-swim{transform:translateX(-300px);transition:transform 2.4s cubic-bezier(.3,0,.3,1)}.on .sv-swim{transform:none}`,
    layers: [
      B(sky(['#6aa0d8', '#b0d0e8', '#e8f0e8']) + ridge(200, 70, '#6a8a9a', 3, 40) + ridge(220, 40, '#5a7a6a', 7, 30) + `<rect x="-10" y="226" width="420" height="300" fill="${lg(['#4a9aa0', '#1a4a5a', '#0e2a36'])}"/>` +
        (() => { let o = ''; seed(7); for (let i = 0; i < 14; i++) o += blob(rr(0, 400), rr(470, 500), rr(14, 26), rr(8, 12), i % 2 ? '#3a4a4a' : '#4a5a52', .3); return o; })(),
        (() => { let o = ''; seed(8); for (let i = 0; i < 8; i++) { const x = rr(10, 390); o += `<path class="weed" style="animation-delay:-${f(rr(0, 3))}s" d="M${f(x)},500Q${f(x - 12)},440 ${f(x + 6)},${f(rr(380, 420))}" stroke="#2a6a4a" stroke-width="4" fill="none" stroke-linecap="round"/>`; } return o; })()),
      P(240, `<path d="M-10,226Q200,222 410,226" stroke="#e8f6f8" stroke-width="3" fill="none"/>`),
      P(500, `<g transform="translate(230,240)"><circle cx="0" cy="-22" r="12" fill="#f0c9a6" ${ink}/><path d="M-12,-26a12,12 0 0 1 24,0" fill="#3a2416"/><circle cx="-4" cy="-24" r="1.4" fill="#111"/><circle cx="4" cy="-24" r="1.4" fill="#111"/><path d="M-30,-6q30,-10 60,0" stroke="#f0c9a6" stroke-width="7" stroke-linecap="round" fill="none"/></g>` +
        `<g transform="translate(230,232)"><path d="M-14,0Q-16,30 -6,60M14,0Q16,30 6,60" stroke="#e6bc98" stroke-width="10" stroke-linecap="round" fill="none" opacity=".85"/><path d="M-14,0h28v20h-28Z" fill="#2a6ab0" opacity=".85"/><g class="kick"><ellipse cx="-8" cy="66" rx="7" ry="4" fill="#e6bc98"/></g><g class="kick" style="animation-delay:-.4s"><ellipse cx="8" cy="66" rx="7" ry="4" fill="#e6bc98"/></g></g>`,
        `<g class="sv-swim"><g transform="translate(190,350)">${blob(0, 0, 80, 30, '#08121a', .15, 11)}<path d="M-70,0L-110,-24L-104,0L-110,24Z" fill="#08121a"/>${eyes(50, -6, '#d8ff5a', 2.6, 18, '')}<path d="M40,10l6,8l6,-8l6,8l6,-8" stroke="#e8f0e0" stroke-width="2" fill="none"/></g>` +
        (() => { let o = ''; for (let i = 0; i < 6; i++) o += `<circle class="rise-bub" style="animation-delay:${i * .4}s" cx="${250 + i * 4}" cy="${330 - i * 12}" r="${2 + i % 3}" fill="none" stroke="#cfeff4" stroke-width="1.2"/>`; return o; })() + `</g>`),
    ],
  });

  // ---------------------------------------------------- 20 Coo Coo
  S.coocoo = () => ({
    tab: { label: 'Coo coo... what was that?', snd: 'cuckoo3' },
    css: `.sv-ghost{opacity:0;transform:translate(140px,-160px) scale(.3);transition:all 1.4s cubic-bezier(.3,1.2,.5,1) .9s}.on .sv-ghost{opacity:.95;transform:none}`,
    layers: [
      B(sky(NIGHT) + ridge(300, 140, '#34346a', 3, 60) + ridge(330, 70, '#2a2e52', 5, 40), stars(80, 260, 5) + moon(70, 70, 14, '#1f2350')),
      P(470, hill(400, 6, '#2e3a3a', 2) + grass(408, '#1e2a26', 30, 7) +
        `<path d="M60,420L110,330L160,420Z" fill="#c0603a" ${ink}/><path d="M110,330L104,420H116Z" fill="#8a3a22"/><path d="M250,424L310,320L370,424Z" fill="#3a7a5a" ${ink}/><path d="M310,320L302,424H318Z" fill="#245a40"/>`,
        `<path d="M60,420L110,330L160,420Z" fill="#ffb060" opacity=".25" class="flicker"/>` +
        `<g transform="translate(205,440)"><path d="M-22,6l44,-10M-22,-4l44,10" stroke="#5a3a22" stroke-width="6" stroke-linecap="round"/><path class="flame" d="M0,0Q-16,-18 -4,-40Q0,-24 6,-30Q18,-14 0,0Z" fill="#ff9a2a"/><path class="flame" style="animation-delay:-.2s" d="M0,0Q-8,-12 -1,-24Q4,-14 6,-18Q10,-8 0,0Z" fill="#ffe06a"/><circle cx="0" cy="-10" r="60" fill="${rg([[0, '#ffb060', .35], [1, '#ffb060', 0]])}"/></g>` +
        person(170, 460, .8, { coat: '#3a5a8a', face: 'scared', hat: '#2a2a3a' }) + person(244, 462, .8, { coat: '#8a3a3a', face: 'scared', hairStyle: 'long', hair: '#c08a3a' })),
      F(`<g class="sv-ghost"><g transform="translate(220,170)"><circle cx="0" cy="0" r="80" fill="${rg([[0, '#d0e8ff', .35], [1, '#d0e8ff', 0]])}"/><path class="flap" d="M-6,0Q-60,-50 -90,-10Q-50,-14 -6,10Z" fill="#e8f0ff" opacity=".7"/><path class="flap" style="animation-direction:reverse" d="M6,0Q60,-50 90,-10Q50,-14 6,10Z" fill="#e8f0ff" opacity=".7"/><ellipse cx="0" cy="6" rx="22" ry="26" fill="#eef4ff" opacity=".85"/><circle cx="0" cy="-22" r="16" fill="#eef4ff" opacity=".9"/><path d="M-4,-14l4,8l4,-8Z" fill="#c8b070"/>${eyes(0, -24, '#7affd0', 3.4, 13, '')}</g></g>`),
    ],
  });

  // ---------------------------------------------------- 21 Tea Time
  S.tea = () => ({
    tab: { label: 'Pour the tea', snd: 'pour' },
    css: `.sv-pot{transform-box:fill-box;transform-origin:80% 80%;transition:transform .8s cubic-bezier(.3,1.3,.5,1)}.on .sv-pot{transform:rotate(-38deg) translate(10px,-8px)}`,
    layers: [
      B(wallpaper('#e8d8b0', '#c8a870', 330) + windowFrame(150, 60, 120, 100, lg(['#a8d0f0', '#d8eaf0'])) + `<path d="M150,140q30,-20 60,0t60,-6V160H150Z" fill="#6aa04a"/>` + `<rect x="-10" y="330" width="420" height="200" fill="#8a5a3a"/>`),
      P(380, `<rect x="40" y="250" width="40" height="130" fill="#7a4a2a"/><rect x="320" y="250" width="40" height="130" fill="#7a4a2a"/>` +
        person(70, 380, 1.1, { kid: true, coat: '#3a8a6a', hair: '#5a3416' }) +
        `<g transform="translate(332,380)">${blob(0, -40, 28, 32, '#9a9aa2', .12, 9, ink)}${blob(-26, -64, 15, 15, '#9a9aa2', .1)}${blob(26, -64, 15, 15, '#9a9aa2', .1)}<circle cx="-26" cy="-64" r="8" fill="#e8d8e0"/><circle cx="26" cy="-64" r="8" fill="#e8d8e0"/><circle cx="0" cy="-56" r="22" fill="#a8a8b0" ${ink}/><ellipse cx="0" cy="-50" rx="8" ry="10" fill="#2a2a30"/><circle cx="-9" cy="-62" r="2.4" fill="#111"/><circle cx="9" cy="-62" r="2.4" fill="#111"/><ellipse cx="0" cy="-26" rx="16" ry="14" fill="#e8e4e0"/></g>`),
      P(470, `<path d="M10,380H390L410,470H-10Z" fill="#f4f0e6" ${ink}/>` + (() => { let o = ''; for (let i = 0; i < 10; i++) o += `<path d="M${10 + i * 40},380L${-10 + i * 44},470" stroke="#d8a0a0" stroke-width="5" opacity=".5"/>`; for (let i = 0; i < 3; i++) o += `<path d="M${5 - i * 5},${400 + i * 28}H${395 + i * 5}" stroke="#d8a0a0" stroke-width="5" opacity=".5"/>`; return o; })() +
        `<ellipse cx="290" cy="410" rx="22" ry="7" fill="#fff" ${ink}/><path d="M276,396h28l-3,14h-22Z" fill="#fff" ${ink}/><path d="M304,400q8,0 6,8" stroke="#2a1d14" stroke-opacity=".4" fill="none" stroke-width="2"/>` +
        `<ellipse cx="160" cy="430" rx="40" ry="10" fill="#fff" ${ink}/>` + (() => { let o = ''; for (let i = 0; i < 5; i++) o += `<circle cx="${140 + i * 10}" cy="${424 - (i % 2) * 3}" r="7" fill="#d8a050" ${ink}/>`; return o; })(),
        `<path class="sv-hid" style="--d:.6s" d="M262,372Q276,380 286,398" stroke="#a0602a" stroke-width="4" fill="none"/>` +
        `<g class="sv-pot"><g transform="translate(232,380)">${blob(0, 0, 34, 26, '#3a6a9a', .05, 10, ink)}<path d="M28,-6q20,-6 26,-20" stroke="#3a6a9a" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-30,-10q-20,4 -14,22" stroke="#3a6a9a" stroke-width="5" fill="none"/><ellipse cx="0" cy="-24" rx="16" ry="5" fill="#2a5a8a"/><circle cx="0" cy="-30" r="4" fill="#2a5a8a"/><path d="M-20,4q20,10 40,0" stroke="#f4f0e6" stroke-width="3" fill="none"/></g></g>` +
        `<g class="sv-hid" style="--d:1s"><path class="steam" d="M286,390q-6,-12 0,-24t0,-24" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/></g>` +
        `<g class="sv-hid" style="--d:1.2s">${bubble(260, 200, 120, 40, "G'day, mate!", 'right', 15)}</g>`),
    ],
  });

  // ---------------------------------------------------- 22 Freak
  S.freak = () => ({
    tab: { label: 'Turn on the tap', snd: 'freak' },
    css: `.sv-rise.slow{transition-duration:1.4s;transition-delay:.8s}`,
    layers: [
      B((() => { let o = `<rect x="-10" y="-10" width="420" height="520" fill="#3a5a5e"/>`; for (let r = 0; r < 12; r++) for (let c = 0; c < 9; c++) o += `<rect x="${c * 46 + 2}" y="${r * 34 + 2}" width="42" height="30" fill="${(r * 3 + c) % 5 ? '#4a6e72' : '#56787a'}"/>`; return o; })() + windowFrame(300, 50, 70, 90, lg(['#141a2a', '#2a3448'])) + `<rect x="-10" y="400" width="420" height="120" fill="#2a3a3c"/>`, `<g class="rain">` + [0,1,2,3,4,5,6,7].map(i=>`<path d="M${308+i*8},${60+(i*23)%70}l-3,10" stroke="#9ab0d0" stroke-width="1"/>`).join('') + `</g>`),
      P(470, `<rect x="120" y="40" width="160" height="130" rx="8" fill="#a8b8bc" ${ink}/><rect x="130" y="50" width="140" height="110" rx="4" fill="${lg(['#5a6a7a', '#8a9aa8'], 1, 1)}"/>` +
        `<path d="M186,330h28v130h-28Z" fill="#e8ecee" ${ink}/>`,
        `<g class="sv-rise slow" style="--dy:110px"><g transform="translate(200,260)">${blob(0, -10, 40, 50, '#5a8a3a', .2, 11, ink)}<path class="wiggle" d="M-30,0Q-90,-30 -110,30" stroke="#5a8a3a" stroke-width="9" stroke-linecap="round" fill="none"/><path class="wiggle" style="animation-delay:-.6s" d="M30,0Q90,-40 110,20" stroke="#5a8a3a" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M-110,30l-8,8M-110,30l-2,10M110,20l8,8M110,20l2,10" stroke="#e8e0c0" stroke-width="2.4"/><ellipse cx="-14" cy="-24" rx="9" ry="7" fill="#1a2a12"/><ellipse cx="14" cy="-24" rx="9" ry="7" fill="#1a2a12"/><circle cx="-14" cy="-24" r="3" fill="#e8ff8a"/><circle cx="14" cy="-24" r="3" fill="#e8ff8a"/><ellipse cx="0" cy="4" rx="10" ry="12" fill="#1a1010"/><path d="M-20,-50q4,-10 12,-4M8,-56q8,-6 12,4" stroke="#3a6a2a" stroke-width="4" fill="none"/></g></g>` +
        `<path d="M110,300Q110,350 200,350Q290,350 290,300Z" fill="#f2f4f4" ${ink}/><ellipse cx="200" cy="300" rx="90" ry="14" fill="#e0e6e8" ${ink}/><ellipse cx="200" cy="302" rx="76" ry="9" fill="#9ab0b4"/>` +
        `<path d="M200,288v-30h26" stroke="#c8ccd0" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="180" cy="270" r="7" fill="#d8dce0" ${ink}/>` +
        `<g class="sv-hid"><path d="M226,262v34" stroke="#bfe6f0" stroke-width="5" opacity=".8"/>` + (() => { let o = ''; for (let i = 0; i < 6; i++) o += `<circle class="rise-bub" style="animation-delay:${i * .3}s" cx="${180 + i * 9}" cy="296" r="${3 + i % 3}" fill="none" stroke="#dff" stroke-width="1.4"/>`; return o; })() + `</g>`),
    ],
  });

  // ---------------------------------------------------- 23 Yellow Man
  S.yellow = () => ({
    tab: { label: 'Turn off the light', snd: 'whisper' },
    css: `.sv-dark{opacity:0;transition:opacity 1.2s}.on .sv-dark{opacity:.88}.sv-glowon{opacity:0;transition:opacity 1s 1s}.on .sv-glowon{opacity:1}`,
    layers: [
      B(wallpaper('#e8c83a', '#c8a020', 400) + `<rect x="-10" y="400" width="420" height="120" fill="#c8a82a"/>` +
        (() => { let o = ''; for (let r = 0; r < 3; r++) { const y = 120 + r * 90; o += `<rect x="20" y="${y}" width="360" height="8" fill="#a07a1a" ${ink}/>`; for (let i = 0; i < 9; i++) { const x = 34 + i * 38; o += `<rect x="${x}" y="${y - 40}" width="26" height="40" rx="4" fill="#f4eed0" fill-opacity=".55" ${ink}/><rect x="${x - 1}" y="${y - 44}" width="28" height="6" rx="2" fill="#8a7a50"/>${blob(x + 13, y - 14, 8, 10, '#d88a8a', .3)}`; } } return o; })()),
      P(480, `<path d="M40,480V400Q40,360 80,360H140Q170,360 170,400V480Z" fill="#f0d040" ${ink}/>` +
        person(270, 476, 1.6, { coat: '#e8c020', legs: '#c8a018', skin: '#e8d870', hair: '#c8b030', extra: '<path d="M-6,-86q6,4 12,0" stroke="#7a5a10" stroke-width="1.6" fill="none"/>' }),
        `<rect class="sv-dark" x="-10" y="-10" width="420" height="520" fill="#0a0806"/>` +
        `<g class="sv-glowon"><g transform="translate(270,476) scale(1.6)"><circle cx="-4" cy="-93" r="2.4" fill="#fff36a"/><circle cx="4" cy="-93" r="2.4" fill="#fff36a"/><path d="M-6,-85q6,6 12,0" stroke="#fff36a" stroke-width="1.6" fill="none"/></g>` +
        (() => { let o = ''; for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i += 2) o += `<circle cx="${47 + i * 38}" cy="${106 + r * 90}" r="8" fill="#ff9a9a" opacity=".35"/>`; return o; })() +
        `<text x="90" y="300" font-family="IM Fell English, serif" font-style="italic" font-size="20" fill="#fff36a" opacity=".85" class="whisper">lick... lick...</text></g>`),
    ],
  });

  // ---------------------------------------------------- 24 Rats on bicycles
  S.rats = () => ({
    tab: { label: 'Ring the bell', snd: 'bell' },
    css: `.on .sv-ride{animation:ride 3s cubic-bezier(.4,0,.6,1)}@keyframes ride{0%{transform:none}45%{transform:translateX(480px)}46%{transform:translateX(-480px)}100%{transform:none}}`,
    layers: [
      B(sky(DUSK) + (() => { let o = ''; seed(5); for (let i = 0; i < 8; i++) o += house(i * 56 - 20, 300, 50, rr(120, 190), ['#8a4a3a', '#6a4a4a', '#9a6a4a'][i % 3], '#3a2a2a'); return o; })(), stars(14, 80, 2)),
      P(380, `<rect x="40" y="200" width="320" height="180" fill="#b8a890" ${ink}/><rect x="30" y="180" width="340" height="34" fill="#2a6a4a" ${ink}/><text x="200" y="204" text-anchor="middle" font-family="IM Fell English SC, serif" font-size="20" fill="#f6efd8" letter-spacing="3">The Big Shop</text>` +
        `<path d="M40,214h320l-10,24h-300Z" fill="#e8e0c8"/>` + (() => { let o = ''; for (let i = 0; i < 8; i++) o += `<path d="M${40 + i * 40},214l${i % 2 ? 0 : 0},24" stroke="#2a6a4a" stroke-width="18" opacity=".7"/>`; return o; })() +
        `<rect x="60" y="250" width="110" height="110" fill="#ffe8a0" ${ink}/><rect x="230" y="250" width="110" height="110" fill="#ffe8a0" ${ink}/>` +
        (() => { let o = ''; for (let i = 0; i < 5; i++) o += `<rect x="${70 + i * 20}" y="${300}" width="14" height="${50}" fill="${['#e67e22', '#f1c40f', '#c0392b', '#27ae60', '#e8c88a'][i]}" opacity=".7"/><circle cx="${250 + i * 20}" cy="${330}" r="9" fill="${['#f1c40f', '#e8c88a', '#f1c40f', '#e8c88a', '#d8a050'][i]}" opacity=".8"/>`; return o; })() +
        `<rect x="180" y="250" width="40" height="130" fill="#4a3a2a" ${ink}/>` + person(200, 380, .75, { coat: '#2a3a5a', hat: '#1a2a3a', hairStyle: 'none', face: 'scared' })),
      P(480, `<rect x="-10" y="390" width="420" height="130" fill="#4a4a52"/><path d="M-10,440h50M80,440h60M180,440h60M280,440h60M380,440h40" stroke="#e8e0c0" stroke-width="5"/><rect x="-10" y="380" width="420" height="12" fill="#8a8a90"/>` +
        `<path d="M350,390V250" stroke="#2a2a30" stroke-width="5"/><path d="M340,250h20l-4,-16h-12Z" fill="#2a2a30"/>`,
        `<circle cx="350" cy="244" r="30" fill="${rg([[0, '#ffe08a', .6], [1, '#ffe08a', 0]])}"/>` +
        `<g class="sv-ride">${rat(120, 430, 1.5, '#c0392b')}${rat(220, 466, 1.4, '#2a6ab0')}${rat(60, 476, 1.3, '#27ae60')}` +
        `<g transform="translate(250,430)"><rect x="-6" y="-56" width="12" height="26" rx="3" fill="#e8742a" ${ink}/><rect x="-6" y="-48" width="12" height="8" fill="#2a5ab0"/></g></g>` +
        `<g class="sv-hid">` + (() => { let o = ''; seed(3); for (let i = 0; i < 14; i++) o += `<circle class="sv-grow" style="--d:${f(i * .04)}s" cx="${f(260 + i * 5 + rr(-4, 4))}" cy="${f(370 - Math.sin(i / 4) * 30 + rr(-4, 4))}" r="${f(rr(2, 4))}" fill="#ff9a3a"/>`; return o; })() + `</g>`),
    ],
  });

  // ----------------------------------------------------------- the end
  S.end = () => ({
    layers: [
      B(wallpaper('#2a3050', '#3a4268', 400) + windowFrame(130, 60, 140, 150, lg(['#1d2148', '#4a4a7a'])) + `<rect x="-10" y="400" width="420" height="120" fill="#4a3424"/>`, moon(220, 110, 18) + stars(10, 0)),
      P(470, `<rect x="40" y="330" width="130" height="90" rx="8" fill="#7a4a4a" ${ink}/><rect x="36" y="300" width="18" height="140" rx="4" fill="#5a3a2a"/><path d="M60,326h104v30h-104Z" fill="#f2ead8"/><rect x="230" y="330" width="130" height="90" rx="8" fill="#3a5a7a" ${ink}/><rect x="346" y="300" width="18" height="140" rx="4" fill="#5a3a2a"/><path d="M236,326h104v30h-104Z" fill="#f2ead8"/>` +
        `<rect x="186" y="380" width="28" height="60" fill="#6a4a2a" ${ink}/><rect x="180" y="374" width="40" height="8" fill="#7a5a3a"/><rect x="196" y="350" width="8" height="24" fill="#f4eedc"/>`,
        `<g transform="translate(200,348)"><path class="flame" d="M0,0Q-6,-8 0,-18Q6,-8 0,0Z" fill="#ffd060"/><circle cx="0" cy="-8" r="44" fill="${rg([[0, '#ffd060', .4], [1, '#ffd060', 0]])}"/></g>`),
    ],
  });

  // Order matches the stories in the PDF.
  const ORDER = ['well', 'walls', 'butter', 'jamie', 'corn', 'weeman', 'banshee', 'bobby', 'box', 'weresheep', 'coke', 'bear', 'donkey', 'monkey', 'birdie', 'fungus', 'cleanup', 'pooman', 'shadow', 'coocoo', 'tea', 'freak', 'yellow', 'rats'];
  return { S, ORDER };
})();
