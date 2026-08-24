// answers.js — the interaction half. One renderer per way a problem can be
// answered, all sharing a single contract so a problem's shape is data.
//
// Counts across the 524-problem corpus that drove this list:
//   compute 219 · choice(text) 116 · multipart 87 · fill 79 · choice(figure) 14
//
// Nothing here grades. An answer component collects a response and reports it;
// what is correct lives with the content. Checking is a separate concern, so
// the same component serves practice, a quiz, or a worked example with the
// response pre-filled.

import { renderBlocks, tex, inline, hasMath } from './blocks.js?v=1';

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const div = (cls, html) => { const d = document.createElement('div'); d.className = cls; if (html != null) d.innerHTML = html; return d; };

let uid = 0;
const nextId = () => 'a' + (++uid);

/** Render a template string carrying ⟨n⟩ markers into a line, substituting the
 *  matching slot. Shared by fill, select, and options that contain a box: the
 *  publisher mixes an input into a choice ("A. x²+5x+6 = ▭ / B. not
 *  factorable"), so a slot has to be placeable anywhere prose is. */
function templateInto(line, template, slots, ctx, asSelect = false) {
  // A slot can sit inside the mathematics as well as beside it: "x^5 · x^3 =
  // x^⟨0⟩" wants a box in the exponent, not a box after the expression. So the
  // template is cut into math spans and prose FIRST. Splitting on the markers
  // first would tear a `$…$` pair in half, and the surviving halves then pair
  // with the wrong partners — the prose between two expressions ends up
  // typeset as mathematics while the algebra is left as source.
  const src = String(template ?? '');
  const re = /\$([^$]+)\$/g;
  let last = 0, m;
  const prose = (t) => {
    t.split(/(⟨\d+⟩)/).forEach((p) => {
      const k = /^⟨(\d+)⟩$/.exec(p);
      if (k) line.appendChild(slotFor(+k[1], slots, ctx, asSelect));
      else if (p) {
        const span = document.createElement('span');
        span.innerHTML = inline(p);
        line.appendChild(span);
      }
    });
  };
  while ((m = re.exec(src)) !== null) {
    prose(src.slice(last, m.index));
    line.appendChild(mathSpan(m[1], slots, ctx, asSelect));
    last = m.index + m[0].length;
  }
  prose(src.slice(last));
  return line;
}

function slotFor(n, slots, ctx, asSelect) {
  const s = (slots || [])[n] || {};
  const id = s.id ?? n;
  return asSelect || s.options ? SelectSlot({ ...s, id }, ctx)
                               : Slot({ ...s, id }, ctx.onChange);
}

/** One `$…$` span, which may carry ⟨n⟩ markers. Each marker becomes a phantom
 *  of the slot's own width, so KaTeX reserves exactly the room the input needs
 *  and — because the phantom is typeset in position — reserves it at the size
 *  the position calls for. A slot in an exponent comes out in script size
 *  without anything here knowing it was in an exponent. */
function mathSpan(source, slots, ctx, asSelect) {
  const span = document.createElement('span');
  if (!/⟨\d+⟩/.test(source)) { span.innerHTML = tex(source); return span; }

  const used = [];
  const marked = source.replace(/⟨(\d+)⟩/g, (_, n) => {
    used.push(+n);
    const s = (slots || [])[+n] || {};
    return '\\htmlClass{tslot tslot-' + n + '}{\\phantom{' +
           '0'.repeat(Math.max(2, Math.min(+s.size || 3, 3))) + '}}';
    // The authored size suits a box standing on its own. Set into an
    // expression it reads as a rule rather than a blank, so it is capped.
  });

  try {
    span.innerHTML = window.katex.renderToString(marked, {
      throwOnError: false, output: 'html', trust: true, strict: false,
    });
  } catch { span.innerHTML = tex(source); return span; }

  for (const n of used) {
    const host = span.querySelector('.tslot-' + n);
    if (!host) continue;                       // KaTeX dropped it; leave the gap
    const inp = slotFor(n, slots, ctx, asSelect);
    inp.classList.add('in-math');
    host.appendChild(inp);
  }
  return span;
}

function SelectSlot(s, ctx) {
  const opts = s.options || [];
  // A native <select> cannot hold markup, so an option that is an expression
  // would show its LaTeX source. Where the choices carry math, fall back to an
  // inline pill group, which can render it.
  if (opts.some(hasMath)) {
    const g = document.createElement('span');
    g.className = 'a-pills';
    const name = nextId();
    opts.forEach((o, i) => {
      const id = name + '-' + i;
      const lab = document.createElement('label');
      lab.className = 'a-pill';
      lab.setAttribute('for', id);
      const r = document.createElement('input');
      r.type = 'radio'; r.name = name; r.id = id; r.className = 'a-pillin';
      r.addEventListener('change', () => ctx.onChange && ctx.onChange(s.id, o));
      const t = document.createElement('span');
      t.innerHTML = inline(o);
      lab.appendChild(r); lab.appendChild(t);
      g.appendChild(lab);
    });
    return g;
  }
  const sel = document.createElement('select');
  sel.className = 'a-sel';
  const blank = document.createElement('option');
  blank.value = ''; blank.textContent = '—';
  sel.appendChild(blank);
  opts.forEach((o) => {
    const op = document.createElement('option');
    op.value = o; op.textContent = o;
    sel.appendChild(op);
  });
  sel.addEventListener('change', () => ctx.onChange && ctx.onChange(s.id, sel.value));
  return sel;
}

/** A single response slot. `format` is a hint to the learner, never a validator. */
function Slot(s = {}, onChange) {
  const w = document.createElement('span');
  w.className = 'a-slot';
  if (s.prefix) w.appendChild(div('a-fix', esc(s.prefix)));
  const i = document.createElement('input');
  i.type = 'text';
  i.className = 'a-in';
  i.size = s.size || 8;
  i.setAttribute('inputmode', s.numeric === false ? 'text' : 'decimal');
  if (s.value != null) i.value = s.value;
  if (s.readonly) i.readOnly = true;
  i.addEventListener('input', () => onChange && onChange(s.id, i.value));
  w.appendChild(i);
  if (s.suffix) w.appendChild(div('a-fix', esc(s.suffix)));
  if (s.unit) w.appendChild(div('a-unit', esc(s.unit)));
  return w;
}

/* ── compute: one or more bare value slots ─────────────────────── */
export function Compute(a, ctx) {
  const box = div('a-compute');
  (a.slots || [{}]).forEach((s) => {
    const line = div('a-line');
    if (s.label) line.appendChild(div('a-label', inline(s.label)));
    line.appendChild(Slot(s, ctx.onChange));
    box.appendChild(line);
  });
  if (a.note) box.appendChild(div('a-note', inline(a.note)));
  return box;
}

/* ── fill: slots sitting inside a sentence ─────────────────────── */
// template carries ⟨0⟩ ⟨1⟩ … markers; the slot sits in the prose, not under it.
export function Fill(a, ctx) {
  const box = div('a-fill');
  box.appendChild(templateInto(div('a-line a-prose'), a.template || '⟨0⟩', a.slots, ctx));
  if (a.note) box.appendChild(div('a-note', inline(a.note)));
  return box;
}

/* ── select: a choice made inside a sentence ───────────────────── */
// a word chosen mid-clause, not a lettered option list.
export function Select(a, ctx) {
  const box = div('a-fill');
  box.appendChild(templateInto(div('a-line a-prose'), a.template || '⟨0⟩', a.slots, ctx, true));
  if (a.note) box.appendChild(div('a-note', inline(a.note)));
  return box;
}

/* ── choice: options that are text, math, or whole figures ─────── */
// An option is a block list, so the same renderer draws a figure option.
// Figure options are laid out as a grid, text as rows.
export function Choice(a, ctx) {
  const name = nextId();
  const figure = (a.options || []).some((o) => Array.isArray(o) && o.some((b) => b.t !== 'text' && b.t !== 'math'));
  const box = div('a-choice' + (figure ? ' is-fig' : ''));
  (a.options || []).forEach((o, i) => {
    const id = name + '-' + i;
    const lab = document.createElement('label');
    lab.className = 'a-opt';
    lab.setAttribute('for', id);
    const input = document.createElement('input');
    input.type = a.multi ? 'checkbox' : 'radio';
    input.name = name; input.id = id; input.className = 'a-radio';
    input.addEventListener('change', () => ctx.onChange && ctx.onChange(a.id ?? 'choice', i));
    lab.appendChild(input);
    lab.appendChild(div('a-key', String.fromCharCode(65 + i)));
    const body = div('a-optbody');
    // an option may be a bare block list, or {blocks, slots} when the option
    // itself contains an input box
    const blocks = Array.isArray(o) ? o : (o && o.blocks) || [{ t: 'text', v: String(o) }];
    const slots = (o && o.slots) || [];
    blocks.forEach((b) => {
      if (b.t === 'text' && /⟨\d+⟩/.test(b.v || '')) {
        body.appendChild(templateInto(div('a-line a-prose'), b.v, slots, ctx));
      } else {
        renderBlocks([b], body);
      }
    });
    lab.appendChild(body);
    box.appendChild(lab);
  });
  return box;
}

/* ── multipart: (a) (b) (c), each with its own stem and answer ─── */
export function MultiPart(a, ctx) {
  const box = div('a-parts');
  (a.parts || []).forEach((p, i) => {
    const b = div('a-part');
    b.appendChild(div('a-plabel', inline(p.label || `(${String.fromCharCode(97 + i)})`)));
    const body = div('a-pbody');
    if (p.stem) renderBlocks(p.stem, body);
    if (p.answer) body.appendChild(renderAnswer(p.answer, ctx));
    b.appendChild(body);
    box.appendChild(b);
  });
  return box;
}

export const ANSWER = {
  compute: Compute, fill: Fill, select: Select,
  choice: Choice, mcq: Choice, multipart: MultiPart,
};

export function renderAnswer(a, ctx = {}) {
  const f = ANSWER[a && a.kind];
  if (!f) {
    return div('a-unknown', 'no renderer for answer kind: ' + esc(a && a.kind));
  }
  return f(a, ctx);
}

/* ── a whole problem ───────────────────────────────────────────── */
export function renderProblem(p, ctx = {}) {
  const box = div('pr');
  const head = div('pr-head');
  head.appendChild(div('pr-id', esc(p.pid || p.id || '')));
  if (p.kind) head.appendChild(div('pr-kind', esc(p.kind)));
  box.appendChild(head);
  const body = div('pr-body');
  renderBlocks(p.stem, body);
  if (p.answer) body.appendChild(renderAnswer(p.answer, ctx));
  box.appendChild(body);
  return box;
}
