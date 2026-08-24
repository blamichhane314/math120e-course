// graph.js — one objective and its immediate relations.
//
// The view is a spine: what the objective rests on to the left, the objective
// in the middle, what uses it later to the right. Left to right is course
// order.
//
// Relation type is carried by line style, not hue: solid for a hard
// requirement, dotted for a soft ordering. The reason an edge exists is shown
// on hover, not at rest.

import { inline, tex, renderBlocks } from './blocks.js?v=5';
import { renderAnswer } from './answers.js?v=6';

const esc = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

/**
 * @param {HTMLElement} host
 * @param {object} G      { nodes: {id:node}, edges: [{from,to,type,why}] }
 * @param {string} focus  objective id at the centre
 * @param {object} opts   { onFocus(id) }
 */
export function mountGraph(host, G, focus, opts = {}) {
  const node = G.nodes[focus];
  if (!node) { host.innerHTML = '<div class="gr-fail">no such objective: ' + esc(focus) + '</div>'; return; }

  const back = G.edges.filter((e) => e.to === focus);
  const fwd  = G.edges.filter((e) => e.from === focus);

  // hard requirements first, then soft ordering; within each, course order
  const order = (a, b) =>
    (a.type === b.type ? 0 : a.type === 'requires' ? -1 : 1) ||
    String(a.other).localeCompare(String(b.other), undefined, { numeric: true });

  const side = (edges, dir) => edges
    .map((e) => ({ ...e, other: dir === 'back' ? e.from : e.to }))
    .sort(order);

  const L = side(back, 'back');
  const R = side(fwd, 'fwd');

  const cell = (e) => {
    const n = G.nodes[e.other];
    if (!n) return '';
    const hard = e.type === 'requires';
    return '<button class="gr-n' + (hard ? ' hard' : '') + '"' +
      ' data-id="' + esc(e.other) + '" data-type="' + esc(e.type) + '"' +
      ' data-why="' + esc(e.why || '') + '">' +
      '<span class="gr-mark"></span>' +
      '<span class="gr-t">' + esc(n.text) + '</span>' +
      '<span class="gr-id">' + esc(e.other) + '</span>' +
      '</button>';
  };

  // Fourteen names in a flat list is fourteen things to read before any of them
  // means anything. Grouped under their section they read as three or four
  // places in the course instead.
  const secKey = (id) => { const [a, b] = String(id).split('.').map(Number); return a * 1000 + (b || 0); };
  const groups = (list) => {
    const by = new Map();
    for (const e of list) {
      const n = G.nodes[e.other];
      if (!n) continue;
      if (!by.has(n.section)) by.set(n.section, { title: n.sectionTitle || '', items: [] });
      by.get(n.section).items.push(e);
    }
    return [...by.entries()].sort((x, y) => secKey(x[0]) - secKey(y[0]));
  };

  const emptyNote = (which) => '<div class="gr-none">' +
    (which === 'back'
      ? 'nothing in this course comes before it'
      : 'nothing later in this course uses it') + '</div>';

  const column = (list, dir) => {
    const hard = list.filter((e) => e.type === 'requires').length;
    return '<div class="gr-head">' + (dir === 'back' ? 'rests on' : 'leads to') +
        '<span class="gr-count">' + list.length +
        (hard ? ' · ' + hard + ' required' : '') + '</span></div>' +
      (list.length
        ? groups(list).map(([sec, g]) =>
            '<div class="gr-grp">' +
              '<div class="gr-sec">' + esc(sec) +
              (g.title ? ' &middot; ' + esc(g.title.toLowerCase()) : '') + '</div>' +
              g.items.slice().sort(order).map(cell).join('') +
            '</div>').join('')
        : emptyNote(dir));
  };

  // An empty side should not hold a third of the screen open.
  const shape = (!L.length ? ' none-back' : '') + (!R.length ? ' none-fwd' : '');
  const mine = (opts.practice || {})[focus] || [];
  const nPractice = mine.length;
  const anySoft = [...L, ...R].some((e) => e.type !== 'requires');

  host.innerHTML =
    '<div class="gr' + shape + '">' +
      '<div class="gr-col gr-back">' + column(L, 'back') + '</div>' +
      '<div class="gr-col gr-here">' +
        '<div class="gr-head">' + esc(node.section) + ' &middot; ' + esc(node.week || '') + '</div>' +
        '<div class="gr-focus">' +
          '<span class="gr-id">' + esc(focus) + '</span>' +
          '<span class="gr-t">' + esc(node.text) + '</span>' +
          '<span class="gr-meta">' + node.problems + ' assigned in MyLab</span>' +
        '</div>' +
        (nPractice ? '<button class="gr-practice">' + nPractice +
          ' practice question' + (nPractice === 1 ? '' : 's') + '</button>' : '') +
        (anySoft ? '<button class="gr-filter" aria-pressed="false">requirements only</button>' : '') +
        '<div class="gr-ex" hidden></div>' +
      '</div>' +
      '<div class="gr-col gr-fwd">' + column(R, 'fwd') + '</div>' +
    '</div>' +
    '<div class="gr-why" hidden></div>';

  /* A read-only look at the practice for this objective, over the page rather
     than instead of it: you are checking what the problems are like without
     losing your place in the graph. Nothing here is answerable — the inputs
     are rendered so the shape of the question is honest, then made inert. */
  const pracBtn = host.querySelector('.gr-practice');
  if (pracBtn) pracBtn.addEventListener('click', () => openSheet(mine, node, focus));

  function openSheet(list, n, id) {
    const prev = document.activeElement;
    const back = document.createElement('div');
    back.className = 'sheet-back';
    back.innerHTML =
      '<div class="sheet" role="dialog" aria-modal="true" aria-label="Practice for ' + esc(id) + '">' +
        '<div class="sheet-h">' +
          '<div><span class="sheet-id">' + esc(id) + '</span>' +
          '<span class="sheet-t">' + esc(n.text) + '</span></div>' +
          '<button class="sheet-x" aria-label="Close">close</button>' +
        '</div>' +
        '<div class="sheet-note">' + list.length + ' practice question' +
          (list.length === 1 ? '' : 's') +
          ' &middot; shown to read, not to answer</div>' +
        '<div class="sheet-body"></div>' +
      '</div>';
    const body = back.querySelector('.sheet-body');

    list.forEach((q, i) => {
      const card = document.createElement('div');
      card.className = 'sheet-q';
      card.innerHTML = '<div class="sheet-n">' + String(i + 1).padStart(2, '0') +
        (q.level === 'stretch' ? '<span class="sheet-lv">stretch</span>' : '') + '</div>';
      const inner = document.createElement('div');
      inner.className = 'sheet-qb';
      try {
        if (q.stem && q.stem.length) renderBlocks(q.stem, inner);
        if (q.answer) {
          const a = renderAnswer(q.answer, { onChange() {} });
          a.classList.add('inert');
          inner.appendChild(a);
        }
      } catch (err) {
        inner.innerHTML = '<div class="sheet-fail">could not render this question</div>';
      }
      // read-only: the shape stays, the interaction does not
      inner.querySelectorAll('input,select,textarea,button').forEach((el) => {
        el.disabled = true; el.tabIndex = -1;
      });
      card.appendChild(inner);
      body.appendChild(card);
    });

    const close = () => {
      back.remove();
      removeEventListener('keydown', onKey);
      // back to whatever opened it; body is not a useful place to land
      const to = (prev && prev.focus && prev !== document.body) ? prev : pracBtn;
      if (to && to.focus) to.focus();
    };
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    back.addEventListener('click', (e) => {
      if (e.target === back || e.target.closest('.sheet-x')) close();
    });
    addEventListener('keydown', onKey);
    document.body.appendChild(back);
    back.querySelector('.sheet-x').focus();
  }

  const grid = host.querySelector('.gr');
  const filter = host.querySelector('.gr-filter');
  if (filter) filter.addEventListener('click', () => {
    const on = grid.classList.toggle('hard-only');
    filter.setAttribute('aria-pressed', String(on));
    filter.textContent = on ? 'show all relations' : 'requirements only';
  });

  const why = host.querySelector('.gr-why');

  // hovering a node shows the reason for its edge
  const reveal = (b) => {
    if (!b || why.classList.contains('pinned')) return;
    const w = b.getAttribute('data-why');
    why.textContent = w || '';
    why.hidden = !w;
  };
  host.addEventListener('mouseover', (e) => reveal(e.target.closest('.gr-n')));
  // Tab walks the list, so the reason has to follow the keyboard as well as
  // the cursor; otherwise the list is unreadable without a mouse.
  host.addEventListener('focusin', (e) => reveal(e.target.closest('.gr-n')));
  host.addEventListener('mouseout', (e) => {
    if (!e.target.closest('.gr-n')) return;
    if (why.classList.contains('pinned')) return;   // pinned stays until replaced
    why.hidden = true;
  });
  /* Clicking a neighbour shows how the two are joined: a short worked
     example in which the focused objective is visibly used inside the later
     one. It goes in the middle column, which was otherwise empty ground
     beside the list. */
  const ex = host.querySelector('.gr-ex');
  const B = opts.bridges || {};

  function showExample(b) {
    const id = b.getAttribute('data-id');
    const key = focus + '>' + id;
    const d = B[key];
    host.querySelectorAll('.gr-n.sel').forEach((n) => n.classList.remove('sel'));
    b.classList.add('sel');

    const n = G.nodes[id];
    const head = '<div class=ex-h><span class=ex-a>' + esc(focus) + '</span>' +
      '<span class=ex-arrow>&rarr;</span><span class=ex-b>' + esc(id) + '</span>' +
      '<span class=ex-type>' + (b.getAttribute('data-type') === 'requires'
        ? 'required' : 'prepares for') + '</span></div>' +
      '<div class=ex-t>' + esc(n.text) + '</div>';

    const body = d
      ? '<div class=ex-p>' + inline(d.prompt) + '</div>' +
        '<ol class=ex-steps>' + d.steps.map((st) =>
          '<li><span class=ex-tex>' + tex(st.tex) + '</span>' +
          (st.say ? '<span class=ex-say>' + inline(st.say) + '</span>' : '') +
          '</li>').join('') + '</ol>' +
        '<div class=ex-point>' + inline(d.point) + '</div>'
      : '<div class=ex-none>' + esc(b.getAttribute('data-why') || 'No worked example written for this pair yet.') + '</div>';

    ex.innerHTML = head + body +
      '<div class=ex-acts>' +
        '<button data-a=focus>centre on ' + esc(id) + '</button>' +
        '<button data-a=section>open ' + esc(n.section) + '</button>' +
        '<button data-a=close>close</button>' +
      '</div>';
    ex.hidden = false;
  }

  host.addEventListener('click', (e) => {
    const act = e.target.closest('.gr-ex button[data-a]');
    if (act) {
      const a = act.getAttribute('data-a');
      const sel = host.querySelector('.gr-n.sel');
      const id = sel && sel.getAttribute('data-id');
      if (a === 'focus' && id) { opts.onFocus ? opts.onFocus(id) : mountGraph(host, G, id, opts); }
      else if (a === 'section' && id && opts.onSection) opts.onSection(G.nodes[id].section);
      else { ex.hidden = true; if (sel) sel.classList.remove('sel'); }
      return;
    }
    const b = e.target.closest('.gr-n');
    if (b) showExample(b);
  });

  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    ex.hidden = true;
    host.querySelectorAll('.gr-n.sel').forEach((n) => n.classList.remove('sel'));
  });
}

/** Build the lookup the view needs from the node list and edge list. */
export function buildGraph(nodes, edges) {
  const byId = {};
  for (const n of nodes) byId[n.id] = n;
  const seen = new Set();
  const clean = [];
  for (const e of edges) {
    if (!byId[e.from] || !byId[e.to] || e.from === e.to) continue;
    const k = e.from + '>' + e.to;
    if (seen.has(k)) continue;               // one edge per pair; type is merged upstream
    seen.add(k);
    clean.push(e);
  }
  return { nodes: byId, edges: clean };
}

/** Section-level aggregation. */
export function aggregate(G) {
  const secs = {};
  for (const id in G.nodes) {
    const n = G.nodes[id];
    secs[n.section] = secs[n.section] || { id: n.section, title: n.sectionTitle, week: n.week, out: {}, in: {} };
  }
  for (const e of G.edges) {
    const a = G.nodes[e.from], b = G.nodes[e.to];
    if (!a || !b || a.section === b.section) continue;
    secs[a.section].out[b.section] = (secs[a.section].out[b.section] || 0) + 1;
    secs[b.section].in[a.section]  = (secs[b.section].in[a.section]  || 0) + 1;
  }
  return secs;
}

/** Connected components over the section graph, ignoring direction. */
export function components(secs) {
  const seen = new Set(), out = [];
  for (const id in secs) {
    if (seen.has(id)) continue;
    const stack = [id], group = [];
    seen.add(id);
    while (stack.length) {
      const cur = stack.pop();
      group.push(cur);
      const nbrs = [...Object.keys(secs[cur].out || {}), ...Object.keys(secs[cur].in || {})];
      for (const nb of nbrs) if (!seen.has(nb)) { seen.add(nb); stack.push(nb); }
    }
    out.push(group.sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true })));
  }
  return out.sort((a, b) => b.length - a.length);
}

/* ── the underlying graph, as a matrix ─────────────────────────────
   Ordered by course order on both axes, so a cell is "section on the left
   feeds section along the top". Reading down a column tells you what a section
   rests on; reading across a row tells you where it goes. */
const NS2 = 'http://www.w3.org/2000/svg';
const mk = (t, a = {}) => {
  const n = document.createElementNS(NS2, t);
  for (const k in a) n.setAttribute(k, a[k]);
  return n;
};

export function mountMatrix(host, G, opts = {}) {
  const key = (s) => s.split('.').map(Number);
  const secs = [...new Set(Object.values(G.nodes).map((n) => n.section))]
    .sort((a, b) => key(a)[0] - key(b)[0] || key(a)[1] - key(b)[1]);
  const at = new Map(secs.map((s, i) => [s, i]));
  const N = secs.length;

  // cell[from][to] = { requires, prepares, edges[] }
  const cell = {};
  for (const e of G.edges) {
    const a = G.nodes[e.from].section, b = G.nodes[e.to].section;
    if (a === b) continue;
    const k = a + '>' + b;
    const c = (cell[k] = cell[k] || { requires: 0, prepares: 0, edges: [] });
    c[e.type === 'requires' ? 'requires' : 'prepares']++;
    c.edges.push(e);
  }
  const most = Math.max(1, ...Object.values(cell).map((c) => c.requires + c.prepares));

  const S = 22, L = 42, T = 42;
  const W = L + N * S + 14, H = T + N * S + 14;
  const svg = mk('svg', { viewBox: `0 0 ${W} ${H}`, class: 'mx' });

  secs.forEach((s, i) => {
    const rl = mk('text', { x: L - 6, y: T + i * S + S / 2 + 3, class: 'mx-lab end' });
    rl.textContent = s; svg.appendChild(rl);
    const cl = mk('text', {
      x: L + i * S + S / 2, y: T - 8, class: 'mx-lab',
      transform: `rotate(-90 ${L + i * S + S / 2} ${T - 8})`,
    });
    cl.textContent = s; svg.appendChild(cl);
  });

  // dividers between chapters
  let prev = null;
  secs.forEach((s, i) => {
    const ch = key(s)[0];
    if (ch === prev) return;
    prev = ch;
    svg.appendChild(mk('line', { x1: L + i * S, y1: T - 34, x2: L + i * S, y2: T + N * S, class: 'mx-div' }));
    svg.appendChild(mk('line', { x1: L - 34, y1: T + i * S, x2: L + N * S, y2: T + i * S, class: 'mx-div' }));
  });

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const k = secs[r] + '>' + secs[c];
      const v = cell[k];
      const g = mk('rect', {
        x: L + c * S + 1.5, y: T + r * S + 1.5, width: S - 3, height: S - 3,
        rx: 1.5, class: 'mx-cell' + (v ? ' has' : '') + (r === c ? ' diag' : ''),
        'data-k': k,
      });
      if (v) {
        g.setAttribute('style', 'opacity:' + (0.22 + 0.78 * ((v.requires + v.prepares) / most)).toFixed(3));
        if (v.requires) g.classList.add('hard');
      }
      svg.appendChild(g);
    }
  }

  host.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'mx-wrap';
  wrap.appendChild(svg);
  host.appendChild(wrap);
  const cap = document.createElement('div');
  cap.className = 'mx-cap';
  cap.innerHTML = '<span class=mx-hint>rows feed columns &middot; hover a cell</span>';
  host.appendChild(cap);

  svg.addEventListener('mouseover', (ev) => {
    const t = ev.target.closest('.mx-cell.has');
    if (!t) return;
    const v = cell[t.getAttribute('data-k')];
    const [a, b] = t.getAttribute('data-k').split('>');
    cap.innerHTML =
      '<b>' + a + ' &rarr; ' + b + '</b> &middot; ' +
      v.requires + ' hard, ' + v.prepares + ' soft' +
      '<div class=mx-list>' + v.edges.slice(0, 6).map((e) =>
        '<div><span>' + e.from + ' &rarr; ' + e.to + '</span>' + (e.why || '') + '</div>').join('') +
      (v.edges.length > 6 ? '<div class=mx-more>' + (v.edges.length - 6) + ' more</div>' : '') +
      '</div>';
  });
  svg.addEventListener('click', (ev) => {
    const t = ev.target.closest('.mx-cell.has');
    if (t && opts.onCell) opts.onCell(t.getAttribute('data-k').split('>'));
  });
  return svg;
}

/* ── chapters ──────────────────────────────────────────────────────
   Eight nodes and roughly nine hard edges, drawn as arcs in course order, so
   an arc's horizontal span is how far the dependency reaches.
   Weight is normalised, because a raw count rewards whichever chapter holds
   more objectives: chapter 1 has 24 and chapter 3 has 4.
       receiver  = what share of the target chapter depends on the source
       sender    = what share of the source chapter is used by the target
   Hard requirements are drawn at rest; soft ordering appears when a chapter
   is selected. */
export function chapterModel(G) {
  const chOf = (id) => +G.nodes[id].section.split('.')[0];
  const chapters = new Map();
  for (const id in G.nodes) {
    const c = chOf(id);
    const e = chapters.get(c) || { id: c, objectives: [], sections: new Set() };
    e.objectives.push(id);
    e.sections.add(G.nodes[id].section);
    chapters.set(c, e);
  }
  const order = [...chapters.keys()].sort((a, b) => a - b);
  const pairs = new Map();
  const seen = new Set();
  for (const e of G.edges) {
    const k = e.from + '>' + e.to;
    if (seen.has(k)) continue;
    seen.add(k);
    const a = chOf(e.from), b = chOf(e.to);
    if (a === b) continue;
    const pk = a + '>' + b;
    const p = pairs.get(pk) || { a, b, hard: 0, soft: 0, edges: [], srcs: new Set(), tgts: new Set() };
    p[e.type === 'requires' ? 'hard' : 'soft']++;
    p.edges.push(e);
    p.srcs.add(e.from); p.tgts.add(e.to);
    pairs.set(pk, p);
  }
  for (const p of pairs.values()) {
    p.receiver = p.tgts.size / chapters.get(p.b).objectives.length;
    p.sender   = p.srcs.size / chapters.get(p.a).objectives.length;
  }
  return { order, chapters, pairs: [...pairs.values()] };
}

export function mountChapters(host, G, opts = {}) {
  const M = chapterModel(G);
  let norm = opts.norm || 'receiver';
  let sel = null;

  const W = 900, BASE = 330, TOP = 60, PADX = 60;
  const xOf = (c) => PADX + (M.order.indexOf(c) / (M.order.length - 1)) * (W - 2 * PADX);

  function draw() {
    const svg = mk('svg', { viewBox: `0 0 ${W} ${BASE + 70}`, class: 'ch' });
    const shown = M.pairs.filter((p) =>
      p.hard > 0 || (sel !== null && (p.a === sel || p.b === sel)));

    for (const p of shown) {
      const x1 = xOf(p.a), x2 = xOf(p.b);
      const span = Math.abs(M.order.indexOf(p.b) - M.order.indexOf(p.a));
      const h = BASE - (TOP + span * 34);
      const w = 0.8 + (p[norm] || 0) * 7;
      const touched = sel === null || p.a === sel || p.b === sel;
      const path = mk('path', {
        d: `M${x1},${BASE} Q${(x1 + x2) / 2},${h} ${x2},${BASE}`,
        class: 'ch-arc' + (p.hard ? ' hard' : ' soft') + (touched ? '' : ' off'),
        'stroke-width': w.toFixed(2),
        'data-k': p.a + '>' + p.b,
      });
      svg.appendChild(path);
    }

    for (const c of M.order) {
      const info = M.chapters.get(c);
      const r = 8 + Math.sqrt(info.objectives.length) * 2.2;
      const g = mk('g', { class: 'ch-node' + (sel === c ? ' sel' : ''), 'data-c': c });
      g.appendChild(mk('circle', { cx: xOf(c), cy: BASE, r, class: 'ch-dot' }));
      const t = mk('text', { x: xOf(c), y: BASE + r + 18, class: 'ch-lab' });
      t.textContent = 'ch ' + c;
      g.appendChild(t);
      const n = mk('text', { x: xOf(c), y: BASE + r + 31, class: 'ch-sub' });
      n.textContent = info.objectives.length;
      g.appendChild(n);
      svg.appendChild(g);
    }
    svg.appendChild(mk('line', { x1: PADX - 30, y1: BASE, x2: W - PADX + 30, y2: BASE, class: 'ch-axis' }));

    host.querySelector('.ch-stage').innerHTML = '';
    host.querySelector('.ch-stage').appendChild(svg);

    svg.addEventListener('click', (ev) => {
      const n = ev.target.closest('.ch-node');
      sel = n ? (sel === +n.getAttribute('data-c') ? null : +n.getAttribute('data-c')) : null;
      draw(); detail();
    });
    svg.addEventListener('mouseover', (ev) => {
      const a = ev.target.closest('.ch-arc');
      if (!a) return;
      const p = M.pairs.find((q) => q.a + '>' + q.b === a.getAttribute('data-k'));
      if (p) say(p);
    });
  }

  function say(p) {
    host.querySelector('.ch-cap').innerHTML =
      '<b>ch ' + p.a + ' &rarr; ch ' + p.b + '</b> &middot; ' +
      p.hard + ' hard, ' + p.soft + ' soft &middot; ' +
      Math.round(p.receiver * 100) + '% of ch ' + p.b + ' depends on it &middot; ' +
      Math.round(p.sender * 100) + '% of ch ' + p.a + ' is used by it';
  }

  function detail() {
    const box = host.querySelector('.ch-detail');
    if (sel === null) {
      box.innerHTML = '<span class=ch-hint>select a chapter for its full relations, soft ones included</span>';
      return;
    }
    const info = M.chapters.get(sel);
    const out = M.pairs.filter((p) => p.a === sel).sort((a, b) => b[norm] - a[norm]);
    const inc = M.pairs.filter((p) => p.b === sel).sort((a, b) => b[norm] - a[norm]);
    const row = (p, dir) =>
      '<div class=ch-row><span>' + (dir === 'out' ? '&rarr; ch ' + p.b : '&larr; ch ' + p.a) + '</span>' +
      '<i>' + p.hard + ' hard &middot; ' + p.soft + ' soft</i>' +
      '<em>' + Math.round(p[norm] * 100) + '%</em></div>';
    box.innerHTML =
      '<div class=ch-dh>chapter ' + sel + ' &middot; ' + info.objectives.length +
      ' objectives in ' + info.sections.size + ' sections</div>' +
      (inc.length ? '<div class=ch-grp><span>rests on</span>' + inc.map((p) => row(p, 'in')).join('') + '</div>' : '') +
      (out.length ? '<div class=ch-grp><span>leads to</span>' + out.map((p) => row(p, 'out')).join('') + '</div>' : '');
  }

  host.innerHTML =
    '<div class=stepper>' +
      '<button class="sbtn on" data-n=receiver>how much rests on it</button>' +
      '<button class=sbtn data-n=sender>how much of it is used</button>' +
    '</div>' +
    '<div class=ch-stage></div><div class=ch-cap></div><div class=ch-detail></div>';
  host.querySelectorAll('[data-n]').forEach((b) => {
    b.onclick = () => {
      norm = b.getAttribute('data-n');
      host.querySelectorAll('[data-n]').forEach((x) => x.classList.toggle('on', x === b));
      draw(); detail();
    };
  });
  draw(); detail();
}
