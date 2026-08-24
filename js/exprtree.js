// exprtree.js — LaTeX arithmetic → expression tree.
//
// The order-of-operations tool cannot work on a string: you cannot point at
// part of a string, and you cannot replace it with its value. It needs a tree.
//
// Precedence lives in the SHAPE of the tree, not in a rules table. That matters
// downstream: the set of operations a learner may perform right now is exactly
// "every node whose arguments are already values", which falls out of the
// structure and therefore cannot disagree with the mathematics.
//
// Scope is deliberately the subset chapter 1 actually uses:
//   \frac \sqrt \cdot \div \left \right, ^ , unary -, parentheses, numbers.

/* ── tokenise ──────────────────────────────────────────────────── */
const TOK = /\s*(\\[a-zA-Z]+|\d+\.\d+|\d+|[()+\-*/^{}\[\]=·×÷])/y;

export function tokenize(src) {
  const out = [];
  let i = 0;
  while (i < src.length) {
    TOK.lastIndex = i;
    const m = TOK.exec(src);
    if (!m) {
      if (/\s/.test(src[i])) { i++; continue; }
      throw new Error(`unexpected character ${JSON.stringify(src[i])} at ${i}`);
    }
    i = TOK.lastIndex;
    const t = m[1];
    if (t === '\\left' || t === '\\right') continue;   // sizing only, no meaning
    out.push(t);
  }
  return out;
}

/* ── parse ─────────────────────────────────────────────────────── */
// expr   := term (('+'|'-') term)*
// term   := power (('\cdot'|'\div'|juxtaposition) power)*
// power  := unary ('^' power)?            right-associative
// unary  := '-'* primary
// primary:= number | group | \frac{}{} | \sqrt[]{}

const MUL = new Set(['\\cdot', '\\times', '*', '·', '×']);
const DIV = new Set(['\\div', '/', '÷']);

export function parse(src) {
  const ts = tokenize(src);
  let k = 0;
  const peek = () => ts[k];
  const eat = (t) => {
    if (ts[k] !== t) throw new Error(`expected ${t} but found ${ts[k] ?? 'end'}`);
    return ts[k++];
  };

  function group() {          // a braced or parenthesised sub-expression
    const open = peek();
    if (open === '{') { eat('{'); const e = expr(); eat('}'); return e; }
    if (open === '(') { eat('('); const e = expr(); eat(')'); return { t: 'paren', a: e }; }
    if (open === '[') { eat('['); const e = expr(); eat(']'); return { t: 'paren', a: e, sq: true }; }
    throw new Error(`expected a group but found ${open ?? 'end'}`);
  }

  function primary() {
    const t = peek();
    if (t === undefined) throw new Error('unexpected end of expression');
    if (t === '\\frac') {
      eat('\\frac');
      return { t: 'frac', a: group(), b: group() };
    }
    if (t === '\\sqrt') {
      eat('\\sqrt');
      let idx = null;
      if (peek() === '[') { eat('['); idx = expr(); eat(']'); }
      return { t: 'sqrt', idx, a: group() };
    }
    if (t === '(' || t === '{' || t === '[') return group();
    if (/^\d/.test(t)) { k++; return { t: 'num', v: parseFloat(t) }; }
    throw new Error(`cannot start an expression with ${t}`);
  }

  // Exponentiation binds TIGHTER than a leading minus: -9^{2} is -(9^{2}),
  // not (-9)^{2}. Getting this backwards is the "sticky sign" error the course
  // spends time on, and several problems print the minus outside the power
  // deliberately — so the parser must not quietly normalise it away.
  function unary() {
    if (peek() === '-') { eat('-'); return { t: 'neg', a: unary() }; }
    if (peek() === '+') { eat('+'); return unary(); }
    return power();
  }

  function power() {
    const base = primary();
    if (peek() === '^') { eat('^'); return { t: 'pow', a: base, b: unary() }; }
    return base;
  }

  function term() {
    let left = unary();
    for (;;) {
      const t = peek();
      if (MUL.has(t)) { k++; left = { t: 'mul', a: left, b: unary() }; continue; }
      if (DIV.has(t)) { k++; left = { t: 'div', a: left, b: unary() }; continue; }
      // juxtaposition: a number or group immediately following is a product
      if (t !== undefined && (t === '(' || t === '[' || t === '\\frac' || t === '\\sqrt' || /^\d/.test(t))) {
        left = { t: 'mul', a: left, b: unary(), implicit: true };
        continue;
      }
      return left;
    }
  }

  function expr() {
    let left = term();
    for (;;) {
      const t = peek();
      if (t === '+') { k++; left = { t: 'add', a: left, b: term() }; continue; }
      if (t === '-') { k++; left = { t: 'sub', a: left, b: term() }; continue; }
      return left;
    }
  }

  // an expression may be an identity: parse both sides
  const first = expr();
  if (peek() === '=') {
    k++;
    const second = expr();
    if (k !== ts.length) throw new Error(`trailing input at ${ts[k]}`);
    return withIds({ t: 'eq', a: first, b: second });
  }
  if (k !== ts.length) throw new Error(`trailing input at ${ts[k]}`);
  return withIds(first);
}


/* ── exact values ──────────────────────────────────────────────────
   This course is exact arithmetic. Showing a learner 0.037037 where the
   value is 1/27 is both wrong and unteachable: continuing from the printed
   number drifts. Values are therefore carried as rationals wherever they
   stay rational, and only fall back to a float when a root is genuinely
   irrational. */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; };

export function rat(n, d = 1) {
  if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return null;
  if (!Number.isInteger(n) || !Number.isInteger(d)) {          // a decimal literal
    const p = Math.max((String(n).split('.')[1] || '').length,
                       (String(d).split('.')[1] || '').length);
    const k = Math.pow(10, p);
    n = Math.round(n * k); d = Math.round(d * k);
  }
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}
const rAdd = (x, y) => (x && y) ? rat(x.n * y.d + y.n * x.d, x.d * y.d) : null;
const rSub = (x, y) => (x && y) ? rat(x.n * y.d - y.n * x.d, x.d * y.d) : null;
const rMul = (x, y) => (x && y) ? rat(x.n * y.n, x.d * y.d) : null;
const rDiv = (x, y) => (x && y && y.n !== 0) ? rat(x.n * y.d, x.d * y.n) : null;
function rPow(x, y) {
  if (!x || !y || y.d !== 1) return null;                      // fractional exponent: not rational in general
  const e = y.n;
  if (!Number.isInteger(e) || Math.abs(e) > 40) return null;
  const p = (b, k) => { let r = 1; for (let i = 0; i < k; i++) r *= b; return r; };
  return e >= 0 ? rat(p(x.n, e), p(x.d, e)) : rat(p(x.d, -e), p(x.n, -e));
}
function rRoot(x, k) {
  if (!x || !Number.isInteger(k) || k < 2) return null;
  const ex = (m) => { const r = Math.round(Math.pow(Math.abs(m), 1 / k)); return p2(r, k) === Math.abs(m) ? r : null; };
  const p2 = (b, e) => { let r = 1; for (let i = 0; i < e; i++) r *= b; return r; };
  const sn = ex(x.n), sd = ex(x.d);
  if (sn === null || sd === null) return null;                 // not a perfect root
  if (x.n < 0) { if (k % 2 === 0) return null; return rat(-sn, sd); }
  return rat(sn, sd);
}
export const ratVal = (q) => q ? q.n / q.d : null;

/** Exact value of a node, or null where it is genuinely irrational. */
export function exact(n) {
  switch (n.t) {
    case 'num':   return n.q !== undefined ? n.q : rat(n.v);
    case 'paren': return exact(n.a);
    case 'neg':   { const a = exact(n.a); return a ? rat(-a.n, a.d) : null; }
    case 'add':   return rAdd(exact(n.a), exact(n.b));
    case 'sub':   return rSub(exact(n.a), exact(n.b));
    case 'mul':   return rMul(exact(n.a), exact(n.b));
    case 'div':
    case 'frac':  return rDiv(exact(n.a), exact(n.b));
    case 'pow':   return rPow(exact(n.a), exact(n.b));
    case 'sqrt':  { const k = n.idx ? exact(n.idx) : rat(2);
                    return (k && k.d === 1) ? rRoot(exact(n.a), k.n) : null; }
    default: return null;
  }
}

/* ── stable identity ───────────────────────────────────────────────
   A reduction rebuilds the tree, so object identity cannot survive it. Every
   node therefore carries an id assigned once and kept through every copy.
   Without this a batch of clicks silently drops all but the first: the second
   target is compared against a tree that has already been rebuilt, matches
   nothing, and reduces nothing. */
let _id = 0;
export function withIds(n) {
  if (n.id === undefined) n.id = ++_id;
  for (const k of ['a', 'b', 'idx']) if (n[k]) withIds(n[k]);
  return n;
}

/** Reduce EVERY node whose id is in the set, in a single walk. */
export function reduceAll(root, idSet) {
  const walk = (n) => {
    if (idSet.has(n.id)) {
      const q = exact(n);
      return { t: 'num', v: q ? ratVal(q) : evaluate(n), q, id: ++_id, from: n.id };
    }
    const c = { ...n };                       // copy keeps c.id, so ids are stable
    for (const k of ['a', 'b', 'idx']) if (c[k]) c[k] = walk(c[k]);
    return c;
  };
  return walk(root);
}

/** Find a node by its stable id. */
export function byId(n, id) {
  if (n.id === id) return n;
  for (const k of ['a', 'b', 'idx']) {
    if (!n[k]) continue;
    const hit = byId(n[k], id);
    if (hit) return hit;
  }
  return null;
}

/* ── evaluate ──────────────────────────────────────────────────── */
export function evaluate(n) {
  switch (n.t) {
    case 'num':   return n.q ? ratVal(n.q) : n.v;
    case 'paren': return evaluate(n.a);
    case 'neg':   return -evaluate(n.a);
    case 'add':   return evaluate(n.a) + evaluate(n.b);
    case 'sub':   return evaluate(n.a) - evaluate(n.b);
    case 'mul':   return evaluate(n.a) * evaluate(n.b);
    case 'div':   return evaluate(n.a) / evaluate(n.b);
    case 'frac':  return evaluate(n.a) / evaluate(n.b);
    case 'pow':   return Math.pow(evaluate(n.a), evaluate(n.b));
    case 'sqrt': {
      const r = evaluate(n.a);
      const k = n.idx ? evaluate(n.idx) : 2;
      // an ODD root of a negative number is real; Math.pow returns NaN for it,
      // which would silently break the odd-root problems in 1.5
      const mag = Math.pow(Math.abs(r), 1 / k);
      // a root computed by logarithms lands a hair off an integer; snap it, or
      // a clean cube root shows the learner 3.9999999999999996
      const snapped = Math.abs(mag - Math.round(mag)) < 1e-9 ? Math.round(mag) : mag;
      if (r < 0) {
        if (Number.isInteger(k) && k % 2 === 1) return -snapped;   // odd root of a negative is real
        return NaN;                                                // even root of a negative is not
      }
      return snapped;
    }
    case 'eq':    return evaluate(n.a);
    default: throw new Error('cannot evaluate node type ' + n.t);
  }
}

/* ── the live set ──────────────────────────────────────────────── */
/** A node is a value when it needs no further work. */
export const isValue = (n) =>
  n.t === 'num' || (n.t === 'neg' && n.a.t === 'num');

/** Operations the learner may perform right now: every node whose arguments
 *  are already values. Independence within a level falls straight out — two
 *  powers on opposite sides of a sum are both ready, and neither waits for
 *  the other. This is the whole rule; there is no precedence table. */
export function ready(n, acc = []) {
  if (isValue(n)) return acc;
  const kids = ['a', 'b', 'idx'].map((k) => n[k]).filter(Boolean);
  kids.forEach((c) => ready(c, acc));
  if (n.t === 'paren') {
    if (isValue(n.a)) acc.push(n);            // a paren around a value just drops
    return acc;
  }
  // Only offer an operation whose result is EXACT. An irrational root reduced
  // to a decimal is both wrong for this course and unrecoverable: the learner
  // would continue from a rounded number. Radical simplification is a
  // different instrument, not this one.
  if (kids.length && kids.every(isValue) && exact(n)) acc.push(n);
  return acc;
}

/** Replace one node, by identity, with its computed value. */
export function reduceAt(root, target) {
  const val = evaluate(target);
  const walk = (n) => {
    if (n === target) return { t: 'num', v: val, from: target };
    const c = { ...n };
    for (const k of ['a', 'b', 'idx']) if (c[k]) c[k] = walk(c[k]);
    return c;
  };
  return walk(root);
}


/** The parent of a node, by id — needed to decide whether a value dropped into
 *  an existing rendering has to carry parentheses. */
export function parentOf(root, id, parent = null) {
  if (root.id === id) return parent;
  for (const k of ['a', 'b', 'idx']) {
    if (!root[k]) continue;
    const hit = parentOf(root[k], id, root);
    if (hit !== undefined && hit !== null) return hit;
    if (root[k].id === id) return root;
  }
  return null;
}

/** True when a value replacing this node, IN PLACE inside already-rendered
 *  markup, must be parenthesised. Phase A of the stepper swaps a node's
 *  contents without re-rendering its surroundings, so 4·√49 would otherwise
 *  become 4 next to 7 and read as forty-seven. */
export function needsWrapInPlace(root, node, value) {
  const p = parentOf(root, node.id);
  if (!p) return false;
  if (p.t === 'mul' && p.implicit) return true;      // juxtaposition: always
  if (value < 0 && (p.t === 'mul' || p.t === 'div' || p.t === 'pow')) return true;
  return false;
}

/* ── render back to LaTeX, with marks ──────────────────────────── */
const needsParens = (child, parent) =>
  child.t === 'paren' ||
  (parent === 'pow' && ['add', 'sub', 'mul', 'div', 'neg'].includes(child.t));

/** @param {object} n  @param {Map} marks  node -> css class */
export function toTex(n, marks) {
  const wrap = (s) => {
    const cls = marks && marks.get(n);
    return cls ? `\\htmlClass{${cls}}{${s}}` : s;
  };
  const sub = (c, parent) => {
    const s = toTex(c, marks);
    return needsParens(c, parent) && c.t !== 'paren' ? `\\left(${s}\\right)` : s;
  };
  switch (n.t) {
    case 'num':   return wrap(n.q && n.q.d !== 1
                    ? `\\frac{${n.q.n}}{${n.q.d}}` : fmt(n.q ? n.q.n : n.v));
    case 'paren': return wrap(n.sq ? `\\left[${toTex(n.a, marks)}\\right]`
                                   : `\\left(${toTex(n.a, marks)}\\right)`);
    case 'neg':   return wrap(`-${sub(n.a, 'neg')}`);
    case 'add':   return wrap(`${toTex(n.a, marks)}+${toTex(n.b, marks)}`);
    case 'sub':   return wrap(`${toTex(n.a, marks)}-${toTex(n.b, marks)}`);
    case 'mul': {
      const L = sub(n.a, 'mul'), Rr = sub(n.b, 'mul');
      // juxtaposition is only safe when the right side cannot merge into the
      // left as digits — otherwise restore the parentheses the source had
      const merges = /[\d.]$/.test(L) && /^[-\d.]/.test(Rr);
      if (n.implicit) return wrap(merges ? `${L}\\left(${Rr}\\right)` : `${L}${Rr}`);
      return wrap(`${L}\\cdot ${Rr}`);
    }
    case 'div':   return wrap(`${sub(n.a, 'div')}\\div ${sub(n.b, 'div')}`);
    case 'frac':  return wrap(`\\frac{${toTex(n.a, marks)}}{${toTex(n.b, marks)}}`);
    case 'pow':   return wrap(`${sub(n.a, 'pow')}^{${toTex(n.b, marks)}}`);
    case 'sqrt':  return wrap(n.idx ? `\\sqrt[${toTex(n.idx, marks)}]{${toTex(n.a, marks)}}`
                                    : `\\sqrt{${toTex(n.a, marks)}}`);
    case 'eq':    return `${toTex(n.a, marks)}=${toTex(n.b, marks)}`;
    default: return '?';
  }
}

export function fmt(v) {
  if (!Number.isFinite(v)) return String(v);
  if (Number.isInteger(v)) return String(v);
  const r = Math.round(v * 1e6) / 1e6;
  return String(r);
}

/** What kind of act a node represents — used to key a tip to the operation
 *  rather than to the problem, so one note serves every problem using it. */
export function opKind(n) {
  if (n.t === 'pow') {
    const b = n.a, e = n.b;
    const neg = b.t === 'neg' || (b.t === 'paren' && b.a.t === 'neg');
    const even = e.t === 'num' && e.v % 2 === 0;
    if (neg && even) return 'pow.negative-base-even';
    if (neg) return 'pow.negative-base-odd';
    return 'pow.plain';
  }
  if (n.t === 'sqrt') return n.idx ? 'sqrt.indexed' : 'sqrt.square';
  if (n.t === 'frac') return 'frac.divide';
  if (n.t === 'paren') return 'paren.drop';
  if (n.t === 'sub' || n.t === 'add') {
    const negRight = n.b.t === 'neg' || (n.b.t === 'num' && n.b.v < 0);
    if (negRight) return n.t + '.negative-operand';
    return n.t + '.plain';
  }
  return n.t + '.plain';
}
