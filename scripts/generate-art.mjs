// Generates original, licence-free key art for the F.A.M.E concept catalogue.
// Run: node scripts/generate-art.mjs   (writes public/assets/content/<id>.svg and <id>-wide.svg)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'content');
mkdirSync(out, { recursive: true });

const rng = seed => { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
const f = n => +n.toFixed(1);

/* ---------- primitives ---------- */
const grad = (id, stops, x2 = 0, y2 = 1) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
const radial = (id, c, a0 = 1, a1 = 0) =>
  `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${a0}"/><stop offset="1" stop-color="${c}" stop-opacity="${a1}"/></radialGradient>`;

const sky = (W, H, stops) => `<defs>${grad('sky', stops)}</defs><rect width="${W}" height="${H}" fill="url(#sky)"/>`;
const glow = (id, cx, cy, r, c, a = .9) => `<defs>${radial(id, c, a)}</defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/>`;
const sun = (id, cx, cy, r, c, glowC = c) => glow(id, cx, cy, r * 3.2, glowC, .55) + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/>`;
const stars = (W, maxY, n, seed = 3) => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) s += `<circle cx="${f(r() * W)}" cy="${f(r() * maxY)}" r="${f(r() * 1.4 + .3)}" fill="#fff" opacity="${f(r() * .7 + .15)}"/>`; return s; };

const hills = (W, base, amp, color, seed = 1, opacity = 1, H = 0) => {
  const r = rng(seed), p1 = r() * 6, p2 = r() * 6, f1 = 1.5 + r() * 1.5, f2 = 4 + r() * 3;
  let d = `M0 ${H || base + amp * 4}L0 ${f(base)}`;
  for (let x = 0; x <= W; x += W / 40) d += `L${f(x)} ${f(base + Math.sin(x / W * Math.PI * f1 + p1) * amp + Math.sin(x / W * Math.PI * f2 + p2) * amp * .35)}`;
  return `<path d="${d}L${W} ${H || base + amp * 4}Z" fill="${color}" opacity="${opacity}"/>`;
};

const skyline = (W, base, minH, maxH, color, seed = 5, lit = 0, litColor = '#ffd58a', gap = 0) => {
  const r = rng(seed); let x = -10, s = '';
  while (x < W) {
    const w = 26 + r() * 54, h = minH + r() * (maxH - minH);
    s += `<rect x="${f(x)}" y="${f(base - h)}" width="${f(w)}" height="${f(h + 4)}" fill="${color}"/>`;
    if (r() > .82) s += `<rect x="${f(x + w / 2 - 1.5)}" y="${f(base - h - 24)}" width="3" height="26" fill="${color}"/>`;
    if (lit) for (let wy = base - h + 10; wy < base - 8; wy += 13) for (let wx = x + 6; wx < x + w - 8; wx += 11) if (r() < lit) s += `<rect x="${f(wx)}" y="${f(wy)}" width="4" height="6" fill="${litColor}" opacity="${f(.45 + r() * .5)}"/>`;
    x += w + gap + r() * 4;
  }
  return s;
};

const tower = (x, base, h, w, color, litColor) => {
  let s = `<path d="M${x - w / 2} ${base}L${x - w / 2} ${base - h}L${x + w / 2} ${base - h}L${x + w / 2} ${base}Z" fill="${color}"/>`;
  s += `<rect x="${x - 2}" y="${base - h - 70}" width="4" height="72" fill="${color}"/><circle cx="${x}" cy="${base - h - 72}" r="3" fill="${litColor}"/>`;
  for (let y = base - h + 14; y < base - 12; y += 16) s += `<rect x="${x - w / 2 + 6}" y="${y}" width="${w - 12}" height="2.5" fill="${litColor}" opacity=".35"/>`;
  return s;
};

const acacia = (x, y, s, c) =>
  `<g fill="${c}" transform="translate(${x} ${y}) scale(${s})"><path d="M-6 0C-4 -40 -10 -70 -26 -96L-18 -98C-6 -82 2 -70 4 -52C8 -72 18 -90 36 -102L42 -96C26 -82 12 -58 10 0Z"/><ellipse cx="-14" cy="-108" rx="62" ry="13"/><ellipse cx="34" cy="-112" rx="54" ry="11"/><ellipse cx="6" cy="-122" rx="40" ry="9"/></g>`;

const baobab = (x, y, s, c) =>
  `<g fill="${c}" transform="translate(${x} ${y}) scale(${s})"><path d="M-34 0C-28 -50 -22 -80 -20 -120C-44 -150 -66 -168 -84 -186L-76 -192C-56 -178 -34 -166 -14 -150C-10 -178 -18 -200 -34 -224L-26 -228C-6 -204 2 -180 6 -150C20 -170 42 -190 70 -200L74 -192C50 -178 30 -160 18 -136C20 -90 26 -50 34 0Z"/></g>`;

const person = (x, y, s, c, kind = 'stand') => {
  const body = {
    stand: 'M-12 -74Q0 -80 12 -74L16 -30L10 -30L8 0L-8 0L-10 -30L-16 -30Z',
    dress: 'M-10 -74Q0 -80 10 -74L14 -46L26 0L-26 0L-14 -46Z',
    arms: 'M-30 -108L-22 -112L-10 -80Q0 -84 10 -80L22 -112L30 -108L16 -70L12 -30L10 0L-10 0L-12 -30L-16 -70Z',
    sit: 'M-12 -50Q0 -56 12 -50L14 -20L34 -20L34 -8L-6 -8L-12 -20Z'
  }[kind];
  const head = kind === 'sit' ? -62 : kind === 'arms' ? -118 : -86;
  return `<g fill="${c}" transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="${head}" r="10"/><path d="${body}"/></g>`;
};

const rain = (W, H, n, seed = 9, c = '#cfe3ff') => { const r = rng(seed); let s = `<g stroke="${c}" stroke-linecap="round">`; for (let i = 0; i < n; i++) { const x = r() * W, y = r() * H, l = 14 + r() * 26; s += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x - l * .25)}" y2="${f(y + l)}" stroke-width="${f(r() * 1.2 + .4)}" opacity="${f(r() * .35 + .08)}"/>`; } return s + '</g>'; };
const rings = (cx, cy, r0, n, step, c, w = 2, a = .5) => { let s = ''; for (let i = 0; i < n; i++) s += `<circle cx="${cx}" cy="${cy}" r="${r0 + i * step}" fill="none" stroke="${c}" stroke-width="${w}" opacity="${f(a * (1 - i / n))}"/>`; return s; };
const finish = (W, H, tint) => `<defs>${grad('fade', [[0, '#000', 0], [1, '#000', .55]])}${radial('vig', '#000', 0, .55)}<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 0"/></filter></defs><rect width="${W}" height="${H}" fill="url(#fade)"/><rect width="${W}" height="${H}" filter="url(#grain)" opacity=".07"/>${tint ? `<rect width="${W}" height="${H}" fill="${tint}" opacity=".08" style="mix-blend-mode:soft-light"/>` : ''}`;

/* ---------- scenes: (W,H,focal) => svg body ---------- */
const scenes = {
  'city-of-dreams': (W, H, fx) => {
    const base = H * .72;
    return sky(W, H, [[0, '#1b0a3c'], [.45, '#6a1b8f'], [.72, '#e5007e'], [1, '#ff9a5c']]) + stars(W, H * .35, 70, 11) +
      sun('s', fx * W, base - H * .12, H * .1, '#ffd2a1', '#ff4fb0') +
      skyline(W, base, H * .06, H * .22, '#2a0d4a', 21, .0) +
      skyline(W, base + 6, H * .08, H * .3, '#14052a', 7, .22, '#ffd58a') +
      tower(W * (fx > .6 ? .26 : .22), base + 6, H * .36, 54, '#0c031b', '#ff7ac6') +
      `<rect y="${base}" width="${W}" height="${H - base}" fill="#07020f"/>` +
      person(fx * W, base + 2, H / 1100 * 1.5, '#07020f', 'dress') +
      `<ellipse cx="${fx * W}" cy="${base + 4}" rx="${H * .09}" ry="5" fill="#ff4fb0" opacity=".35"/>`;
  },
  'roots-and-rhythm': (W, H, fx) => {
    const base = H * .74, cx = fx * W, cy = H * .42;
    return sky(W, H, [[0, '#2a0a16'], [.5, '#a3260f'], [1, '#ffb347']]) +
      sun('s', cx, cy, H * .13, '#ffe0a8', '#ff6a2b') + rings(cx, cy, H * .16, 9, H * .05, '#ffe0a8', 2.4, .6) +
      hills(W, base - H * .04, H * .035, '#5a1405', 4, .9) + hills(W, base + H * .02, H * .03, '#2b0a05', 8) +
      acacia(cx - W * .22, base + H * .02, H / 700, '#150502') + acacia(cx + W * .24, base + H * .035, H / 900, '#150502') +
      person(cx, base + H * .06, H / 800, '#0b0301', 'arms') +
      `<rect y="${base + H * .05}" width="${W}" height="${H}" fill="#0b0301"/>`;
  },
  'the-next-move': (W, H, fx) => {
    const base = H * .78; let steps = '';
    for (let i = 0; i < 7; i++) steps += `<rect x="${f(fx * W - 330 + i * 78)}" y="${f(base - 40 - i * H * .065)}" width="74" height="${f(40 + i * H * .065 + 400)}" fill="${i % 2 ? '#0d3a4f' : '#0a2b3b'}"/><rect x="${f(fx * W - 330 + i * 78)}" y="${f(base - 40 - i * H * .065)}" width="74" height="4" fill="#3de0ff" opacity=".8"/>`;
    return sky(W, H, [[0, '#04121c'], [.6, '#0a3550'], [1, '#e5007e']]) + stars(W, H * .4, 40, 5) +
      glow('g', fx * W + 220, H * .26, H * .5, '#3de0ff', .4) + skyline(W, base, H * .08, H * .28, '#06202e', 13, .1, '#7ff0ff') + steps +
      person(fx * W + 252, base - 40 - 6 * H * .065, H / 1200 * 1.4, '#02090e', 'stand') +
      `<path d="M${fx * W - 300} ${base - 70}L${fx * W + 260} ${base - 6 * H * .065 - 150}" stroke="#ff3fa8" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round" opacity=".8"/>` +
      `<rect y="${base + 8}" width="${W}" height="${H}" fill="#02090e"/>`;
  },
  'after-the-rain': (W, H, fx) => {
    const base = H * .76, hx = fx * W;
    return sky(W, H, [[0, '#0b1230'], [.55, '#33407a'], [1, '#b87ab0']]) + glow('m', hx - W * .18, H * .2, H * .4, '#dfe7ff', .3) +
      hills(W, base - H * .08, H * .03, '#1a2248', 2) + hills(W, base - H * .01, H * .025, '#0e1330', 6) +
      `<g fill="#070a1a"><path d="M${hx - 120} ${base}V${base - 100}L${hx} ${base - 190}L${hx + 120} ${base - 100}V${base}Z"/></g>` +
      `<rect x="${hx - 70}" y="${base - 84}" width="34" height="42" fill="#ffc87a"/><rect x="${hx + 28}" y="${base - 84}" width="34" height="42" fill="#ffc87a" opacity=".8"/>` +
      glow('w', hx, base - 60, 220, '#ffc87a', .35) + acacia(hx + 230, base + 8, H / 800, '#070a1a') +
      rain(W, H, 190, 4) + `<rect y="${base}" width="${W}" height="${H}" fill="#070a1a"/>` +
      `<ellipse cx="${hx}" cy="${base + 22}" rx="200" ry="8" fill="#ffc87a" opacity=".2"/>` + person(hx + 168, base + 10, H / 900, '#02030a', 'stand');
  },
  'future-africa': (W, H, fx) => {
    const base = H * .8, cx = fx * W, cy = H * .46, R = H * .27; let net = '';
    const r = rng(17), pts = [];
    for (let i = 0; i < 26; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * R * .92; pts.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d]); }
    pts.forEach((p, i) => { const q = pts[(i * 7 + 3) % pts.length], q2 = pts[(i * 5 + 1) % pts.length]; net += `<line x1="${f(p[0])}" y1="${f(p[1])}" x2="${f(q[0])}" y2="${f(q[1])}" stroke="#6ef3d2" stroke-opacity=".35"/><line x1="${f(p[0])}" y1="${f(p[1])}" x2="${f(q2[0])}" y2="${f(q2[1])}" stroke="#6ef3d2" stroke-opacity=".2"/><circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r() * 3 + 2)}" fill="#bffff0"/>`; });
    return sky(W, H, [[0, '#021a1c'], [.55, '#0b5d5a'], [1, '#ffb23f']]) + stars(W, H * .4, 80, 23) + glow('g', cx, cy, R * 1.9, '#3fffd6', .28) +
      `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#032a2b" stroke="#6ef3d2" stroke-opacity=".6" stroke-width="2"/>` +
      [.35, .7].map(k => `<ellipse cx="${cx}" cy="${cy}" rx="${R * k}" ry="${R}" fill="none" stroke="#6ef3d2" stroke-opacity=".25"/>`).join('') +
      [-.55, 0, .55].map(k => `<ellipse cx="${cx}" cy="${cy + R * k}" rx="${R * Math.sqrt(1 - k * k)}" ry="${R * .12}" fill="none" stroke="#6ef3d2" stroke-opacity=".22"/>`).join('') + net +
      rings(cx, cy, R + 30, 3, 40, '#6ef3d2', 1.5, .5) + hills(W, base, H * .03, '#021214', 12) + skyline(W, base + 10, H * .05, H * .2, '#01090a', 3, .06, '#6ef3d2') +
      `<rect y="${base + 8}" width="${W}" height="${H}" fill="#01090a"/>`;
  },
  'street-kings': (W, H, fx) => {
    const base = H * .8, cx = fx * W;
    return sky(W, H, [[0, '#14020a'], [.6, '#4a0820'], [1, '#e5007e']]) + glow('n1', cx - W * .16, H * .38, H * .35, '#ff2a6d', .45) + glow('n2', cx + W * .2, H * .46, H * .3, '#7d3fff', .4) +
      skyline(W, base, H * .12, H * .46, '#12020a', 31, .1, '#ff9ac6', 6) + skyline(W, base + 8, H * .06, H * .22, '#07010a', 8, 0, '#fff', 12) +
      `<rect x="${cx - W * .28}" y="${H * .3}" width="${W * .07 + 40}" height="14" rx="7" fill="#ff2a6d"/><rect x="${cx + W * .16}" y="${H * .36}" width="${W * .05 + 30}" height="12" rx="6" fill="#8d5cff"/>` +
      `<rect y="${base}" width="${W}" height="${H}" fill="#07010a"/><rect y="${base + 2}" width="${W}" height="3" fill="#ff2a6d" opacity=".5"/>` +
      person(cx - 120, base + 20, H / 780, '#020004', 'stand') + person(cx - 50, base + 26, H / 740, '#020004', 'arms') + person(cx + 30, base + 22, H / 770, '#020004', 'dress') + person(cx + 105, base + 18, H / 800, '#020004', 'stand') +
      `<ellipse cx="${cx}" cy="${base + 24}" rx="${H * .28}" ry="8" fill="#ff2a6d" opacity=".25"/>`;
  },
  'little-legends': (W, H, fx) => {
    const base = H * .78, cx = fx * W;
    return sky(W, H, [[0, '#2b7bff'], [.55, '#7bd0ff'], [1, '#ffe27a']]) + sun('s', cx - W * .1, H * .24, H * .09, '#fff3a6', '#ffd23f') +
      [[.1, .16, 90], [.78, .12, 70], [.55, .3, 60]].map(([a, b, r]) => `<g fill="#fff" opacity=".9"><circle cx="${a * W}" cy="${b * H}" r="${r * H / 900}"/><circle cx="${a * W + r * .9}" cy="${b * H + 10}" r="${r * .75 * H / 900}"/><circle cx="${a * W - r * .9}" cy="${b * H + 14}" r="${r * .65 * H / 900}"/></g>`).join('') +
      hills(W, base - H * .12, H * .05, '#40b86a', 3) + hills(W, base - H * .04, H * .04, '#1f8f4e', 9) + hills(W, base + H * .03, H * .03, '#0f6a37', 15) +
      baobab(cx + W * .26, base + H * .04, H / 650, '#0a4a27') +
      person(cx - 60, base + H * .1, H / 1000 * 1.1, '#e5007e', 'arms') + person(cx + 20, base + H * .12, H / 1100, '#6e42ff', 'stand') + person(cx + 80, base + H * .11, H / 1400, '#ff9a3f', 'arms') +
      `<g fill="#fff" opacity=".95">${[[.2, .3], [.4, .12], [.7, .26], [.9, .38]].map(([a, b]) => `<path transform="translate(${a * W} ${b * H})" d="M0-14L4-4L15-4L6 3L9 14L0 8L-9 14L-6 3L-15-4L-4-4Z"/>`).join('')}</g>`;
  },
  'voices-of-home': (W, H, fx) => {
    const base = H * .78, cx = fx * W;
    return sky(W, H, [[0, '#3a1030'], [.5, '#c8431f'], [1, '#ffd37a']]) + sun('s', cx, base - H * .13, H * .12, '#fff0b8', '#ff9a3f') +
      hills(W, base - H * .02, H * .02, '#7a2a12', 5, .85) + baobab(cx, base + 6, H / 520, '#1b0805') + acacia(cx - W * .3, base + 8, H / 800, '#1b0805') +
      `<rect y="${base}" width="${W}" height="${H}" fill="#1b0805"/>` +
      [-150, -105, 95, 140, 190].map((dx, i) => person(cx + dx, base + 18 + (i % 2) * 6, H / (900 + i * 60), '#0c0302', i % 2 ? 'dress' : 'stand')).join('');
  },
  'makers-of-tomorrow': (W, H, fx) => {
    const cx = fx * W, cy = H * .45; let circuit = '';
    const r = rng(41);
    for (let i = 0; i < 22; i++) { const x = r() * W, y = r() * H * .85, l = 60 + r() * 160, v = r() > .5; circuit += `<path d="M${f(x)} ${f(y)}${v ? 'V' : 'H'}${f((v ? y : x) + l)}${v ? 'H' : 'V'}${f((v ? x : y) + (r() - .5) * 120)}" fill="none" stroke="#ffc84a" stroke-width="2" opacity="${f(.12 + r() * .25)}"/><circle cx="${f(x)}" cy="${f(y)}" r="4" fill="#ffc84a" opacity=".5"/>`; }
    return sky(W, H, [[0, '#120a2e'], [.6, '#3a1a7a'], [1, '#e5007e']]) + circuit + glow('g', cx, cy, H * .55, '#ffc84a', .32) +
      `<g transform="translate(${cx} ${cy})" fill="none" stroke="#ffc84a" stroke-width="3"><circle r="${H * .17}" stroke-dasharray="10 14" opacity=".8"/><circle r="${H * .26}" opacity=".35"/><circle r="${H * .08}" fill="#ffc84a" opacity=".9"/></g>` +
      `<g transform="translate(${cx} ${cy})" stroke="#ffc84a" stroke-width="3" opacity=".6">${Array.from({ length: 12 }, (_, i) => `<line x1="${Math.cos(i * Math.PI / 6) * H * .2}" y1="${Math.sin(i * Math.PI / 6) * H * .2}" x2="${Math.cos(i * Math.PI / 6) * H * .27}" y2="${Math.sin(i * Math.PI / 6) * H * .27}"/>`).join('')}</g>` +
      skyline(W, H * .84, H * .04, H * .14, '#0a0520', 51, .1, '#ffc84a') + `<rect y="${H * .84}" width="${W}" height="${H}" fill="#0a0520"/>` +
      person(cx + H * .34, H * .85, H / 800, '#05020f', 'stand') + person(cx - H * .36, H * .85, H / 850, '#05020f', 'arms');
  },
  'the-last-dance': (W, H, fx) => {
    const base = H * .8, cx = fx * W; let lights = '';
    for (let i = 0; i < 24; i++) { const x = i / 23 * W, y = H * .12 + Math.sin(i / 23 * Math.PI * 3) * 18 + Math.abs(i / 23 - .5) * 40; lights += `<circle cx="${f(x)}" cy="${f(y)}" r="5" fill="#ffd58a"/>${glow('l' + i, f(x), f(y), 34, '#ffb347', .5)}`; }
    return sky(W, H, [[0, '#1a0a1f'], [.55, '#6b1a4a'], [1, '#ff8a5c']]) + glow('s', cx, H * .55, H * .45, '#ffb27a', .38) + lights +
      `<path d="M0 ${H * .12}Q${W / 2} ${H * .2} ${W} ${H * .12}" stroke="#2a1020" stroke-width="2" fill="none"/>` +
      `<rect y="${base}" width="${W}" height="${H}" fill="#0f0510"/><ellipse cx="${cx}" cy="${base + 18}" rx="${H * .3}" ry="14" fill="#ffb27a" opacity=".22"/>` +
      `<g fill="#070208" transform="translate(${cx} ${base + 14}) scale(${H / 640})"><circle cx="-18" cy="-150" r="11"/><circle cx="20" cy="-146" r="11"/><path d="M-30 -136Q-18 -142 -8 -134L10 -134Q20 -140 34 -132L40 -92L22 -52L40 0L12 0L2 -46L-8 0L-38 0L-18 -52L-34 -92Z"/><path d="M-8 -130L22 -122L6 -100Z" opacity=".0"/></g>` +
      acacia(cx - W * .3, base + 8, H / 850, '#070208') + acacia(cx + W * .3, base + 8, H / 800, '#070208');
  },
  'village-to-vision': (W, H, fx) => {
    const base = H * .76, cx = fx * W;
    const hut = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#100a05"><rect x="-34" y="-34" width="68" height="34"/><path d="M-46 -34L0 -78L46 -34Z"/></g>`;
    return sky(W, H, [[0, '#0f1030'], [.45, '#4a2a8a'], [.75, '#ff6a8a'], [1, '#ffd37a']]) + sun('s', cx + W * .12, base - H * .08, H * .09, '#fff0c0', '#ffa34a') + stars(W, H * .3, 30, 7) +
      hills(W, base - H * .07, H * .035, '#3a1a5a', 14, .9) + skyline(W, base - H * .04, H * .04, H * .17, '#24103a', 19, .08, '#ffd58a', 4) +
      hills(W, base, H * .02, '#140a1a', 22) + `<rect y="${base + 4}" width="${W}" height="${H}" fill="#100a05"/>` +
      hut(cx - W * .18, base + H * .045, H / 700) + hut(cx - W * .08, base + H * .08, H / 600) + hut(cx + W * .02, base + H * .05, H / 760) +
      `<path d="M${cx + W * .12} ${H}L${cx + W * .11} ${base + 6}" stroke="#ffa34a" stroke-opacity=".25" stroke-width="30"/>` + acacia(cx + W * .27, base + H * .06, H / 760, '#100a05') + person(cx + W * .1, base + H * .1, H / 760, '#05030a', 'stand');
  },
  'midnight-radio': (W, H, fx) => {
    const base = H * .82, cx = fx * W;
    return sky(W, H, [[0, '#02030f'], [.6, '#0b1550'], [1, '#6a1b9a']]) + stars(W, H * .55, 110, 29) + glow('m', cx - W * .14, H * .2, H * .3, '#9ab8ff', .3) + `<circle cx="${cx - W * .14}" cy="${H * .2}" r="${H * .05}" fill="#e8efff"/>` +
      hills(W, base - H * .05, H * .03, '#070b2a', 33) + rings(cx, base - H * .42, 24, 8, 34, '#ff3fa8', 2.2, .75) +
      `<g stroke="#02030a" stroke-width="5" fill="none"><path d="M${cx - 70} ${base + 4}L${cx} ${base - H * .42}L${cx + 70} ${base + 4}"/><path d="M${cx - 44} ${base - 70}H${cx + 44}M${cx - 30} ${base - 140}H${cx + 30}M${cx - 18} ${base - 220}H${cx + 18}"/></g><circle cx="${cx}" cy="${base - H * .42}" r="7" fill="#ff3fa8"/>` +
      glow('b', cx, base - H * .42, 70, '#ff3fa8', .8) + `<rect y="${base}" width="${W}" height="${H}" fill="#02030a"/>` +
      `<rect x="${cx - W * .26}" y="${base - 56}" width="76" height="56" fill="#02030a"/><rect x="${cx - W * .26 + 12}" y="${base - 40}" width="22" height="18" fill="#ffd58a" opacity=".85"/>`;
  }
};

for (const [id, scene] of Object.entries(scenes)) {
  const poster = (W, H) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${scene(W, H, .5)}${finish(W, H)}</svg>`;
  const wide = (W, H) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${scene(W, H, .68)}${finish(W, H)}</svg>`;
  writeFileSync(join(out, `${id}.svg`), poster(600, 900));
  writeFileSync(join(out, `${id}-wide.svg`), wide(1600, 900));
}
console.log('Generated', Object.keys(scenes).length * 2, 'artworks in', out);
