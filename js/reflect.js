// reflect.js — the block types a reflection is built from.
//
// The engine decides which block comes next; a block only knows how to draw
// itself and report what happened. Every probe carries a self-claim taken
// BEFORE the options become answerable: asked afterwards, a rating only
// reports how the attempt felt, and the calibration signal is gone.

import { inline, tex } from './blocks.js?v=5';

const el = (t, cls, html) => {
  const n = document.createElement(t);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const SVGNS = 'http://www.w3.org/2000/svg';
const mk = (t, attrs = {}) => {
  const n = document.createElementNS(SVGNS, t);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
};

/* ── the self-claim ───────────────────────────────────────────────
   Four falsifiable statements rather than a 1-5 scale, which is not
   interpretable and which students use differently from one another. */
export const CLAIMS = [
  'I could do this now',
  'I could do this with my notes',
  'I know what it is asking, not how',
  'I do not recognise this',
];

function Rate(onPick) {
  const box = el('div', 'rf-rate');
  box.appendChild(el('div', 'rf-rate-q', 'Before you answer, choose the statement that is true now.'));
  const row = el('div', 'rf-rate-row');
  CLAIMS.forEach((c, i) => {
    const b = el('button', 'rf-claim', c);
    b.onclick = () => {
      row.querySelectorAll('.rf-claim').forEach((x) => x.classList.remove('on'));
      b.classList.add('on');
      box.classList.add('done');
      onPick(i);
    };
    row.appendChild(b);
  });
  box.appendChild(row);
  return box;
}

/* ── parabola ─────────────────────────────────────────────────────
   Drawn from the coefficients, never transcribed. */
function plot(o) {
  const W = 460, H = 320, pad = 26;
  const { xmin, xmax, ymin, ymax } = o;
  const X = (x) => pad + ((x - xmin) / (xmax - xmin)) * (W - 2 * pad);
  const Y = (y) => H - pad - ((y - ymin) / (ymax - ymin)) * (H - 2 * pad);
  const svg = mk('svg', { viewBox: `0 0 ${W} ${H}`, class: 'rf-plot', role: 'img' });

  for (let gx = Math.ceil(xmin); gx <= xmax; gx++)
    svg.appendChild(mk('line', { x1: X(gx), y1: pad, x2: X(gx), y2: H - pad, class: 'rf-grid' }));
  for (let gy = Math.ceil(ymin); gy <= ymax; gy++)
    svg.appendChild(mk('line', { x1: pad, y1: Y(gy), x2: W - pad, y2: Y(gy), class: 'rf-grid' }));
  svg.appendChild(mk('line', { x1: pad, y1: Y(0), x2: W - pad, y2: Y(0), class: 'rf-axis' }));
  svg.appendChild(mk('line', { x1: X(0), y1: pad, x2: X(0), y2: H - pad, class: 'rf-axis' }));

  const curve = mk('path', { class: 'rf-curve' });
  const roots = mk('g');
  svg.appendChild(curve);
  svg.appendChild(roots);

  function draw(a, b, c) {
    let d = '', on = false;
    for (let i = 0; i <= 260; i++) {
      const x = xmin + (i / 260) * (xmax - xmin);
      const y = a * x * x + b * x + c;
      if (y < ymin || y > ymax) { on = false; continue; }
      d += (on ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(y).toFixed(1) + ' ';
      on = true;
    }
    curve.setAttribute('d', d);
    roots.textContent = '';
    const disc = b * b - 4 * a * c;
    if (disc >= 0 && a !== 0) {
      const rs = disc === 0 ? [-b / (2 * a)]
        : [(-b - Math.sqrt(disc)) / (2 * a), (-b + Math.sqrt(disc)) / (2 * a)];
      for (const r of rs) {
        if (r < xmin || r > xmax) continue;
        roots.appendChild(mk('circle', { cx: X(r), cy: Y(0), r: 4.5, class: 'rf-root' }));
        const t = mk('text', { x: X(r), y: Y(0) + 18, class: 'rf-rootlab' });
        t.textContent = Number.isInteger(r) ? r : r.toFixed(2);
        roots.appendChild(t);
      }
    }
    return disc;
  }
  return { svg, draw };
}

/* factors over the integers, or null */
function factored(a, b, c) {
  if (a !== 1) return null;
  for (let p = -20; p <= 20; p++) {
    const q = c / (p || 1);
    if (!Number.isInteger(q)) continue;
    if (p * q === c && p + q === b) {
      const s = (n) => (n >= 0 ? '+' + n : String(n));
      return `(x${s(p)})(x${s(q)})`;
    }
  }
  return null;
}

/* ── option lists ─────────────────────────────────────────────── */
const optHTML = (o) => (o.tex ? tex(o.tex) : inline(o.v || ''));

function Options(list, { multi, onPick }) {
  const box = el('div', 'rf-opts');
  const name = 'o' + Math.random().toString(36).slice(2, 8);
  list.forEach((o, i) => {
    const lab = el('label', 'rf-opt');
    const inp = el('input');
    inp.type = multi ? 'checkbox' : 'radio';
    inp.name = name; inp.value = i;
    inp.onchange = () => onPick(
      multi ? [...box.querySelectorAll('input:checked')].map((n) => +n.value) : i);
    lab.appendChild(inp);
    lab.appendChild(el('span', 'rf-k', 'ABCDE'[i]));
    lab.appendChild(el('span', 'rf-v', optHTML(o)));
    box.appendChild(lab);
  });
  return box;
}

const verdict = (ok, html) =>
  el('div', 'rf-said ' + (ok ? 'ok' : 'no'), html);

/* ── blocks ───────────────────────────────────────────────────── */
const shell = (b, kind) => {
  const card = el('section', 'rf-card rf-' + kind);
  card.appendChild(el('div', 'rf-tag',
    '<span class=rf-kind>' + kind + '</span>' +
    '<span class=rf-facet>' + b.facet + '</span>' +
    '<span class=rf-obj>' + (b.obj || []).join(' &middot; ') + '</span>'));
  if (b.stem) card.appendChild(el('div', 'rf-stem', inline(b.stem)));
  if (b.note) card.appendChild(el('div', 'rf-note', inline(b.note)));
  return card;
};

function probeBlock(b, report) {
  const card = shell(b, b.type === 'check' ? 'check' : 'probe');
  if (b.figure) card.appendChild(figure(b.figure));
  if (b.ask_line) card.appendChild(el('div', 'rf-ask', inline(b.ask_line)));

  const gate = el('div', 'rf-gate');
  let claim = null;
  const opts = Options(b.options, {
    multi: !!b.multi,
    onPick(v) {
      const keys = b.multi ? b.keys : [b.key];
      const got = b.multi ? v : [v];
      const ok = keys.length === got.length && keys.every((k) => got.includes(k));
      said.textContent = '';
      const extra = got.filter((g) => !keys.includes(g));
      const missed = keys.filter((k) => !got.includes(k));
      let html = ok ? 'That is the one.' : '';
      for (const e of extra) if (b.diag && b.diag[e]) html += '<div>' + inline(b.diag[e]) + '</div>';
      for (const m of missed) if (b.miss && b.miss[m]) html += '<div>' + inline(b.miss[m]) + '</div>';
      if (b.point) html += '<div class=rf-point>' + inline(b.point) + '</div>';
      said.replaceWith(said = verdict(ok, html || (ok ? 'Correct.' : 'Not that one.')));
      report({ facet: b.facet, claim, correct: ok, picked: got });
    },
  });
  let said = el('div', 'rf-said-empty');

  if (b.rate) {
    gate.appendChild(Rate((i) => { claim = i; gate.classList.add('open'); }));
    gate.appendChild(el('div', 'rf-veil', 'Choose a statement above to see the options.'));
  } else gate.classList.add('open');
  gate.appendChild(opts);
  card.appendChild(gate);
  card.appendChild(said);
  return card;
}

function methodBlock(b, report) {
  const card = shell(b, 'probe');
  const table = el('table', 'rf-grid-t');
  const head = el('tr');
  head.appendChild(el('th', '', ''));
  b.cols.forEach((c) => head.appendChild(el('th', '', c)));
  table.appendChild(head);
  const picks = new Array(b.rows.length).fill(null);
  b.rows.forEach((r, i) => {
    const tr = el('tr');
    tr.appendChild(el('td', 'rf-rowq', tex(r.tex)));
    b.cols.forEach((c, j) => {
      const td = el('td');
      const inp = el('input');
      inp.type = 'radio'; inp.name = 'row' + i;
      inp.onchange = () => {
        picks[i] = j;
        if (picks.every((p) => p !== null)) {
          const ok = picks.every((p, k) => p === b.rows[k].key);
          said.replaceWith(said = verdict(ok,
            (ok ? 'All three placed.' : 'Not quite.') +
            '<div class=rf-point>' + inline(b.point) + '</div>'));
          report({ facet: b.facet, correct: ok, picked: picks.slice() });
        }
      };
      td.appendChild(inp);
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  const gate = el('div', 'rf-gate');
  let claim = null;
  if (b.rate) {
    gate.appendChild(Rate((i) => { claim = i; gate.classList.add('open'); }));
    gate.appendChild(el('div', 'rf-veil', 'Choose a statement above to see the grid.'));
  } else gate.classList.add('open');
  gate.appendChild(table);
  card.appendChild(gate);
  let said = el('div', 'rf-said-empty');
  card.appendChild(said);
  return card;
}

function predictBlock(b, report) {
  const card = shell(b, 'predict-then-see');
  const after = el('div', 'rf-after');
  after.hidden = true;
  const opts = Options(b.options, {
    onPick(v) {
      const ok = v === b.key;
      said.replaceWith(said = verdict(ok,
        (ok ? 'That is what happens.' : '') +
        (b.diag[v] ? '<div>' + inline(b.diag[v]) + '</div>' : '')));
      after.hidden = false;
      report({ facet: b.facet, correct: ok, picked: [v] });
    },
  });
  let said = el('div', 'rf-said-empty');
  card.appendChild(opts);
  card.appendChild(said);

  // the simulation is withheld until a commitment exists
  const f = b.figure;
  const p = plot(f);
  const wrap = el('div', 'rf-fig');
  wrap.appendChild(p.svg);
  const ctl = el('div', 'rf-ctl');
  const out = el('span', 'rf-ctl-v');
  const range = el('input');
  range.type = 'range'; range.min = f.cmin; range.max = f.cmax; range.step = 0.1; range.value = f.c0;
  const redraw = () => {
    const c = +range.value;
    const disc = p.draw(f.a, f.b, c);
    out.innerHTML = tex(`c=${c.toFixed(1)}`) +
      '<span class="rf-disc">' + (disc > 0 ? 'two $x$-intercepts' : disc === 0 ? 'one' : 'none') + '</span>';
  };
  range.oninput = redraw;
  ctl.appendChild(el('span', 'rf-ctl-l', 'c'));
  ctl.appendChild(range);
  ctl.appendChild(out);
  wrap.appendChild(ctl);
  after.appendChild(wrap);
  after.appendChild(el('div', 'rf-point', inline(b.reveal)));
  card.appendChild(after);
  redraw();
  return card;
}

function figure(f) {
  const wrap = el('div', 'rf-fig');
  const p = plot(f);
  wrap.appendChild(p.svg);
  p.draw(f.a, f.b, f.c);
  return wrap;
}

function abcBlock(b) {
  const card = shell(b, 'show');
  const f = b.figure;
  const p = plot(f);
  const wrap = el('div', 'rf-fig');
  wrap.appendChild(p.svg);
  const form = el('div', 'rf-form');
  const ctls = {};
  [['a', -3, 3, 1, f.a], ['b', -8, 8, 1, f.b], ['c', -8, 8, 1, f.c]].forEach(([k, lo, hi, st, v]) => {
    const row = el('div', 'rf-ctl');
    row.appendChild(el('span', 'rf-ctl-l', k));
    const r = el('input');
    r.type = 'range'; r.min = lo; r.max = hi; r.step = st; r.value = v;
    const o = el('span', 'rf-ctl-v');
    r.oninput = () => redraw();
    ctls[k] = { r, o };
    row.appendChild(r); row.appendChild(o);
    form.appendChild(row);
  });
  function redraw() {
    const a = +ctls.a.r.value, bb = +ctls.b.r.value, c = +ctls.c.r.value;
    ctls.a.o.textContent = a; ctls.b.o.textContent = bb; ctls.c.o.textContent = c;
    p.draw(a, bb, c);
    const fac = factored(a, bb, c);
    form.querySelector('.rf-eq').innerHTML =
      tex(`y=${a === 1 ? '' : a === -1 ? '-' : a}x^{2}${bb >= 0 ? '+' : ''}${bb}x${c >= 0 ? '+' : ''}${c}`) +
      (fac ? '<span class="rf-fac">' + tex('=' + fac) + '</span>' : '');
  }
  form.appendChild(el('div', 'rf-eq'));
  wrap.appendChild(form);
  card.appendChild(wrap);
  redraw();
  return card;
}

function tellBlock(b) {
  const card = shell(b, 'tell');
  card.appendChild(el('div', 'rf-tell-t', b.title));
  card.appendChild(el('div', 'rf-tell-b', inline(b.body)));
  return card;
}

function contrastBlock(b) {
  const card = shell(b, 'contrast');
  const row = el('div', 'rf-contrast');
  [b.left, b.right].forEach((s) => {
    const c = el('div', 'rf-side');
    c.appendChild(el('div', 'rf-side-x', tex(s.tex)));
    c.appendChild(el('div', 'rf-side-v', tex(s.value)));
    c.appendChild(el('div', 'rf-side-l', inline(s.label)));
    row.appendChild(c);
  });
  card.appendChild(row);
  card.appendChild(el('div', 'rf-point', inline(b.point)));
  return card;
}

function multipartBlock(b) {
  const card = shell(b, 'ladder');
  b.parts.forEach((p) => {
    const row = el('div', 'rf-part');
    row.appendChild(el('span', 'rf-part-l', p.label));
    const body = el('div', 'rf-part-b');
    body.appendChild(el('div', '', inline(p.q)));
    const line = el('div', 'rf-slots');
    for (let i = 0; i < p.slots; i++) {
      const inp = el('input');
      inp.type = 'text'; inp.className = 'rf-in'; inp.size = p.slots === 1 ? 16 : 5;
      line.appendChild(inp);
    }
    const rev = el('button', 'rf-reveal', 'show');
    const ans = el('span', 'rf-ans');
    rev.onclick = () => { ans.innerHTML = inline(p.key); rev.remove(); };
    line.appendChild(rev); line.appendChild(ans);
    body.appendChild(line);
    row.appendChild(body);
    card.appendChild(row);
  });
  card.appendChild(el('div', 'rf-point', inline(b.point)));
  return card;
}

export function renderBlock(b, report) {
  if (b.type === 'probe' && b.ask === 'method') return methodBlock(b, report);
  if (b.type === 'probe' || b.type === 'check') return probeBlock(b, report);
  if (b.type === 'predict') return predictBlock(b, report);
  if (b.type === 'show') return abcBlock(b);
  if (b.type === 'tell') return tellBlock(b);
  if (b.type === 'contrast') return contrastBlock(b);
  if (b.type === 'multipart') return multipartBlock(b);
  return el('div', 'rf-card', 'unknown block: ' + b.type);
}
