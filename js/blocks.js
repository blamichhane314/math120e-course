// blocks.js — content renderers. Data in, DOM out, no state.
//
// Every figure is generated from its numbers rather than transcribed. MyLab
// re-randomises on export, so a figure derived from its data survives a
// re-download while a picture does not.

const NS = 'http://www.w3.org/2000/svg';
const el = (t, a = {}, kids = []) => {
  const n = document.createElementNS(NS, t);
  for (const k in a) n.setAttribute(k, a[k]);
  for (const c of [].concat(kids)) n.appendChild(c);
  return n;
};
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

export const tex = (s, display = false) => {
  try {
    return window.katex.renderToString(s, { throwOnError: false, displayMode: display, output: 'html' });
  } catch { return '<code>' + esc(s) + '</code>'; }   // leave the source visible on failure
};

/** For any string that may mix prose and math: escape it, then render
 *  anything between dollars. Every place text can appear uses this: a stem, a
 *  label, a note, a table cell, an option. */
export const inline = (s) => {
  // Order matters and is easy to get backwards: split out the math FIRST, then
  // escape only the prose between the spans. Escaping first turns a `<` inside
  // an expression into `&lt;` before KaTeX sees it, and KaTeX fails on the
  // entity — which surfaces as red error text rather than as a crash.
  const src = String(s ?? '');
  const re = /\$([^$]+)\$/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src)) !== null) {
    out += esc(src.slice(last, m.index));
    out += tex(m[1]);              // raw, never escaped
    last = m.index + m[0].length;
  }
  return out + esc(src.slice(last));
};

/** true when a string carries an inline math span */
export const hasMath = (s) => /\$[^$]+\$/.test(String(s ?? ''));

const wrap = (cls, inner) => { const d = document.createElement('div'); d.className = cls; d.appendChild(inner); return d; };
const svg = (w, h, cls = '') => el('svg', { viewBox: `0 0 ${w} ${h}`, class: 'fg ' + cls, role: 'img' });
const txt = (x, y, cls, s) => { const t = el('text', { x, y, class: cls }); t.textContent = s; return t; };

/* ── text and math ─────────────────────────────────────────────── */
export function Text(b) {
  const p = document.createElement('p');
  p.className = 'b-text';
  p.innerHTML = inline(b.v);
  return p;
}

export function MathBlock(b) {
  const d = document.createElement('div');
  d.className = 'b-math';
  d.innerHTML = tex(b.tex, b.display !== false);
  return d;
}

/* ── tables ────────────────────────────────────────────────────── */
// One component, several flavours: frequency, distribution, contingency,
// amortization, stemleaf, reference. Flavour changes emphasis, never structure.
export function Table(b) {
  const box = document.createElement('div');
  box.className = 'b-tablebox';
  if (b.caption) {
    const c = document.createElement('div');
    c.className = 'b-cap';
    c.textContent = b.caption;
    box.appendChild(c);
  }
  const t = document.createElement('table');
  t.className = 'b-table' + (b.flavour ? ' t-' + b.flavour : '');
  const numeric = b.numeric !== false;
  if (b.cols) {
    const tr = document.createElement('tr');
    b.cols.forEach((c, i) => {
      const th = document.createElement('th');
      th.innerHTML = inline(c);
      if (i && numeric) th.className = 'num';
      tr.appendChild(th);
    });
    t.appendChild(tr);
  }
  (b.rows || []).forEach((r) => {
    const tr = document.createElement('tr');
    r.forEach((c, i) => {
      const td = document.createElement('td');
      // an unknown cell renders as a dash
      td.innerHTML = (c === null || c === undefined || c === '')
        ? '<span class="none">&mdash;</span>'
        : inline(c);
      if (i && numeric) td.className = 'num';
      tr.appendChild(td);
    });
    t.appendChild(tr);
  });
  box.appendChild(t);
  return box;
}

/* ── number line ───────────────────────────────────────────────── */
// intervals: {from, to, openFrom, openTo}; null/±Infinity draws as an arrow
export function NumberLine(b) {
  const W = 560, H = 76, PAD = 30;
  const lo = b.min ?? -10, hi = b.max ?? 10;
  const X = (v) => PAD + ((Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo)) * (W - 2 * PAD);
  const y = 40;
  const g = svg(W, H, 'fg-line');

  g.appendChild(el('line', { x1: PAD - 14, y1: y, x2: W - PAD + 14, y2: y, class: 'axis' }));
  g.appendChild(el('path', { d: `M${PAD - 14},${y} l7,-4.5 l0,9 z`, class: 'axis-f' }));
  g.appendChild(el('path', { d: `M${W - PAD + 14},${y} l-7,-4.5 l0,9 z`, class: 'axis-f' }));

  const step = b.step ?? Math.max(1, Math.round((hi - lo) / 10));
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) {
    g.appendChild(el('line', { x1: X(v), y1: y - 4, x2: X(v), y2: y + 4, class: 'tick' }));
    g.appendChild(txt(X(v), y + 19, 'tlab', v));
  }

  (b.intervals || []).forEach((iv) => {
    const openL = iv.from === null || iv.from === -Infinity;
    const openR = iv.to === null || iv.to === Infinity;
    const a = openL ? lo : iv.from;
    const z = openR ? hi : iv.to;
    g.appendChild(el('line', { x1: X(a), y1: y, x2: X(z), y2: y, class: 'sel' }));
    if (!openL) g.appendChild(el('circle', { cx: X(a), cy: y, r: 5.5, class: 'ep' + (iv.openFrom ? ' hollow' : '') }));
    if (!openR) g.appendChild(el('circle', { cx: X(z), cy: y, r: 5.5, class: 'ep' + (iv.openTo ? ' hollow' : '') }));
  });

  (b.points || []).forEach((p) => {
    const v = typeof p === 'number' ? p : p.x;
    g.appendChild(el('circle', { cx: X(v), cy: y, r: 5.5, class: 'ep' + (p.open ? ' hollow' : '') }));
  });
  return wrap('b-fig', g);
}

/* ── Venn ──────────────────────────────────────────────────────── */
// shade takes region keys naming the sets whose INTERSECTION is shaded:
// "A", "AB", "ABC". Prefix "-" to subtract, e.g. "-C" removes C from it.
export function Venn(b) {
  const sets = b.sets || ['A', 'B'];
  const three = sets.length >= 3;
  const W = 320, H = three ? 262 : 208;
  const g = svg(W, H, 'fg-venn');
  const cx = W / 2, cy = three ? 112 : 100, r = 60;
  const C = three
    ? [[cx - 42, cy - 18], [cx + 42, cy - 18], [cx, cy + 48]]
    : [[cx - 36, cy], [cx + 36, cy]];

  g.appendChild(el('rect', { x: 10, y: 10, width: W - 20, height: H - 20, class: 'uni' }));
  g.appendChild(txt(22, 28, 'vlab start', b.universe || 'U'));

  const defs = el('defs');
  (b.shade || []).forEach((key, idx) => {
    const uid = 'vn' + idx + '-' + Math.random().toString(36).slice(2, 7);
    const inc = sets.filter((s) => key.includes(s) && !key.includes('-' + s));
    const exc = sets.filter((s) => key.includes('-' + s));
    // nested clip paths give an exact intersection rather than an approximation
    let host = defs, prev = null;
    inc.forEach((s, k) => {
      const k2 = sets.indexOf(s);
      const cp = el('clipPath', { id: uid + '-' + k });
      if (prev) cp.setAttribute('clip-path', `url(#${prev})`);
      cp.appendChild(el('circle', { cx: C[k2][0], cy: C[k2][1], r }));
      defs.appendChild(cp);
      prev = uid + '-' + k;
    });
    const shade = el('rect', {
      x: 10, y: 10, width: W - 20, height: H - 20, class: 'shade',
      ...(prev ? { 'clip-path': `url(#${prev})` } : {}),
    });
    g.appendChild(shade);
    // subtracted sets are painted back out in the paper colour
    exc.forEach((s) => {
      const k2 = sets.indexOf(s);
      g.appendChild(el('circle', { cx: C[k2][0], cy: C[k2][1], r, class: 'unshade' }));
    });
  });
  g.insertBefore(defs, g.firstChild);

  sets.forEach((s, k) => {
    g.appendChild(el('circle', { cx: C[k][0], cy: C[k][1], r, class: 'vc' }));
    g.appendChild(txt(C[k][0], C[k][1] - r - 8, 'vlab', s));
  });
  (b.counts || []).forEach((c) => g.appendChild(txt(c.x, c.y, 'vnum', c.v)));
  return wrap('b-fig', g);
}

/* ── histogram ─────────────────────────────────────────────────── */
export function Histogram(b) {
  const bins = b.bins || [];
  const W = 540, H = 216, L = 50, B = 44;
  const g = svg(W, H, 'fg-hist');
  const max = b.max ?? Math.max(...bins.map((d) => d.value), 1);
  const bw = (W - L - 20) / Math.max(bins.length, 1);

  for (let k = 0; k <= 4; k++) {
    const yy = 16 + (H - B - 16) * (k / 4);
    const v = max * (1 - k / 4);
    g.appendChild(el('line', { x1: L, y1: yy, x2: W - 12, y2: yy, class: 'grid' }));
    g.appendChild(txt(L - 8, yy + 3.5, 'tlab end', Number.isInteger(v) ? v : v.toFixed(2)));
  }
  bins.forEach((d, k) => {
    const h = (d.value / max) * (H - B - 16);
    g.appendChild(el('rect', {
      x: L + k * bw + bw * 0.15, y: H - B - h,
      width: bw * 0.7, height: Math.max(h, 0.6),
      class: 'bar' + (d.on ? ' on' : ''),
    }));
    g.appendChild(txt(L + k * bw + bw / 2, H - B + 16, 'tlab', d.label));
  });
  g.appendChild(el('line', { x1: L, y1: H - B, x2: W - 12, y2: H - B, class: 'axis' }));
  if (b.xlabel) g.appendChild(txt((W + L) / 2, H - 8, 'alab', b.xlabel));
  if (b.ylabel) g.appendChild(txt(14, 14, 'alab start', b.ylabel));
  return wrap('b-fig', g);
}

/* ── coordinate plane ──────────────────────────────────────────── */
// curves are a function of x, or an explicit point list
export function Plane(b) {
  const W = 360, H = 344, P = 28;
  const [x0, x1] = b.xr || [-10, 10];
  const [y0, y1] = b.yr || [-10, 10];
  const X = (v) => P + ((v - x0) / (x1 - x0)) * (W - 2 * P);
  const Y = (v) => H - P - ((v - y0) / (y1 - y0)) * (H - 2 * P);
  const g = svg(W, H, 'fg-plane');
  const sx = b.stepx ?? Math.max(1, Math.round((x1 - x0) / 10));
  const sy = b.stepy ?? Math.max(1, Math.round((y1 - y0) / 10));

  for (let v = Math.ceil(x0 / sx) * sx; v <= x1; v += sx)
    g.appendChild(el('line', { x1: X(v), y1: Y(y0), x2: X(v), y2: Y(y1), class: 'grid' }));
  for (let v = Math.ceil(y0 / sy) * sy; v <= y1; v += sy)
    g.appendChild(el('line', { x1: X(x0), y1: Y(v), x2: X(x1), y2: Y(v), class: 'grid' }));
  if (y0 <= 0 && y1 >= 0) g.appendChild(el('line', { x1: X(x0), y1: Y(0), x2: X(x1), y2: Y(0), class: 'axis' }));
  if (x0 <= 0 && x1 >= 0) g.appendChild(el('line', { x1: X(0), y1: Y(y0), x2: X(0), y2: Y(y1), class: 'axis' }));

  const span = y1 - y0;
  (b.curves || []).forEach((c) => {
    let pts = c.points;
    if (!pts && c.fn) {
      pts = [];
      const N = 240;
      for (let k = 0; k <= N; k++) {
        const x = x0 + (x1 - x0) * (k / N);
        let y; try { y = c.fn(x); } catch { y = NaN; }
        pts.push(Number.isFinite(y) ? { x, y } : null);
      }
    }
    let d = '', pen = false;
    (pts || []).forEach((p) => {
      // break the path where the curve leaves the frame instead of drawing a
      // false vertical joining the two edges
      if (!p || p.y < y0 - span || p.y > y1 + span) { pen = false; return; }
      d += (pen ? 'L' : 'M') + X(p.x).toFixed(1) + ',' + Y(p.y).toFixed(1) + ' ';
      pen = true;
    });
    if (d) g.appendChild(el('path', { d, class: 'curve' + (c.dashed ? ' dashed' : '') }));
  });

  (b.points || []).forEach((p) => {
    g.appendChild(el('circle', { cx: X(p.x), cy: Y(p.y), r: 4.5, class: 'pt' + (p.open ? ' hollow' : '') }));
    if (p.label) g.appendChild(txt(X(p.x) + 9, Y(p.y) - 8, 'plab start', p.label));
  });
  return wrap('b-fig', g);
}

export const BLOCK = {
  text: Text, math: MathBlock, table: Table,
  numberline: NumberLine, venn: Venn, histogram: Histogram, plane: Plane,
};

/** render a list of content blocks into a container */
export function renderBlocks(list, into) {
  (list || []).forEach((b) => {
    const f = BLOCK[b.t];
    if (!f) {
      const d = document.createElement('div');
      d.className = 'b-unknown';
      d.textContent = 'no renderer for block type: ' + b.t;
      into.appendChild(d);
      return;
    }
    into.appendChild(f(b));
  });
  return into;
}
