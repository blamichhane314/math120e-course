/* §1.2 — the scene behind the activity, and the plant that stands in it.
   The scene is a wide backdrop for the whole frame; the plant is drawn
   separately so it can stand at the side, rooted on the same ground. */

const box = (x, y, w, h, f, cls) =>
  '<rect x=' + x + ' y=' + y + ' width=' + w + ' height=' + h +
  ' fill="' + f + '"' + (cls ? ' class="' + cls + '"' : '') + '/>';

/* ── the scene ────────────────────────────────────────────────────
   Composition rule: the text column runs down the LEFT, so the left of
   the scene stays open sky and low ground. Every bright or busy thing —
   snow caps, the tall peak, the dense treeline — lives on the RIGHT,
   behind the plant column, where no type ever sits. */

function peak(cx, top, halfBase, floor, rock, shade, snow, snowShade, capFrac) {
  const steps = Math.max(6, Math.round((floor - top) / 5));
  const capTo = Math.round(steps * (capFrac === undefined ? 0.26 : capFrac));
  let g = '';
  for (let i = 0; i < steps; i++) {
    const y = top + i * 5;
    const w = Math.round(halfBase * 2 * Math.pow((i + 1) / steps, 0.92));
    const x = cx - Math.round(w / 2);
    const lit = Math.round(w * 0.42);
    const cap = i < capTo;
    g += box(x, y, lit, 6, cap ? snow : rock);
    g += box(x + lit, y, w - lit, 6, cap ? snowShade : shade);
  }
  return g;
}

function ridge(pts, floor, fill, lip) {
  let g = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const [x, y] = pts[i], w = pts[i + 1][0] - x;
    if (w <= 0) continue;
    g += box(x, y, w, floor - y, fill) + box(x, y, w, 3, lip);
  }
  return g;
}

function pine(x, groundY, h, trunk, leaf, leafShade) {
  const tier = Math.round(h / 3.4);
  let g = box(x - 3, groundY - Math.round(h * 0.2), 6, Math.round(h * 0.2), trunk);
  for (let i = 0; i < 3; i++) {
    const w = Math.round(h * 0.6) - i * Math.round(h * 0.15);
    const y = groundY - Math.round(h * 0.2) - (i + 1) * tier;
    const lit = Math.round(w * 0.44);
    g += box(x - Math.round(w / 2), y, lit, tier + 4, leaf);
    g += box(x - Math.round(w / 2) + lit, y, w - lit, tier + 4, leafShade);
  }
  return g;
}

function cloud(x, y, s) {
  const b = Math.round(8 * s);
  return box(x, y, Math.round(46 * s), b, 'var(--pl-cloud)')
       + box(x + Math.round(12 * s), y - b, Math.round(26 * s), b, 'var(--pl-cloud-lit)')
       + box(x + Math.round(6 * s), y + b, Math.round(34 * s), Math.round(5 * s), 'var(--pl-cloud-sh)');
}

/* two wing frames, swapped by a stepped animation, so the birds actually flap */
function bird(x, y, s) {
  const u = 3 * (s || 1);
  const up = box(x, y + u, u, u, 'var(--pl-bird)') + box(x + u, y, u, u, 'var(--pl-bird)')
           + box(x + 2 * u, y - u, u, u, 'var(--pl-bird)') + box(x + 3 * u, y, u, u, 'var(--pl-bird)')
           + box(x + 4 * u, y + u, u, u, 'var(--pl-bird)');
  const dn = box(x, y - u, u, u, 'var(--pl-bird)') + box(x + u, y, u, u, 'var(--pl-bird)')
           + box(x + 2 * u, y + u, u, u, 'var(--pl-bird)') + box(x + 3 * u, y, u, u, 'var(--pl-bird)')
           + box(x + 4 * u, y - u, u, u, 'var(--pl-bird)');
  return '<g class=wingup>' + up + '</g><g class=wingdn>' + dn + '</g>';
}

function bee(x, y) {
  const B = 'var(--pl-bug)', W = 'var(--pl-bug-wing)', S = 'var(--pl-bug-band)';
  return '<g class=beebody>' + box(x, y, 4, 4, B) + box(x + 4, y, 3, 4, S)
       + box(x + 7, y, 4, 4, B) + box(x + 11, y + 1, 2, 2, S) + '</g>'
       + '<g class=wingup>' + box(x + 3, y - 4, 6, 3, W) + '</g>'
       + '<g class=wingdn>' + box(x + 3, y - 2, 6, 3, W) + '</g>';
}
function firefly(x, y) {
  return '<g class=glow>' + box(x - 3, y - 3, 10, 10, 'var(--pl-glow)') + '</g>'
       + box(x, y, 4, 4, 'var(--pl-bug)');
}
function creature(kind, x, y, s) {
  return kind === 'bee' ? bee(x, y)
       : kind === 'firefly' ? firefly(x, y)
       : bird(x, y, s);
}

export function drawSky(svg, scene, stage) {
  const st = stage || 0;
  const kind = scene === 'meadow' ? 'bee' : scene === 'night' ? 'firefly' : 'bird';
  /* the light source sits far right, clear of the type. A disc at night,
     rays by day. */
  /* at dusk the sun sinks a little further with each section, and its rays
     shorten as it goes down */
  const sunY = scene === 'dusk' ? 24 + st * 13 : 24;
  let g = box(872, sunY, 34, 34, 'var(--pl-sun)');
  if (scene !== 'night') {
    const ray = scene === 'dusk' ? Math.max(0, 8 - st * 2) : 8;
    if (ray) g += box(864 - ray, sunY + 10, 50 + ray * 2, 14, 'var(--pl-sun)')
               + box(882, sunY - ray - 2, 14, 54 + ray * 2, 'var(--pl-sun)');
    if (scene === 'dusk' && st >= 4) {
      for (let i = 0; i < 5 + st * 3; i++) {
        const sx = (i * 173) % 980, sy = 10 + (i * 47) % 90;
        g += box(sx, sy, 3, 3, 'var(--pl-star)');
      }
    }
  } else {
    g += box(884, 20, 16, 16, 'var(--pl-sky)');        /* bitten out: a crescent */
    for (let i = 0; i < 14; i++) {                      /* stars */
      const sx = (i * 137) % 980, sy = 14 + (i * 53) % 120;
      g += box(sx, sy, 3, 3, 'var(--pl-star)');
    }
  }
  g += box(878, sunY + 6, 22, 22, 'var(--pl-sun-lit)');
  g += '<g class="cloud c">' + cloud(690, 40, .9) + '</g>'
     + '<g class="cloud b">' + cloud(430, 96, .7) + '</g>';
  /* the flock crosses the open left sky, which is the emptiest part */
  g += '<g class="bird ' + kind + '">' + creature(kind, 90, 60, 1.2) + '</g>'
     + '<g class="bird b ' + kind + '">' + creature(kind, 30, 104, 1) + '</g>'
     + '<g class="bird c ' + kind + '">' + creature(kind, 160, 132, .8) + '</g>';
  svg.innerHTML = g;
}

/* The land changes with the section, not only the sky: the journey runs from
   open country out to a forest edge with a lit cabin. Every peak and every
   dense stand of trees stays right of viewBox x=700, which is where the text
   column ends. */
const LAND = [
  { ridge:[[0,102],[160,96],[330,106],[520,94],[700,104],[860,96],[1000,106]],
    far:[[0,96],[120,90],[300,98],[520,88],[760,96],[1000,90]],
    peaks:[[880,66,86]], trees:[[956,96],[36,62]], feature:null },
  { ridge:[[0,100],[150,92],[320,104],[500,90],[680,102],[860,92],[1000,104]],
    far:[[0,92],[110,84],[290,94],[500,82],[740,92],[1000,86]],
    peaks:[[852,52,96],[972,70,60]], trees:[[930,104],[886,72],[30,58]], feature:null },
  { ridge:[[0,98],[140,88],[310,102],[490,86],[670,100],[850,88],[1000,102]],
    far:[[0,88],[100,78],[280,90],[480,76],[720,88],[1000,80]],
    peaks:[[790,40,92],[912,58,78],[996,74,54]], trees:[[860,86],[28,66]],
    feature:'rocks' },
  { ridge:[[0,100],[150,90],[330,104],[510,88],[690,102],[870,90],[1000,104]],
    far:[[0,90],[110,80],[290,92],[500,78],[740,90],[1000,82]],
    peaks:[[812,44,94],[944,64,66]], trees:[[892,90],[34,60]], feature:'pond' },
  { ridge:[[0,98],[140,90],[320,102],[500,88],[680,100],[860,90],[1000,102]],
    far:[[0,88],[100,80],[280,92],[480,78],[720,90],[1000,82]],
    peaks:[[820,42,96],[950,62,68]], trees:[[976,110],[930,86],[884,70],[840,58],[30,64]],
    feature:'mist' },
  { ridge:[[0,96],[130,86],[300,100],[480,84],[660,98],[840,86],[1000,100]],
    far:[[0,86],[90,76],[270,88],[460,74],[700,86],[1000,78]],
    peaks:[[800,36,100],[930,56,74],[1000,70,52]],
    trees:[[986,118],[944,94],[900,76],[858,62],[820,52],[26,68]], feature:'cabin' },
];

export function drawLand(svg, stage) {
  const L = LAND[Math.min(stage || 0, LAND.length - 1)], G = 120;
  let g = ridge(L.far, G + 6, 'var(--pl-far)', 'var(--pl-far-lit)');
  for (const [cx, top, half] of L.peaks)
    g += peak(cx, top, half, G, 'var(--pl-rock)', 'var(--pl-rock2)',
                                'var(--pl-snow)', 'var(--pl-snow2)');
  g += ridge(L.ridge, G + 6, 'var(--pl-hill)', 'var(--pl-hill-lit)');
  if (L.feature === 'mist')
    g += box(0, G - 14, 1000, 10, 'var(--pl-mist)');
  g += box(0, G, 1000, 200 - G, 'var(--pl-meadow)')
     + box(0, G, 1000, 4, 'var(--pl-meadow-lit)');
  g += scatter(G + 30, 30, 3, 'var(--pl-grass)', 33);
  if (L.feature === 'pond') {
    g += box(486, G + 12, 214, 22, 'var(--pl-water)')
       + box(486, G + 12, 214, 4, 'var(--pl-water-lit)')
       + box(512, G + 20, 40, 3, 'var(--pl-water-lit)')
       + box(600, G + 26, 56, 3, 'var(--pl-water-lit)');
  }
  if (L.feature === 'rocks')
    for (let i = 0; i < 5; i++)
      g += box(560 + i * 46, G + 20 - (i % 2) * 5, 16, 11, 'var(--pl-rock2)');
  g += box(0, G + 48, 1000, 200 - G - 48, 'var(--pl-soil)')
     + box(0, G + 48, 1000, 3, 'var(--pl-soil-lit)');
  g += scatter(G + 62, 11, 4, 'var(--pl-stone)', 89);
  for (const [x, h] of L.trees)
    g += pine(x, G + 46, h, 'var(--pl-trunk)', 'var(--pl-pine)', 'var(--pl-pine2)');
  if (L.feature === 'cabin') {
    const cx = 742, cy = G + 12;
    g += box(cx, cy + 12, 52, 30, 'var(--pl-cabin)')
       + box(cx - 5, cy + 4, 62, 9, 'var(--pl-cabin-roof)')
       + box(cx + 8, cy + 20, 14, 13, 'var(--pl-window)')
       + box(cx + 32, cy + 22, 12, 20, 'var(--pl-cabin-roof)');
  }
  svg.innerHTML = g;
}

function scatter(y, n, w, fill, seedStep) {
  let g = '';
  for (let i = 0; i < n; i++) {
    const x = (i * seedStep) % 1000;
    const hh = 3 + ((i * 7) % 3);
    g += box(x, y - hh, w, hh, fill);
  }
  return g;
}

/* ── a shelf of books, drawn for the numeric rungs of the ladder ──── */

export function shelfFig(svg, rows, cols, unknown) {
  const BW = 11, BH = 24, GAP = 4, SHELF = 5, VGAP = 9, PAD = 6;
  const LAB = unknown ? 16 : 0;          /* room for the x labels */
  const w = PAD * 2 + cols * (BW + GAP) - GAP + 8 + LAB;
  const h = PAD * 2 + rows * (BH + SHELF + VGAP) - VGAP + LAB;
  let g = '';
  for (let r = 0; r < rows; r++) {
    const top = PAD + LAB + r * (BH + SHELF + VGAP);
    /* when the count is unknown the last row and column fade out, the way a
       textbook writes "and so on" rather than pretending to know how many */
    const rowFade = unknown && r === rows - 1;
    for (let c = 0; c < cols; c++) {
      const x = PAD + LAB + c * (BW + GAP);
      const fade = rowFade || (unknown && c === cols - 1);
      const o = fade ? ' opacity=".3"' : '';
      const lean = (r + c) % 4 === 3 ? 1 : 0;
      g += '<g' + o + '>'
         + box(x, top + lean, BW, BH - lean, c % 2 ? 'var(--pl-book2)' : 'var(--pl-book)')
         + box(x + 3, top + 5 + lean, BW - 6, 3, 'var(--pl-page)') + '</g>';
    }
    g += '<rect x=' + (PAD + LAB - 4) + ' y=' + (top + BH) +
         ' width=' + (cols * (BW + GAP) - GAP + 8) + ' height=' + SHELF +
         ' fill="var(--pl-shelf)"' + (rowFade ? ' opacity=".3"' : '') + '/>';
  }
  if (unknown) {
    const acrossMid = PAD + LAB + (cols * (BW + GAP) - GAP) / 2;
    const downMid   = PAD + LAB + (rows * (BH + SHELF + VGAP) - VGAP) / 2;
    g += '<text class=figlab x=' + acrossMid + ' y="11" text-anchor=middle>x</text>';
    g += '<text class=figlab x="7" y=' + downMid + ' text-anchor=middle>x</text>';
  }
  const SCALE = 2.8;
  svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
  svg.setAttribute('width', Math.round(w * SCALE));
  svg.setAttribute('height', Math.round(h * SCALE));
  svg.innerHTML = g;
}

/* ── the plant: its own transparent canvas, rooted at the bottom ─── */

const PW = 150, PH = 330, PBASE = 316, PSTEM = 74, SEG = 16;

function bloom(cx, cy) {
  return box(cx - 7, cy - 3, 5, 6, 'var(--pl-bloom)') + box(cx + 3, cy - 3, 5, 6, 'var(--pl-bloom)')
       + box(cx - 3, cy - 7, 6, 5, 'var(--pl-bloom-lit)') + box(cx - 3, cy + 3, 6, 5, 'var(--pl-bloom)')
       + box(cx - 3, cy - 3, 6, 6, 'var(--pl-eye)') + box(cx - 3, cy - 3, 3, 3, 'var(--pl-eye-lit)');
}
function wilt(cx, cy, dir) {
  return box(cx - 3, cy - 4, 6, 5, 'var(--pl-wrong)')
       + box(cx - 3 + dir * 3, cy + 1, 5, 5, 'var(--pl-wrong)')
       + box(cx - 3 + dir * 6, cy + 6, 4, 4, 'var(--pl-wrong-sh)');
}

export function drawPlant(svg, state) {
  const { answered, marks } = state;
  const top = PBASE - answered * SEG;
  /* a mound of turned earth, then the stem with a lit edge down one side */
  let g = box(PSTEM - 13, PBASE - 5, 26, 7, 'var(--pl-mound)')
        + box(PSTEM - 13, PBASE - 5, 26, 2, 'var(--pl-mound-lit)');
  if (answered) {
    g += box(PSTEM - 4, top, 7, PBASE - top, 'var(--pl-stem)');
    g += box(PSTEM - 4, top, 3, PBASE - top, 'var(--pl-stem-lit)');
  }

  for (let i = 0; i < answered; i++) {
    const y = PBASE - (i + 1) * SEG, dir = i % 2 ? -1 : 1;
    const tip = PSTEM + dir * 30;
    const mark = marks[i];
    g += '<g class="leaf' + (mark ? ' m-' + mark : '') + '" data-i=' + i
       + ' tabindex=0 role=button aria-label="question ' + (i + 1) + '">'
       /* generous invisible hit area — the drawn leaf is far too small to click */
       + box(PSTEM + (dir > 0 ? -6 : -40), y - 15, 46, 30, 'transparent')
       + box(PSTEM + (dir > 0 ? 2 : -26), y - 1, 24, 6, 'var(--pl-leaf)')
       + box(PSTEM + (dir > 0 ? 2 : -26), y - 1, 24, 2, 'var(--pl-leaf-lit)')
       + box(PSTEM + (dir > 0 ? 13 : -15), y - 6, 13, 5, 'var(--pl-leaf)')
       + (mark === 'held' ? bloom(tip, y) : mark === 'missed' ? wilt(tip, y, dir) : '')
       + '</g>';
  }
  if (answered) g += box(PSTEM - 3, top - 5, 5, 5, 'var(--pl-stem)');
  svg.setAttribute('viewBox', '0 0 ' + PW + ' ' + PH);
  svg.innerHTML = g;
}
