/* §1.2 — the page. Question flow, checkpoints, and the plant's state.
   Nothing is scored and nothing is stored; the plant is rebuilt from the
   answers each time it is drawn. */

import { drawPlant, drawSky, drawLand, shelfFig } from './powers.js?v=42';

const M = (s) => String(s).replace(/`([^`]+)`/g, (_, e) =>
  '<span class=x>' + e
    .replace(/\*/g, '&middot;')
    .replace(/x/g, '<i>x</i>')
    .replace(/\^\(([^)]+)\)/g, '<sup>$1</sup>')
    .replace(/\^(-?\d+)/g, '<sup>$1</sup>')
    /* in mathematics a hyphen is a minus sign, never a dash */
    .replace(/-/g, '&minus;')
  + '</span>');

export function mountPowers(D) {
  const SETS = D.sets, IDEAS = D.ideas;
  const ALL = SETS.flatMap(s => s.questions);

  /* options are authored correct-first; shuffle once so the answer is not
     always A, and so a stored index stays valid for the session */
  for (const q of ALL) {
    if (!q.opts) continue;                 /* factor questions have no options */
    for (let i = q.opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [q.opts[i], q.opts[j]] = [q.opts[j], q.opts[i]];
    }
  }

  const answers = {}, revealed = new Set();
  const stage = document.getElementById('stage');
  const svg   = document.getElementById('plant');

  const tipEl = document.getElementById('tip');
  const setOf = q => SETS.findIndex(s => s.questions.includes(q));
  const right = q => q.kind === 'factor'
    ? (answers[q.id] || []).slice().sort().join('|') === shared(q).slice().sort().join('|')
    : !!(q.opts[answers[q.id]] && q.opts[answers[q.id]].ok);
  let view = { kind:'intro' }, lit = null;

  /* Scene themes sit on the field, independent of the site theme, so the
     landscape can be day, dusk, night or meadow whatever palette the site
     is wearing. Each brings its own creatures: birds, bees or fireflies. */
  const SCENES = ['day', 'dusk', 'night', 'meadow'];
  const field = document.querySelector('.field');
  /* Two of the four are the reader's to pick. The choice is remembered the
     same way the site theme is, so it holds across both pages and visits. */
  const PICKABLE = ['dusk', 'night'];
  const held = (() => { try { return localStorage.getItem('m120.scene'); }
                        catch (_) { return null; } })();
  let scene = PICKABLE.includes(held) ? held : 'dusk';
  /* which section we are in, so dusk can deepen as the work goes on */
  const stageNow = () => view.kind === 'report' ? SETS.length - 1
                       : view.kind === 'intro'  ? 0
                       : (view.set || 0);
  function paintScene() {
    /* the scene dresses the whole window, so the root carries it too */
    const root = document.documentElement;
    field.dataset.scene = root.dataset.scene = scene;
    field.dataset.stage = root.dataset.stage = stageNow();
    drawSky(document.getElementById('sky'), scene, stageNow());
    drawLand(document.getElementById('land'), stageNow());
    for (const b of field.querySelectorAll('.skybar button'))
      b.setAttribute('aria-current', b.dataset.pick === scene ? 'true' : 'false');
  }

  (function skybar() {
    const bar = document.createElement('div');
    bar.className = 'skybar';
    bar.innerHTML = PICKABLE.map(s =>
      '<button type=button data-pick="' + s + '">' + s + '</button>').join('');
    bar.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      scene = b.dataset.pick;
      try { localStorage.setItem('m120.scene', scene); } catch (_) {}
      paintScene();
    });
    field.appendChild(bar);
  })();

  /* Teacher mode. Opened with #teacher in the URL, the same way the
     diagnostic marks a device with #test, so students never meet it.
     Jumps into any set, any checkpoint, or the report, and can fill the
     answers so the plant and the report can be seen without playing
     twenty-five questions. */
  const TEACHER = /(^|[#&])teacher\b/.test(location.hash);
  let showAspects = false;   /* teacher toggle: force every aspect open */
  let asStudent   = false;   /* teacher previewing exactly what a student sees */
  /* the instructor's own view — off while previewing as a student */
  const eye = () => TEACHER && !asStudent;

  /* A question is a door, not a hurdle: the aspects are always available,
     never required, and read the same whether the answer was right or wrong. */
  function aspectsHTML(q) {
    if (!q.aspects || !q.aspects.length) {
      return eye() ? '<div class=nolens>no aspects authored</div>' : '';
    }
    if (showAspects && eye()) {
      return '<div class="asp open">' + q.aspects.map(a =>
        '<div class=ab><span class=al>' + a.lens + '</span>' + a.body + '</div>').join('') + '</div>';
    }
    return '<div class=asp>' +
      '<div class=arow>' + q.aspects.map((a, i) =>
        '<button class=ac data-a=' + i + '>' + a.lens + '</button>').join('') + '</div>' +
      '<div class=abody hidden></div></div>';
  }

  function wireAspects(q, root) {
    const bodyEl = root.querySelector('.abody');
    root.querySelectorAll('.ac').forEach(b => {
      b.onclick = () => {
        const a = q.aspects[+b.dataset.a];
        const on = b.classList.contains('lit');
        root.querySelectorAll('.ac').forEach(x => x.classList.remove('lit'));
        if (on) { bodyEl.hidden = true; return; }
        b.classList.add('lit');
        bodyEl.innerHTML = M(a.body);
        bodyEl.hidden = false;
      };
    });
  }

  function fill(mode, upto) {
    const end = upto === undefined ? SETS.length : upto + 1;
    Object.keys(answers).forEach(k => delete answers[k]);
    Object.keys(expanded).forEach(k => delete expanded[k]);
    revealed.clear();
    if (mode === 'none') return;
    let n = 0;
    for (let si = 0; si < end; si++) {
      for (const q of SETS[si].questions) {
        const ok = q.opts ? q.opts.findIndex(o => o.ok) : 0;
        const no = q.opts ? q.opts.findIndex(o => !o.ok) : 0;
        if (q.kind === 'factor') {
          expanded[q.id] = q.terms.map(() => true);
          const full = shared(q);
          answers[q.id] = mode === 'right' ? full
                        : mode === 'wrong' ? []
                        : (n % 3 === 1 ? full.slice(0, -1) : full);
        } else {
          answers[q.id] = mode === 'right' ? ok
                        : mode === 'wrong' ? no
                        : (n % 3 === 1 ? no : ok);
        }
        n++;
      }
      revealed.add(si);
    }
  }

  function teacherBar() {
    if (!TEACHER) return;
    const bar = document.createElement('div');
    bar.className = 'tbar';
    bar.innerHTML =
      '<button class=tview data-view=1 id=tview>view: teacher</button>' +
      '<span class=tsep></span>' +
      SETS.map((st, i) => '<button data-go=' + i + '>' + (i + 1) + ' ' + st.name + '</button>').join('') +
      '<span class=tsep></span>' +
      SETS.map((st, i) => '<button data-cp=' + i + '>&#9633;' + (i + 1) + '</button>').join('') +
      '<button data-rep=1>report</button>' +
      '<span class=tsep></span>' +
      '<button data-fill=right>all right</button>' +
      '<button data-fill=wrong>all wrong</button>' +
      '<button data-fill=mixed>mixed</button>' +
      '<button data-fill=none>clear</button>' +
      '<span class=tsep></span>' +
      '<button data-asp=1 id=taspect>aspects: off</button>' +
      '<button data-scene=1 id=tscene>scene: ' + scene + '</button>';
    document.querySelector('#doc .field').before(bar);

    bar.onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      const d = b.dataset;
      if (d.view) {
        asStudent = !asStudent;
        b.textContent = 'view: ' + (asStudent ? 'student' : 'teacher');
        b.classList.toggle('lit', asStudent);
        bar.classList.toggle('mini', asStudent);
        render(); return;
      }
      if (d.go !== undefined)  { fill('mixed', +d.go - 1); view = {kind:'question', set:+d.go, i:0}; }
      else if (d.cp !== undefined) { fill('mixed', +d.cp); view = {kind:'checkpoint', set:+d.cp}; }
      else if (d.rep)          { fill('mixed'); view = {kind:'report'}; }
      else if (d.scene) {
        scene = SCENES[(SCENES.indexOf(scene) + 1) % SCENES.length];
        b.textContent = 'scene: ' + scene;
        paintScene(); return;
      }
      else if (d.asp)          { showAspects = !showAspects;
                                 b.textContent = 'aspects: ' + (showAspects ? 'on' : 'off');
                                 b.classList.toggle('lit', showAspects); }
      else if (d.fill)         { fill(d.fill); view = d.fill === 'none'
                                   ? {kind:'question', set:0, i:0} : {kind:'report'}; }
      lit = null; tipEl.innerHTML = '';
      render();
    };
  }


  /* ── the factoring widget ──────────────────────────────────────────
     One mechanic for the whole chain in §1.3 objective 1: a term is written
     out as the factors it is made of, and a factor can be taken out only if
     EVERY term has one. What is shared changes — an x, then a number and an
     x, then a whole bracket — but the operation never does. */
  const expanded = {};

  const chipHTML = (c, cls, val) =>
    '<span class="fxx' + (cls ? ' ' + cls : '') + '" data-c="' + (val === undefined ? c : val) + '">' +
    (/^[a-z]$/.test(c) ? '<i>' + c + '</i>'
     : c.startsWith('-') && c.length > 1 ? '&minus;' + c.slice(1) : c) + '</span>';

  const shared = q => {
    /* the factors every term has, counted with multiplicity */
    let out = [...q.terms[0].chips];
    for (const t of q.terms.slice(1)) {
      const pool = [...t.chips], keep = [];
      for (const c of out) { const i = pool.indexOf(c); if (i > -1) { pool.splice(i,1); keep.push(c); } }
      out = keep;
    }
    return out;
  };
  const remaining = (t, pulled) => {
    const left = [...t.chips];
    for (const c of pulled) { const i = left.indexOf(c); if (i > -1) left.splice(i,1); }
    return left;
  };

  /* Every state is rendered as a chain of lines, so the earlier steps stay on
     screen the way a worked example keeps its working. Only the last line is
     live. Nothing is ever removed: a factor that appears in every term is
     written ONCE, out front — the distributive property read right to left. */
  /* Written-out factors are for finding what is shared. Once nothing more is
     shared, they are collected back up — x &middot; x becomes x squared, and
     2 &middot; 2 becomes 4 — so the last line is the form a student writes. */
  function tidy(chips) {
    let num = 1, pow = {}, rest = [];
    for (const c of chips) {
      if (/^-?\d+$/.test(c)) num *= parseInt(c, 10);
      else if (/^[a-z]$/.test(c)) pow[c] = (pow[c] || 0) + 1;
      else rest.push(c);
    }
    let out = '';
    if (num === -1) out = '&minus;';
    else if (num !== 1) out = num < 0 ? '&minus;' + Math.abs(num) : String(num);
    for (const k of Object.keys(pow).sort())
      out += pow[k] === 1 ? '`' + k + '`' : '`' + k + '^' + pow[k] + '`';
    out += rest.join('');
    return out || '1';
  }
  const signedJoin = parts => parts.reduce((acc, p, i) =>
    i === 0 ? p : acc + (p.startsWith('&minus;') ? ' &minus; ' + p.slice(7)
                       : p.startsWith('-')       ? ' &minus; ' + p.slice(1)
                       : ' + ' + p), '');

  function tidyLine(q, pulled) {
    const inside = q.terms.map(t => tidy(remaining(t, pulled)));
    return '<span class=fxpull>' + M(tidy(pulled)) + '</span>' +
           '<span class="fxgrp brk">' + M(signedJoin(inside)) + '</span>';
  }

  /* a leading minus belongs to the join, not to the chip: the line reads
     "A &minus; B", never "A + -B" */
  const bare = c => c.startsWith('-') && c.length > 1 ? c.slice(1) : c;

  /* Once the minus has been written out front it is no longer inside the
     bracket, so a term's sign is read from the factors it still has, not
     from the sign it started with. */
  const negNow = (t, pulled) => remaining(t, pulled)
    .filter(c => c.startsWith('-') && c.length > 1).length % 2 === 1;

  function termHTML(t, pulled, live, canPull, moving) {
    const left = remaining(t, pulled);
    if (!left.length) return '<span class="fxterm done"><span class=fxone>1</span></span>';
    let flagged = false;
    return '<span class=fxterm>' + left.map((c, i) => {
      let cls = live && canPull(c) ? 'live' : '';
      /* mark the one chip in each term that is about to be written once, so
         the eye can follow it from this line to the next */
      if (!flagged && moving && c === moving) { cls += ' moving'; flagged = true; }
      const shown = (i === 0 && negNow(t, pulled)) ? bare(c) : c;
      return chipHTML(shown, cls.trim(), c);
    }).join('<span class=fxdot>&middot;</span>') + '</span>';
  }

  function lineHTML(q, pulled, live, moving) {
    const canPull = c => q.terms.every(t => remaining(t, pulled).includes(c));
    const inner = q.terms.map((t, i) => {
      const neg = negNow(t, pulled);
      return (i === 0
        ? (neg ? '<span class="fxplus lead">&minus;</span>' : '')
        : '<span class=fxplus>' + (neg ? '&minus;' : '+') + '</span>') +
        termHTML(t, pulled, live, canPull, moving);
    }).join('');
    const front = pulled.length
      ? '<span class=fxpull>' + pulled.map(c => chipHTML(c)).join('<span class=fxdot>&middot;</span>') + '</span>'
      : '';
    /* a drawn bracket, tall enough to visibly enclose both terms */
    return front + '<span class="fxgrp' + (pulled.length ? ' brk' : '') + '">' + inner + '</span>';
  }

  function factorHTML(q) {
    const pulled = answers[q.id] || [];
    const open = expanded[q.id] || [];
    const anyOpen = q.terms.some((_, i) => open[i]);
    const allOpen = q.terms.every((_, i) => open[i]);
    const rows = [];

    /* Each term is written out on its own click. The working line shows the
       terms already written out as factors and the rest as they stand, so a
       click has a visible effect on exactly the term that was clicked. */
    const sep = (t, i) => i === 0
      ? (t.neg ? '<span class="fxplus lead">&minus;</span>' : '')
      : '<span class=fxplus>' + (t.neg ? '&minus;' : '+') + '</span>';

    /* line 1 is always the expression as it was given, so it stays there to
       refer back to; the working line below it is what changes */
    rows.push('<div class="fxstep' + (anyOpen ? '' : ' now') + '">' +
      q.terms.map((t, i) => sep(t, i) +
        '<span class="fxterm' + (anyOpen ? '' : ' shut') + '"' +
        (anyOpen ? '' : ' data-t=' + i) + '>' + t.show + '</span>').join('') + '</div>');

    if (anyOpen && !allOpen)
      rows.push('<div class="fxstep now"><span class=fxeq>=</span>' +
        q.terms.map((t, i) => sep(t, i) + (open[i]
          ? termHTML(t, [], false, () => false, null)
          : '<span class="fxterm shut" data-t=' + i + '>' + t.show + '</span>')).join('') +
        '</div>');

    if (allOpen) {
      for (let k = 0; k <= pulled.length; k++)
        rows.push('<div class="fxstep' + (k === pulled.length ? ' now' : '') + '">' +
          '<span class=fxeq>=</span>' +
          lineHTML(q, pulled.slice(0, k), k === pulled.length, pulled[k]) + '</div>');
      if (pulled.length) {
        const more = q.terms[0].chips.some(c =>
          q.terms.every(t => remaining(t, pulled).includes(c)));
        if (!more) rows.push('<div class="fxstep tidy now"><span class=fxeq>=</span>' +
                             tidyLine(q, pulled) + '</div>');
      }
    }

    return '<div class=fx><div class=fxsteps>' + rows.join('') + '</div>' +
      (allOpen
        ? '<div class=fxbtns><button class=fxb data-back=1' + (pulled.length ? '' : ' disabled') +
          '>write it in each again</button></div>' +
          '<div class=fxhint>a factor that appears in every term can be written once, out front</div>'
        : '<div class=fxhint>click a term to write it out as factors</div>') +
      '</div>';
  }

  function wireFactor(q) {
    const host = document.getElementById('fxslot');
    host.innerHTML = M(factorHTML(q));
    host.querySelectorAll('.fxterm.shut').forEach(el => {
      /* one click writes the whole line out; opening terms one at a time was
         busywork, not a step in the mathematics */
      el.onclick = () => {
        (expanded[q.id] ||= [])[+el.dataset.t] = true;
        if (q.terms.every((_, i) => expanded[q.id][i])) answers[q.id] ||= [];
        wireFactor(q); refresh(q);
      };
    });
    host.querySelectorAll('.fxstep.now .fxx.live').forEach(el => {
      el.onclick = () => { (answers[q.id] ||= []).push(el.dataset.c); wireFactor(q); refresh(q); };
    });
    const k = host.querySelector('[data-back]');
    if (k) k.onclick = () => { (answers[q.id] || []).pop(); wireFactor(q); refresh(q); };
  }

  function refresh(q) {
    const n = document.getElementById('next');
    if (n) n.disabled = answers[q.id] === undefined;
    lit = ALL.filter(x => answers[x.id] !== undefined).indexOf(q);
    plant();
  }

  /* ── the plant ─────────────────────────────────────────────── */
  function plant() {
    const done = ALL.filter(q => answers[q.id] !== undefined);
    const marks = done.map(q =>
      revealed.has(setOf(q)) ? (right(q) ? 'held' : 'missed') : null);
    drawPlant(svg, { answered: done.length, marks });
    svg.querySelectorAll('.leaf').forEach(g => {
      const i = +g.dataset.i;
      if (i === lit) g.classList.add('on');
      g.onclick = () => showLeaf(i);
      g.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showLeaf(i); } };
    });
  }

  function showLeaf(i) {
    const q = ALL.filter(x => answers[x.id] !== undefined)[i];
    if (!q) return;
    lit = i;
    const shown = revealed.has(setOf(q));
    const chosen = q.opts[answers[q.id]];
    tipEl.innerHTML =
      '<div class=k>leaf ' + (i + 1) + ' &middot; ' + IDEAS[q.idea] + '</div>' +
      '<div class=s>' + M(q.stem) + '</div>' +
      (shown
        ? '<div class="v' + (right(q) ? '' : ' bad') + '">' +
          (right(q) ? 'you answered ' : 'you answered ') + M(chosen.t) + '</div>'
        : '<div class=v>answer shown at the end of this set</div>');
    plant();
  }

  /* ── screens ───────────────────────────────────────────────── */
  function render() {
    ({ intro, question, checkpoint, report })[view.kind]();
    paintScene();
    plant();
  }

  function intro() {
    stage.innerHTML = M(
      '<div class=bar><span></span><button class=go id=go>Begin</button></div>');
    document.getElementById('go').onclick = () => { view = {kind:'question',set:0,i:0}; render(); };
  }

  function question() {
    const set = SETS[view.set], q = set.questions[view.i];
    const last = view.i === set.questions.length - 1;
    stage.innerHTML = M(
      (q.fig ? '<div class=qwrap>' : '') +
      '<div class=qcol><div class=q>' + q.stem + '</div>' +
      (q.kind === 'factor'
        ? '<div id=fxslot></div>'
        : '<div class=opts role=group>' +
          q.opts.map((o, i) => '<button class=opt data-i=' + i +
            ' aria-pressed=' + (answers[q.id] === i) + '>' + o.t + '</button>').join('') +
          '</div>') +
      '</div></div>' +
      (q.fig ? '<svg class=fig id=qfig aria-hidden=true></svg></div>' : '') +
      '<div id=aspslot></div>' +
      '<div class=bar><span class=count>' + set.name + ' &middot; ' +
      (view.i + 1) + ' of ' + set.questions.length + '</span>' +
      '<button class=go id=next' + (answers[q.id] === undefined ? ' disabled' : '') + '>' +
      (last ? 'See the answers' : 'Next') + '</button></div>');

    if (q.kind === 'factor') wireFactor(q);
    stage.querySelectorAll('.opt').forEach(b => {
      b.onclick = () => {
        answers[q.id] = +b.dataset.i;
        stage.querySelectorAll('.opt').forEach(o => o.setAttribute('aria-pressed', o === b));
        document.getElementById('next').disabled = false;
        lit = ALL.filter(x => answers[x.id] !== undefined).indexOf(q);
        paint();
        plant();
      };
    });
    /* Aspects open only after the student has committed to an answer, and
       they say nothing about whether it was the right one. Answering earns
       the depth; it never works as a hint. */
    if (q.fig) shelfFig(document.getElementById('qfig'), q.fig.rows, q.fig.cols, q.fig.unknown);
    const slot = document.getElementById('aspslot');
    const paint = () => {
      slot.innerHTML = M(aspectsHTML(q));
      if (!(showAspects && eye())) wireAspects(q, slot);
    };
    /* the gate is for students; the teacher audit needs them regardless */
    if ((showAspects && eye()) || answers[q.id] !== undefined) paint();

    document.getElementById('next').onclick = () => {
      view = last ? {kind:'checkpoint', set:view.set}
                  : {kind:'question', set:view.set, i:view.i + 1};
      render();
    };
  }

  function checkpoint() {
    revealed.add(view.set);
    const set = SETS[view.set], last = view.set === SETS.length - 1;
    stage.innerHTML = M(
      set.questions.map(q => {
        if (q.kind === 'factor') {
          const took = answers[q.id] || [];
          return '<div class=item><div class=stem>' + q.stem + '</div>' +
            '<dl class=ln><dt>answer</dt><dd>' + q.answer + '</dd></dl>' +
            (right(q) ? '' :
              '<dl class="ln miss"><dt>you took out</dt><dd>' +
              (took.length ? took.join(' &middot; ') : 'nothing') + '</dd></dl>' +
              '<div class=why>' + q.work.why + '</div>') + '</div>';
        }
        const chosen = q.opts[answers[q.id]], key = q.opts.find(o => o.ok);
        return '<div class="item' + (q.fig ? ' haswrap' : '') + '">' +
          (q.fig ? '<svg class="fig sm" data-fig=' + q.fig.rows + '-' + q.fig.cols + (q.fig.unknown ? '-u' : '') + ' aria-hidden=true></svg>' : '') +
          '<div class=stem>' + q.stem + '</div>' +
          '<dl class=ln><dt>answer</dt><dd>' + key.t + '</dd></dl>' +
          (chosen && !chosen.ok
            ? '<dl class="ln miss"><dt>you chose</dt><dd>' + chosen.t + '</dd></dl>' +
              '<div class=why>' + (chosen.d || '') + '</div>'
            : '') + aspectsHTML(q) + '</div>';
      }).join('') +
      '<div class=bar><span></span><button class=go id=on>' +
      (last ? 'Finish' : 'Next set') + '</button></div>');
    stage.querySelectorAll('[data-fig]').forEach(el => {
      const [r, c, u] = el.dataset.fig.split('-'); shelfFig(el, +r, +c, u === 'u');
    });
    if (!(showAspects && eye())) set.questions.forEach((q, i) =>
      wireAspects(q, stage.querySelectorAll('.item')[i]));
    document.getElementById('on').onclick = () => {
      view = last ? {kind:'report'} : {kind:'question', set:view.set + 1, i:0};
      render();
    };
  }

  function report() {
    /* Two lists, no score: what to go back to, and what held. A topic with a
       single question is flagged as such — one answer is not evidence, and
       roughly one wrong answer in six is a slip rather than a misconception. */
    const tally = {};
    for (const q of ALL) {
      const t = tally[q.idea] || (tally[q.idea] = {asked:0, missed:[], ok:0});
      t.asked++;
      if (right(q)) t.ok++; else t.missed.push(q);
    }
    const shaky = Object.keys(tally).filter(k => tally[k].missed.length)
                        .sort((a,b) => tally[b].missed.length - tally[a].missed.length);
    const held  = Object.keys(tally).filter(k => !tally[k].missed.length);

    const label = k => {
      const i = IDEAS[k];
      return '<div class=tname>' + i.name + '</div>' +
             '<div class=tobj>&sect;' + i.obj.replace('/O', ' objective ') +
             ' &middot; ' + i.text + '</div>';
    };
    const row = w => '<div class=wk><span class=x>' + w.ex + '</span>' +
      '<span style="color:var(--ink-faint)">=</span><span class=x>' + w.is + '</span>' +
      '<span class=rz>' + w.why + '</span></div>';

    let body = '';
    if (shaky.length) {
      body += '<h2>Worth another look</h2>' + shaky.map(k =>
        '<div class=grp>' + label(k) +
        (tally[k].asked === 1 ? '<div class=thin>one question only &mdash; not much to go on</div>' : '') +
        tally[k].missed.map(q => row(q.work)).join('') + '</div>').join('');
    }
    if (held.length) {
      body += '<h2>These held</h2><div class=grp>' + held.map(k =>
        '<div class=heldrow>' + label(k) +
        (tally[k].asked === 1 ? '<div class=thin>one question only</div>' : '') +
        '</div>').join('') + '</div>';
    }
    if (!shaky.length) {
      body += '<h2>Three where the rules change</h2><div class=grp>' +
        [{ex:'`(x^2)^3`', is:'`x^6`', why:'Three copies of `x^2` multiplied, so six factors.'},
         {ex:'`(2x)^2`', is:'`4x^2`', why:'The exponent reaches the 2 as well.'},
         {ex:'`x^2 * y^2`', is:'`x^2y^2`', why:'Different bases, so nothing merges.'}]
        .map(row).join('') + '</div>';
    }

    stage.innerHTML = M(body +
      '<div class=note><p>To check any rewriting, put a number in. ' +
      '`2x^2 + 2x^2` = `4x^2` at `x` = 2 gives 8 + 8 and 4 &middot; 4, both 16. ' +
      '`x^2 + x^2` = `x^4` at `x` = 3 gives 18 and 81.</p></div>' +
      '<div class=bar><span></span><button class=go id=again>Again</button></div>');
    document.getElementById('again').onclick = () => {
      Object.keys(answers).forEach(k => delete answers[k]);
      Object.keys(expanded).forEach(k => delete expanded[k]);
      revealed.clear(); lit = null; tipEl.innerHTML = '';
      view = {kind:'intro'}; render();
    };
  }

  paintScene();
  teacherBar();
  render();
}
