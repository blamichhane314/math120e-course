// solve.js — plays back an AUTHORED solution. Nothing is derived.
//
// Each step is a complete expression, written out by hand, with the clickable
// pieces marked. Each mark says what it becomes. The next step is likewise
// written out in full. The tool therefore cannot disagree with the author,
// because it computes nothing — it substitutes and advances.
//
// Authoring format, per problem:
//
//   { "steps": [
//       { "tex": "\\frac{\\C{a}{8^{2}}-\\C{b}{(4)}\\C{c}{\\sqrt{49}}}{...}",
//         "clicks": {
//           "a": { "to": "64", "kind": "pow.plain" },
//           "b": { "to": "4",  "kind": "paren.drop" },
//           "c": { "to": "7",  "kind": "sqrt.square" } } },
//       { "tex": "…the whole expression as it stands after that level…",
//         "clicks": { … } },
//       { "tex": "4", "clicks": {} }          ← final line, nothing to click
//     ] }
//
// \C{id}{content} marks a clickable piece. Everything at one level is marked
// in the same step and ALL of it must be cleared before the step advances,
// because those operations are independent.

const KATEX = {
  throwOnError: false, displayMode: true, output: 'html',
  trust: true, strict: false,
  macros: { '\\C': '\\htmlClass{oo-c oo-c-#1}{#2}' },
};

export const TIPS = {
  'pow.plain':            'A power is repeated multiplication of the base. The exponent counts the factors; it does not multiply.',
  'pow.negative-base':    'The minus was inside the parentheses, so it belongs to the base and every factor carries it.',
  'pow.minus-outside':    'The minus sits outside the power, so the power is taken first and the result is then negated.',
  'sqrt.square':          'A square root asks which number multiplied by itself gives this.',
  'sqrt.indexed':         'The index says how many equal factors. An odd index accepts a negative radicand; an even one does not.',
  'paren.drop':           'Once what is inside is a single number, the parentheses have no work left.',
  'mul.plain':            'Multiplication and division rank together and are taken left to right.',
  'mul.implicit':         'Two quantities written side by side are multiplied.',
  'div.plain':            'Division ranks with multiplication, not below it.',
  'frac.divide':          'A fraction bar divides, and it also groups: everything above it settles before the division.',
  'frac.negative':        'A negative divided by a negative is positive.',
  'add.plain':            'Addition and subtraction rank last and are taken left to right.',
  'sub.plain':            'Addition and subtraction rank last and are taken left to right.',
  'sub.negative':         'Subtracting a negative adds. Watch which minus is the operation and which belongs to the number.',
  'add.fractions':        'Like denominators add straight across the top.',
};

export function mountSolve(host, solution, opts = {}) {
  const steps = (solution && solution.steps) || [];
  if (!steps.length) { host.innerHTML = '<div class="oo-fail">no authored solution for this problem</div>'; return null; }

  let i = 0;                       // current step
  let done = new Set();            // marks cleared in this step
  const kept = [];

  const stage = document.createElement('div'); stage.className = 'oo-stage';
  const bar   = document.createElement('div'); bar.className = 'oo-bar';
  const expr  = document.createElement('div'); expr.className = 'oo-expr';
  const side  = document.createElement('div'); side.className = 'oo-side';
  stage.append(bar, expr, side);
  host.innerHTML = ''; host.append(stage);

  const clicksOf = (n) => Object.keys(steps[n].clicks || {});

  function draw() {
    done = new Set();
    expr.innerHTML = window.katex.renderToString(steps[i].tex, KATEX);
    const ids = clicksOf(i);
    expr.querySelectorAll('.oo-c').forEach((el) => {
      const id = [...el.classList].map((c) => /^oo-c-(.+)$/.exec(c)).find(Boolean);
      if (id && ids.includes(id[1])) el.classList.add('oo-live');
    });
    tally();
  }

  function tally() {
    const n = clicksOf(i).length;
    bar.textContent = n
      ? `step ${i + 1} of ${steps.length - 1} · ${done.size} of ${n} cleared`
      : `finished · ${steps.length - 1} steps`;
  }

  expr.addEventListener('click', (e) => {
    const el = e.target.closest('.oo-c');
    if (!el) return;
    const hit = [...el.classList].map((c) => /^oo-c-(.+)$/.exec(c)).find(Boolean);
    if (!hit) return;
    const id = hit[1];
    const spec = (steps[i].clicks || {})[id];

    if (!spec) {                     // not part of this level — refuse, visibly
      el.classList.add('oo-refuse');
      setTimeout(() => el.classList.remove('oo-refuse'), 320);
      return;
    }
    if (done.has(id)) return;

    done.add(id);
    el.classList.remove('oo-live');
    el.classList.add('oo-cleared', 'oo-just');
    el.innerHTML = window.katex.renderToString(spec.to, { ...KATEX, displayMode: false });
    showTip(spec);
    tally();

    if (done.size === clicksOf(i).length) {
      setTimeout(() => {             // the level closes; the re-flow says so
        i++;
        expr.classList.add('oo-reflow');
        draw();
        setTimeout(() => expr.classList.remove('oo-reflow'), 360);
        if (!clicksOf(i).length) finish();
      }, 420);
    }
  });

  function showTip(spec) {
    const text = spec.tip || TIPS[spec.kind];
    if (!text) { side.innerHTML = ''; return; }
    side.innerHTML =
      '<div class="oo-tip"><span class="oo-kind">' +
      String(spec.kind || '').replace(/[.-]/g, ' ') + '</span><p>' + text +
      '</p><button class="oo-keep">keep this note</button></div>';
    side.querySelector('.oo-keep').onclick = (ev) => {
      if (kept.includes(spec.kind)) return;
      kept.push(spec.kind);
      ev.target.textContent = 'kept'; ev.target.disabled = true;
      opts.onNote && opts.onNote({ kind: spec.kind, text });
    };
  }

  function finish() {
    side.innerHTML = '<div class="oo-tip"><span class="oo-kind">done</span><p>' +
      (steps.length - 1) + ' steps, ' + kept.length + ' note' +
      (kept.length === 1 ? '' : 's') + ' kept.</p></div>';
    opts.onFinish && opts.onFinish({ steps: steps.length - 1, kept });
  }

  draw();
  return { reset: () => { i = 0; draw(); } };
}
