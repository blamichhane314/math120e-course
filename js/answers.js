// answers.js — the interaction half. One renderer per way a problem can be
// answered, all sharing a single contract so a problem's shape is data.
//
// Counts across the 524-problem corpus that drove this list:
//   compute 219 · choice(text) 116 · multipart 87 · fill 79 · choice(figure) 14
// The unglamorous ones carry the course: fill + multipart is 166 problems,
// four times every figure combined.
//
// Nothing here grades. An answer component collects a response and reports it;
// what is correct lives with the content, and checking is a separate concern so
// the same component can be used for practice, for a quiz, or for a worked
// example with the response pre-filled.

import { renderBlocks, tex, inline, hasMath } from './blocks.js?v=1';

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const div = (cls, html) => { const d = document.createElement('div'); d.className = cls; if (html != null) d.innerHTML = html; return d; };

let uid = 0;
const nextId = () => 'a' + (++uid);

/** Render a template string carrying ⟨n⟩ markers into a line, substituting the
 *  matching slot. Shared by fill, select, and options that contain a box —
 *  the publisher freely mixes an input INTO a choice ("A. x²+5x+6 = ▭ /
 *  B. not factorable"), so a slot has to be placeable anywhere prose is. */
function templateInto(line, template, slots, ctx, asSelect = false) {
  String(template ?? '').split(/(⟨\d+⟩)/).forEach((p) => {
    const m = /^⟨(\d+)⟩$/.exec(p);
    if (m) {
      const s = (slots || [])[+m[1]] || {};
      const id = s.id ?? +m[1];
      line.appendChild(asSelect || s.options ? SelectSlot({ ...s, id }, ctx)
                                             : Slot({ ...s, id }, ctx.onChange));
    } else if (p) {
      const span = document.createElement('span');
      span.innerHTML = inline(p);
      line.appendChild(span);
    }
  });
  return line;
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
// template carries ⟨0⟩ ⟨1⟩ … markers; the sentence is the question, so the
// slot must sit in the prose rather than under it.
export function Fill(a, ctx) {
  const box = div('a-fill');
  box.appendChild(templateInto(div('a-line a-prose'), a.template || '⟨0⟩', a.slots, ctx));
  if (a.note) box.appendChild(div('a-note', inline(a.note)));
  return box;
}

/* ── select: a choice made inside a sentence ───────────────────── */
// distinct from a real MCQ — it is a word chosen mid-clause, and it reads
// wrongly if promoted to a lettered option list.
export function Select(a, ctx) {
  const box = div('a-fill');
  box.appendChild(templateInto(div('a-line a-prose'), a.template || '⟨0⟩', a.slots, ctx, true));
  if (a.note) box.appendChild(div('a-note', inline(a.note)));
  return box;
}

/* ── choice: options that are text, math, or whole figures ─────── */
// An option is a block list, so a figure option costs nothing extra — the
// same renderer draws it. Figure options are laid out as a grid, text as rows.
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
    // itself contains an input box — the publisher mixes the two freely
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
