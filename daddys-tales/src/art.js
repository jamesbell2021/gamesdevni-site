/* ==========================================================================
   Daddy's Tales: art library
   Everything is painted in code as SVG, in the same watercolour-on-paper
   style as "A Timeless Christmas Tree". Each scene is a stack of layers:
   the back layer lies flat and the others pop up off the page.
   ========================================================================== */
'use strict';

const Art = (() => {
  let UID = 0;
  const DEFS = [];
  const nid = () => 'a' + (UID++).toString(36);

  // Seeded random, so every scene paints the same way each time.
  let _s = 1;
  const seed = (n) => { _s = n * 9301 + 49297; };
  const rnd = () => { _s = (_s * 9301 + 49297) % 233280; return _s / 233280; };
  const rr = (a, b) => a + rnd() * (b - a);
  const f = (n) => Math.round(n * 10) / 10;

  // ---- gradients -------------------------------------------------------
  function lg(stops, x2 = 0, y2 = 1) {
    const id = nid();
    const st = stops.map((c, i) => Array.isArray(c)
      ? `<stop offset="${c[0]}" stop-color="${c[1]}" stop-opacity="${c[2] ?? 1}"/>`
      : `<stop offset="${i / (stops.length - 1)}" stop-color="${c}"/>`).join('');
    DEFS.push(`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${st}</linearGradient>`);
    return `url(#${id})`;
  }
  function rg(stops) {
    const id = nid();
    const st = stops.map((c) => `<stop offset="${c[0]}" stop-color="${c[1]}" stop-opacity="${c[2] ?? 1}"/>`).join('');
    DEFS.push(`<radialGradient id="${id}">${st}</radialGradient>`);
    return `url(#${id})`;
  }

  // ---- paths -----------------------------------------------------------
  function smooth(pts, closed) {
    const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
    let d = `M${f(p[1][0])},${f(p[1][1])}`;
    for (let i = 1; i < p.length - 2; i++) {
      const [x0, y0] = p[i - 1], [x1, y1] = p[i], [x2, y2] = p[i + 1], [x3, y3] = p[i + 2];
      d += `C${f(x1 + (x2 - x0) / 6)},${f(y1 + (y2 - y0) / 6)} ${f(x2 - (x3 - x1) / 6)},${f(y2 - (y3 - y1) / 6)} ${f(x2)},${f(y2)}`;
    }
    return d + (closed ? 'Z' : '');
  }
  function blob(cx, cy, rx, ry, fill, jit = 0.12, n = 9, extra = '') {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, k = 1 + rr(-jit, jit);
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return `<path d="${smooth(pts, true)}" fill="${fill}" ${extra}/>`;
  }
  const ink = 'stroke="#2a1d14" stroke-opacity=".35" stroke-width="1.2" stroke-linejoin="round"';

  // ---- landscape -------------------------------------------------------
  function sky(stops) { return `<rect x="-20" y="-20" width="440" height="540" fill="${lg(stops)}"/>`; }
  function stars(n, maxY = 260, s = 7) {
    seed(s); let o = '';
    for (let i = 0; i < n; i++) {
      const r = rr(.5, 1.5);
      o += `<circle class="twinkle" style="animation-delay:${f(rr(0, 4))}s" cx="${f(rr(0, 400))}" cy="${f(rr(0, maxY))}" r="${f(r)}" fill="#fff8e0"/>`;
    }
    return o;
  }
  function moon(x, y, r, crescent, col = '#f6edc8') {
    const glow = rg([[0, col, .45], [1, col, 0]]);
    let o = `<circle cx="${x}" cy="${y}" r="${r * 3}" fill="${glow}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;
    if (crescent) o += `<circle cx="${x + r * .45}" cy="${y - r * .2}" r="${r * .9}" fill="${crescent}"/>`;
    else o += `<circle cx="${x - r * .3}" cy="${y - r * .2}" r="${r * .22}" fill="#000" opacity=".06"/><circle cx="${x + r * .35}" cy="${y + r * .3}" r="${r * .15}" fill="#000" opacity=".06"/>`;
    return o;
  }
  function ridge(y, h, col, s, step = 30, bottom = 520) {
    seed(s); const pts = [];
    for (let x = -30; x <= 430; x += step * rr(.6, 1.3)) pts.push([x, y - rnd() * h]);
    pts.push([440, y - rnd() * h]);
    return `<path d="${smooth(pts)}L440,${bottom}L-40,${bottom}Z" fill="${col}"/>`;
  }
  function hill(y, amp, col, s, bottom = 520) {
    seed(s); const pts = []; const ph = rr(0, 6);
    for (let x = -30; x <= 440; x += 40) pts.push([x, y + Math.sin(x / 70 + ph) * amp + rr(-amp * .3, amp * .3)]);
    return `<path d="${smooth(pts)}L440,${bottom}L-40,${bottom}Z" fill="${col}"/>`;
  }
  function pine(x, y, h, col = '#2f4a3a', snow = false, dark) {
    const w = h * .5; let o = `<rect x="${f(x - h * .025)}" y="${f(y - h * .14)}" width="${f(h * .05)}" height="${f(h * .14)}" fill="#4a3022"/>`;
    const tiers = 5;
    for (let i = 0; i < tiers; i++) {
      const tb = y - h * .1 - i * h * .16, tw = w * (1 - i / (tiers + .6)), th = h * .3;
      const jag = []; const n = 6;
      for (let j = 0; j <= n; j++) jag.push(`${f(x - tw / 2 + (tw * j) / n)},${f(tb + (j % 2 ? -h * .025 : 0))}`);
      o += `<path d="M${f(x)},${f(tb - th)}L${jag.join('L')}Z" fill="${i % 2 && dark ? dark : col}"/>`;
      if (snow) o += `<path d="M${f(x - tw * .42)},${f(tb - 2)}Q${f(x)},${f(tb - 6)} ${f(x + tw * .42)},${f(tb - 2)}" stroke="#eef0f6" stroke-width="${f(h * .015 + .6)}" fill="none" stroke-linecap="round" opacity=".85"/>`;
    }
    return o;
  }
  function tree(x, y, h, col = '#4e6b3a', trunk = '#4a3022', s = 3) {
    seed(s);
    let o = `<path d="M${x - h * .05},${y}L${x - h * .03},${y - h * .55}L${x + h * .03},${y - h * .55}L${x + h * .05},${y}Z" fill="${trunk}"/>`;
    for (let i = 0; i < 5; i++) o += blob(x + rr(-h * .22, h * .22), y - h * rr(.55, .85), h * rr(.18, .26), h * rr(.15, .22), col, .18);
    o += blob(x, y - h * .78, h * .26, h * .2, col, .15);
    return o;
  }
  function bareTree(x, y, h, col = '#3a2a22', s = 5) {
    seed(s);
    let o = `<path d="M${x - h * .04},${y}Q${x - h * .02},${y - h * .5} ${x + h * .01},${y - h * .7}L${x + h * .03},${y - h * .68}Q${x + h * .03},${y - h * .4} ${x + h * .05},${y}Z" fill="${col}"/>`;
    for (let i = 0; i < 6; i++) {
      const by = y - h * rr(.35, .68), dir = i % 2 ? 1 : -1, len = h * rr(.2, .38);
      o += `<path d="M${x},${f(by)}Q${f(x + dir * len * .5)},${f(by - len * .2)} ${f(x + dir * len)},${f(by - len * rr(.4, .8))}" stroke="${col}" stroke-width="${f(h * .018)}" fill="none" stroke-linecap="round"/>`;
    }
    return o;
  }
  function cottage(x, y, w, opt = {}) {
    // A whitewashed Irish cottage with a rounded thatch roof.
    const h = w * .42, wall = opt.wall || '#efe9dc', roof = opt.roof || '#9a7a45', door = opt.door || '#8c2a22';
    const lit = opt.lit !== false, win = lit ? '#ffd774' : '#3c4258';
    let o = '';
    if (lit) o += `<ellipse cx="${x}" cy="${y - h * .4}" rx="${w * .8}" ry="${h}" fill="${rg([[0, '#ffd774', .25], [1, '#ffd774', 0]])}"/>`;
    o += `<rect x="${x - w * .38}" y="${y - h * .1 - w * .5}" width="${w * .08}" height="${w * .2}" fill="#d9d0c0" ${ink}/>`;
    o += `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" fill="${wall}" ${ink}/>`;
    o += `<path d="M${x - w * .56},${y - h + 4}Q${x - w * .5},${y - h - w * .32} ${x},${y - h - w * .36}Q${x + w * .5},${y - h - w * .32} ${x + w * .56},${y - h + 4}Z" fill="${roof}" ${ink}/>`;
    o += `<path d="M${x - w * .5},${y - h + 1}Q${x},${y - h + 6} ${x + w * .5},${y - h + 1}" stroke="#6f5530" stroke-width="2" fill="none"/>`;
    o += `<rect x="${x - w * .07}" y="${y - h * .62}" width="${w * .14}" height="${h * .62}" rx="2" fill="${door}" ${ink}/>`;
    for (const k of [-.3, .3]) o += `<rect x="${x + k * w - w * .08}" y="${y - h * .7}" width="${w * .16}" height="${h * .34}" fill="${win}" ${ink}/><path d="M${x + k * w},${y - h * .7}V${y - h * .36}M${x + k * w - w * .08},${y - h * .53}H${x + k * w + w * .08}" stroke="${wall}" stroke-width="1.5"/>`;
    return o;
  }
  function house(x, y, w, h, col, roof = '#4b3b3b', lit = true) {
    let o = `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${col}" ${ink}/><path d="M${x - 4},${y - h}L${x + w / 2},${y - h - w * .35}L${x + w + 4},${y - h}Z" fill="${roof}" ${ink}/>`;
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) o += `<rect x="${x + w * (.18 + c * .42)}" y="${y - h + h * (.15 + r * .42)}" width="${w * .22}" height="${h * .24}" fill="${(r + c) % 2 && lit ? '#ffd774' : '#39405a'}" ${ink}/>`;
    return o;
  }
  function grass(y, col, n = 30, s = 11, h = 12) {
    seed(s); let o = '';
    for (let i = 0; i < n; i++) {
      const x = rr(-10, 410), hh = rr(h * .5, h);
      o += `<path d="M${f(x - 3)},${y}Q${f(x - 4)},${f(y - hh * .6)} ${f(x - 6)},${f(y - hh)}M${f(x)},${y}Q${f(x)},${f(y - hh)} ${f(x + 1)},${f(y - hh * 1.2)}M${f(x + 3)},${y}Q${f(x + 4)},${f(y - hh * .6)} ${f(x + 7)},${f(y - hh * .9)}" stroke="${col}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    }
    return o;
  }
  function fog(y, op = .5, cls = 'drift') {
    return `<g class="${cls}" opacity="${op}">${blob(60, y, 130, 22, '#e8e6f0', .2)}${blob(260, y + 10, 160, 26, '#e8e6f0', .2)}${blob(460, y - 4, 140, 22, '#e8e6f0', .2)}</g>`;
  }
  function rain(n = 60, s = 4) {
    seed(s); let o = '<g class="rain">';
    for (let i = 0; i < n; i++) { const x = rr(-20, 420), y = rr(-40, 500); o += `<path d="M${f(x)},${f(y)}l-5,16" stroke="#cfd8ea" stroke-width="1" opacity=".55"/>`; }
    return o + '</g>';
  }
  function eyes(x, y, col = '#ffd84a', r = 3, gap = 9, cls = 'blink') {
    const g = rg([[0, col, .7], [1, col, 0]]);
    return `<g class="${cls}"><circle cx="${x}" cy="${y}" r="${r * 5}" fill="${g}"/><circle cx="${x - gap / 2}" cy="${y}" r="${r}" fill="${col}"/><circle cx="${x + gap / 2}" cy="${y}" r="${r}" fill="${col}"/><circle cx="${x - gap / 2}" cy="${y}" r="${r * .35}" fill="#1a1010"/><circle cx="${x + gap / 2}" cy="${y}" r="${r * .35}" fill="#1a1010"/></g>`;
  }
  function bubble(x, y, w, h, text, tail = 'left', fs = 15) {
    const tx = tail === 'left' ? x + w * .2 : x + w * .8;
    return `<g><path d="M${x + 8},${y}H${x + w - 8}Q${x + w},${y} ${x + w},${y + 8}V${y + h - 8}Q${x + w},${y + h} ${x + w - 8},${y + h}H${tx + 8}L${tx - (tail === 'left' ? 10 : -10)},${y + h + 14}L${tx - 4},${y + h}H${x + 8}Q${x},${y + h} ${x},${y + h - 8}V${y + 8}Q${x},${y} ${x + 8},${y}Z" fill="#fffaf0" ${ink}/><text x="${x + w / 2}" y="${y + h / 2 + fs * .35}" text-anchor="middle" font-family="IM Fell English, serif" font-size="${fs}" fill="#3a2418">${text}</text></g>`;
  }

  // ---- people ----------------------------------------------------------
  // Paper-doll figures like the family in the tree game. Feet at (x,y).
  function person(x, y, s = 1, o = {}) {
    const coat = o.coat || '#7a3b2a', legs = o.legs || '#3b3a4a', skin = o.skin || '#f0c9a6',
      hair = o.hair || '#5a3a22', kid = o.kid, flip = o.flip ? -1 : 1;
    const hr = kid ? 13 : 11, top = kid ? -62 : -92, body = kid ? -50 : -78, hem = kid ? -20 : -30;
    let g = `<ellipse cx="0" cy="2" rx="18" ry="4" fill="#000" opacity=".15"/>`;
    g += `<rect x="-8" y="${hem}" width="6" height="${-hem}" fill="${legs}"/><rect x="2" y="${hem}" width="6" height="${-hem}" fill="${legs}"/>`;
    g += `<ellipse cx="-6" cy="-1" rx="6" ry="3" fill="#2a2222"/><ellipse cx="6" cy="-1" rx="6" ry="3" fill="#2a2222"/>`;
    const armL = o.arms === 'up' ? `M-12,${body + 6}L-24,${body - 18}` : o.arms === 'out' ? `M-12,${body + 6}L-28,${body + 14}` : `M-12,${body + 6}L-16,${hem + 4}`;
    const armR = o.arms === 'up' || o.armR === 'up' ? `M12,${body + 6}L24,${body - 18}` : o.arms === 'out' || o.armR === 'out' ? `M12,${body + 6}L30,${body + 10}` : `M12,${body + 6}L16,${hem + 4}`;
    g += `<path d="${armL}M${0},0${armR}" stroke="${coat}" stroke-width="7" stroke-linecap="round" fill="none"/>`;
    g += `<path d="M-11,${body}Q0,${body - 5} 11,${body}L${16 + (o.belly || 0)},${hem}Q0,${hem + 4} ${-16 - (o.belly || 0)},${hem}Z" fill="${coat}" ${ink}/>`;
    if (o.scarf) g += `<path d="M-9,${body + 1}Q0,${body + 6} 9,${body + 1}" stroke="${o.scarf}" stroke-width="5" fill="none"/>`;
    g += `<circle cx="0" cy="${top}" r="${hr}" fill="${skin}" ${ink}/>`;
    if (o.hairStyle === 'long') g += `<path d="M${-hr - 1},${top + hr * 1.4}Q${-hr - 3},${top - hr * 1.2} 0,${top - hr - 1}Q${hr + 3},${top - hr * 1.2} ${hr + 1},${top + hr * 1.4}L${hr * .6},${top - hr * .2}Q0,${top - hr * .5} ${-hr * .6},${top - hr * .2}Z" fill="${hair}"/>`;
    else if (o.hairStyle === 'wild') { let w = ''; seed(77); for (let i = 0; i < 12; i++) { const a = Math.PI * (1 + i / 11); w += `<path d="M0,${top}L${f(Math.cos(a) * (hr + rr(5, 11)))},${f(top + Math.sin(a) * (hr + rr(5, 11)) )}" stroke="${hair}" stroke-width="4" stroke-linecap="round"/>`; } g += w + `<path d="M${-hr * .8},${top + 4}Q0,${top + hr * 2.4} ${hr * .8},${top + 4}" fill="${hair}"/>`; }
    else if (o.hairStyle !== 'none') g += `<path d="M${-hr},${top - 1}Q${-hr},${top - hr - 2} 0,${top - hr - 1}Q${hr},${top - hr - 2} ${hr},${top - 1}Q${hr * .4},${top - hr * .55} ${-hr},${top - 1}Z" fill="${hair}"/>`;
    if (o.hat) g += `<rect x="${-hr - 4}" y="${top - hr + 1}" width="${hr * 2 + 8}" height="3" fill="${o.hat}"/><rect x="${-hr * .7}" y="${top - hr * 2}" width="${hr * 1.4}" height="${hr * 1.1}" fill="${o.hat}"/>`;
    const ey = top - 1;
    if (o.face === 'scared') g += `<circle cx="-4" cy="${ey}" r="2.2" fill="#fff"/><circle cx="4" cy="${ey}" r="2.2" fill="#fff"/><circle cx="-4" cy="${ey}" r="1" fill="#222"/><circle cx="4" cy="${ey}" r="1" fill="#222"/><ellipse cx="0" cy="${top + 6}" rx="2.4" ry="3" fill="#5a2020"/>`;
    else g += `<circle cx="${-4 * flip}" cy="${ey}" r="1.4" fill="#2a1a12"/><circle cx="${4 * flip}" cy="${ey}" r="1.4" fill="#2a1a12"/><circle cx="-7" cy="${top + 4}" r="2.2" fill="#e8907a" opacity=".5"/><circle cx="7" cy="${top + 4}" r="2.2" fill="#e8907a" opacity=".5"/><path d="M-3,${top + 5}Q0,${top + 8} 3,${top + 5}" stroke="#7a3a2a" stroke-width="1.2" fill="none"/>`;
    if (o.pack) g = `<rect x="${-18 * flip}" y="${body + 2}" width="12" height="22" rx="3" fill="${o.pack}" ${ink}/>` + g;
    return `<g transform="translate(${x},${y}) scale(${s})">${g}${o.extra || ''}</g>`;
  }

  // ---- creatures -------------------------------------------------------
  function weeMan(x, y, s = 1, legLen = 30, o = {}) {
    const skin = o.skin || '#8d9a6b', cloth = o.cloth || '#5a4636';
    let g = '';
    const L = legLen;
    g += `<path d="M-5,${-L}L-12,${-L * .5}L-6,0M5,${-L}L12,${-L * .5}L7,0" stroke="${skin}" stroke-width="2.6" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
    g += `<path d="M-12,0h7M5,0h9" stroke="#2a2018" stroke-width="3" stroke-linecap="round"/>`;
    g += `<path d="M-8,${-L}Q0,${-L + 4} 8,${-L}L6,${-L - 22}Q0,${-L - 25} -6,${-L - 22}Z" fill="${cloth}" ${ink}/>`;
    g += `<path d="M-6,${-L - 18}L-16,${-L - 6}L-18,${-L + 2}M6,${-L - 18}L16,${-L - 8}L19,${-L}" stroke="${skin}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    const hy = -L - 34;
    g += `<path d="M-13,${hy - 2}L-22,${hy - 8}L-12,${hy + 4}ZM13,${hy - 2}L22,${hy - 8}L12,${hy + 4}Z" fill="${skin}" ${ink}/>`;
    g += `<ellipse cx="0" cy="${hy}" rx="13" ry="14" fill="${skin}" ${ink}/>`;
    g += `<path d="M-8,${hy - 9}Q-2,${hy - 13} 0,${hy - 8}Q3,${hy - 14} 8,${hy - 10}" stroke="#4a5232" stroke-width="1.2" fill="none"/>`;
    g += `<circle cx="-5" cy="${hy - 1}" r="3.2" fill="#ffe36b"/><circle cx="5" cy="${hy - 1}" r="3.2" fill="#ffe36b"/><circle cx="-5" cy="${hy - 1}" r="1.3" fill="#1a1010"/><circle cx="5" cy="${hy - 1}" r="1.3" fill="#1a1010"/>`;
    g += `<path d="M0,${hy}L-2,${hy + 5}L1,${hy + 5}" stroke="#4a5232" stroke-width="1.2" fill="none"/><path d="M-6,${hy + 8}Q0,${hy + 12} 7,${hy + 7}" stroke="#3a1a1a" stroke-width="1.6" fill="none"/>`;
    return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`;
  }
  function sheep(x, y, s = 1, o = {}) {
    const wool = o.wool || '#ece8dc', face = o.face || '#2d2826';
    seed(o.seed || 21); let g = `<ellipse cx="0" cy="2" rx="30" ry="5" fill="#000" opacity=".18"/>`;
    g += `<path d="M-18,-12v14M-8,-12v14M10,-12v14M20,-12v14" stroke="${face}" stroke-width="4" stroke-linecap="round"/>`;
    for (let i = 0; i < 11; i++) g += `<circle cx="${f(rr(-24, 22))}" cy="${f(rr(-34, -16))}" r="${f(rr(8, 12))}" fill="${wool}" ${i === 0 ? ink : ''}/>`;
    g += `<ellipse cx="30" cy="-30" rx="9" ry="11" fill="${face}" transform="rotate(-20 30 -30)"/>`;
    g += `<path d="M22,-38l-9,-3M36,-38l8,-5" stroke="${face}" stroke-width="4" stroke-linecap="round"/>`;
    g += o.eyes || `<circle cx="27" cy="-32" r="1.6" fill="#f3efe0"/><circle cx="34" cy="-32" r="1.6" fill="#f3efe0"/>`;
    return `<g transform="translate(${x},${y}) scale(${s})">${g}${o.extra || ''}</g>`;
  }
  function donkey(x, y, s = 1, o = {}) {
    const c = o.col || '#8a7a6a', d = o.dark || '#5a4c40';
    let g = `<ellipse cx="0" cy="2" rx="40" ry="5" fill="#000" opacity=".18"/>`;
    g += `<path d="M-28,-30v32M-18,-30v32M20,-30v32M30,-30v32" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`;
    g += `<path d="M-36,-34q-10,8 -8,22" stroke="${d}" stroke-width="3" fill="none"/>`;
    g += `<ellipse cx="0" cy="-40" rx="38" ry="18" fill="${c}" ${ink}/>`;
    g += `<path d="M28,-48L44,-74L60,-70L58,-58L40,-38Z" fill="${c}" ${ink}/>`;
    g += `<path d="M44,-74l-6,-24l8,4l4,20M50,-74l2,-26l7,8l-3,18" fill="${d}"/>`;
    g += `<ellipse cx="60" cy="-63" rx="7" ry="9" fill="#d8ccbc"/>`;
    g += o.eyes || `<circle cx="50" cy="-68" r="2" fill="#1a1414"/>`;
    g += `<path d="M30,-52q6,-12 14,-20" stroke="${d}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    return `<g transform="translate(${x},${y}) scale(${s})">${g}${o.extra || ''}</g>`;
  }
  function bear(x, y, s = 1, o = {}) {
    const c = o.col || '#7a4a2a', l = '#b07a50';
    let g = `<ellipse cx="0" cy="2" rx="46" ry="6" fill="#000" opacity=".18"/>`;
    g += blob(0, -38, 40, 38, c, .06, 11, ink);
    g += `<ellipse cx="-24" cy="-6" rx="14" ry="9" fill="${c}"/><ellipse cx="24" cy="-6" rx="14" ry="9" fill="${c}"/>`;
    g += `<ellipse cx="0" cy="-34" rx="22" ry="22" fill="${l}" opacity=".6"/>`;
    g += `<circle cx="-22" cy="-102" r="10" fill="${c}"/><circle cx="22" cy="-102" r="10" fill="${c}"/><circle cx="-22" cy="-102" r="5" fill="${l}"/><circle cx="22" cy="-102" r="5" fill="${l}"/>`;
    g += `<circle cx="0" cy="-84" r="27" fill="${c}" ${ink}/>`;
    g += `<ellipse cx="0" cy="-74" rx="13" ry="10" fill="${l}"/><ellipse cx="0" cy="-79" rx="5" ry="3.6" fill="#1e1410"/>`;
    g += `<circle cx="-10" cy="-90" r="2.6" fill="#1e1410"/><circle cx="10" cy="-90" r="2.6" fill="#1e1410"/><circle cx="-9" cy="-91" r=".9" fill="#fff"/><circle cx="11" cy="-91" r=".9" fill="#fff"/>`;
    g += `<path d="M-6,-70Q0,-66 6,-70" stroke="#3a1a10" stroke-width="1.5" fill="none"/>`;
    if (o.fang) g += `<path d="M3,-69.5l2.5,8l2.5,-8.6Z" fill="#fffef6" stroke="#8a8070" stroke-width=".6"/><path class="twinkle" style="animation-duration:1.6s" d="M8,-62l1,-3l1,3l3,1l-3,1l-1,3l-1,-3l-3,-1Z" fill="#fff"/>`;
    return `<g transform="translate(${x},${y}) scale(${s})">${g}${o.extra || ''}</g>`;
  }
  function dog(x, y, s = 1, col = '#a0703e', flip = false) {
    let g = `<ellipse cx="0" cy="2" rx="18" ry="3" fill="#000" opacity=".18"/><path d="M-12,-10v11M-6,-10v11M7,-10v11M13,-10v11" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`;
    g += `<ellipse cx="0" cy="-14" rx="17" ry="8" fill="${col}" ${ink}/><path d="M-16,-16q-8,-6 -6,-12" stroke="${col}" stroke-width="3" fill="none" stroke-linecap="round" class="wag"/>`;
    g += `<circle cx="17" cy="-22" r="8" fill="${col}" ${ink}/><ellipse cx="24" cy="-20" rx="5" ry="3.5" fill="${col}"/><circle cx="28" cy="-21" r="1.8" fill="#1a1010"/>`;
    g += `<path d="M13,-28q-4,4 -2,10" stroke="#5a3a20" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="19" cy="-24" r="1.4" fill="#1a1010"/>`;
    return `<g transform="translate(${x},${y}) scale(${flip ? -s : s},${s})">${g}</g>`;
  }
  function mushroom(x, y, s = 1, cap = '#c98a5a', glow = false) {
    let o = '';
    if (glow) o += `<circle cx="${x}" cy="${y - 14 * s}" r="${22 * s}" fill="${rg([[0, '#d6ff9a', .55], [1, '#d6ff9a', 0]])}"/>`;
    o += `<path d="M${x - 3 * s},${y}Q${x - 2 * s},${y - 10 * s} ${x - 3 * s},${y - 14 * s}H${x + 3 * s}Q${x + 2 * s},${y - 10 * s} ${x + 3 * s},${y}Z" fill="#efe6cf" ${ink}/>`;
    o += `<path d="M${x - 11 * s},${y - 13 * s}Q${x},${y - 30 * s} ${x + 11 * s},${y - 13 * s}Z" fill="${cap}" ${ink}/>`;
    o += `<circle cx="${x - 4 * s}" cy="${y - 19 * s}" r="${1.6 * s}" fill="#fff" opacity=".8"/><circle cx="${x + 4 * s}" cy="${y - 17 * s}" r="${1.2 * s}" fill="#fff" opacity=".8"/>`;
    return o;
  }
  function rat(x, y, s = 1, shirt = '#c0392b') {
    // A rat riding a wee bicycle.
    let g = '';
    for (const wx of [-16, 16]) g += `<circle cx="${wx}" cy="-9" r="9" fill="none" stroke="#3a3030" stroke-width="2"/><g class="spin" style="transform-origin:${wx}px -9px"><path d="M${wx - 8},-9h16M${wx},-17v16" stroke="#7a7070" stroke-width=".8"/></g>`;
    g += `<path d="M-16,-9L-4,-9L6,-22L16,-9M-4,-9L-6,-22M6,-22L-2,-22M6,-22l2,-6h5" stroke="${shirt}" stroke-width="2" fill="none" stroke-linejoin="round"/>`;
    g += `<path d="M-14,-20q-14,4 -20,-6" stroke="#c9a09a" stroke-width="1.6" fill="none"/>`;
    g += `<ellipse cx="-3" cy="-29" rx="10" ry="8" fill="#8a8590" ${ink}/><path d="M-8,-27l-4,10M2,-27l2,10" stroke="#8a8590" stroke-width="2.4" stroke-linecap="round"/>`;
    g += `<path d="M3,-35L16,-31L3,-27Z" fill="#9a95a0" ${ink}/><circle cx="16" cy="-31" r="1.6" fill="#e0909a"/><circle cx="8" cy="-33" r="1.3" fill="#111"/>`;
    g += `<circle cx="1" cy="-38" r="4" fill="#9a95a0" ${ink}/><circle cx="1" cy="-38" r="2" fill="#e0a0aa"/>`;
    g += `<path d="M-10,-31h12" stroke="${shirt}" stroke-width="6" opacity=".9"/>`;
    return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`;
  }
  function crisps(x, y, s = 1, col = '#6a3a9a') {
    // An invented packet of monster crisps (no real brand).
    return `<g transform="translate(${x},${y}) scale(${s}) rotate(-8)"><path d="M-9,-14l18,0l2,3l-1,22l1,3l-22,0l1,-3l-1,-22Z" fill="${col}" ${ink}/><circle cx="0" cy="-2" r="5" fill="#9ad04a"/><circle cx="-2" cy="-3" r="1.2" fill="#fff"/><circle cx="2" cy="-3" r="1.2" fill="#fff"/><path d="M-3,1q3,2 6,0" stroke="#2a3a10" stroke-width="1" fill="none"/><path d="M-4,-11l8,0" stroke="#ffd34a" stroke-width="2"/></g>`;
  }

  // ---- layer wrappers --------------------------------------------------
  const VB = 'viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice"';
  function wrap(body, plain) {
    const defs = DEFS.splice(0).join('');
    return `<svg ${VB} xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${body}</svg>`;
  }
  // Painted (watercolour) group + live group on top (animated bits skip the filter so they stay cheap).
  const W = (paint, live = '') => `<g filter="url(#wc)">${paint}</g>${live}`;
  const B = (paint, live) => ({ kind: 'bg', svg: wrap(W(paint, live)) });
  const P = (base, paint, live) => ({ kind: 'pop', base, svg: wrap(W(paint, live)) });
  const F = (live) => ({ kind: 'fx', svg: wrap(live) });

  return { nid, seed, rnd, rr, f, lg, rg, smooth, blob, ink, sky, stars, moon, ridge, hill, pine, tree, bareTree, cottage, house, grass, fog, rain, eyes, bubble, person, weeMan, sheep, donkey, bear, dog, mushroom, rat, crisps, W, B, P, F, wrap };
})();
