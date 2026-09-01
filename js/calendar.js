/* The term calendar. Everything with a day of its own lives in
   data/calendar.json: what is covered on each class day, the exams, and the
   days the university is closed. The months the grid draws come from the
   term's own start and end, and the columns from the days the course meets,
   so nothing here has to be edited when the schedule is. */

const MONTH = ['january','february','march','april','may','june','july',
               'august','september','october','november','december'];
const FULL  = ['January','February','March','April','May','June','July',
               'August','September','October','November','December'];
const DAY   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const SHORT = ['sun','mon','tue','wed','thu','fri','sat'];

/* built from parts, so a date string is never read as UTC and shown a day early */
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const key = d => d.getFullYear() + '-' +
  String(d.getMonth() + 1).padStart(2, '0') + '-' +
  String(d.getDate()).padStart(2, '0');
const spoken = d => DAY[d.getDay()] + ', ' + FULL[d.getMonth()] + ' ' + d.getDate();
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* every exam the calendar knows about, read off the days themselves */
export function examsOf(cal) {
  const out = [];
  for (const [date, items] of Object.entries(cal.days))
    for (const it of items) if (it.kind === 'exam') out.push({ ...it, date });
  out.sort((a, b) => a.date < b.date ? -1 : 1);
  return out;
}

export function mountExams(el, cal) {
  el.innerHTML = '<div class=cal-list>' + examsOf(cal).map(e => {
    const when = e.date
      ? spoken(parse(e.date)) + (e.time ? ', ' + e.time : '')
      : (e.note || 'to be announced');
    return '<div class="cal-r' + (e.date ? '' : ' soon') + '">' +
      '<span class=cal-rn>' + esc(e.text.toLowerCase()) + '</span>' +
      '<span class=cal-rd>' + esc(when) + '</span>' +
      '<span class=cal-rc>' + esc(e.covers || '') + '</span></div>';
  }).join('') + '</div>';
}

const ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const brief = d => ABBR[d.getMonth()] + ' ' + d.getDate();

/* The term grouped into weeks, read off the same days the grid draws, so the
   list underneath and the calendar above cannot disagree. */
export function weeksOf(cal) {
  const start = parse(cal.start), end = parse(cal.end);
  const closed = new Map(cal.closed.map(c => [c.date, c]));
  const weeks = [];
  const mon = new Date(start);
  mon.setDate(mon.getDate() - ((mon.getDay() + 6) % 7));

  for (let n = 1; mon <= end; n++, mon.setDate(mon.getDate() + 7)) {
    const from = new Date(mon), to = new Date(mon);
    to.setDate(to.getDate() + 4);
    const items = [], shut = [], seen = new Set();
    for (const c of cal.meets) {
      const day = new Date(from);
      day.setDate(from.getDate() + ((c + 6) % 7));
      const k = key(day);
      if (closed.has(k)) shut.push(closed.get(k).title);
      for (const it of (cal.days[k] || [])) {
        /* a section taught over two days is one entry in the week's list */
        const id = it.id || it.text;
        if (seen.has(id)) continue;
        seen.add(id);
        items.push(it);
      }
    }
    weeks.push({ n, from: new Date(from), to, items, shut });
  }
  return weeks;
}

export function mountWeeks(el, cal, byId = {}) {
  el.innerHTML = weeksOf(cal).filter(w => w.items.length || w.shut.length).map(w =>
    '<div class=wkrow>' +
      '<div class=wkh><b>week ' + w.n + '</b><span>' +
        brief(w.from) + ' – ' + brief(w.to) + '</span></div>' +
      '<div class=wkb>' +
        w.items.map(it => {
          if (it.kind === 'exam')
            return '<div class=exam>' + esc(it.text.toLowerCase()) +
              (it.covers ? ' &middot; ' + esc(it.covers) : '') + '</div>';
          if (it.kind !== 'section')
            return '<span class=wkn>' + esc(it.text.toLowerCase()) + '</span>';
          const nObj = (byId[it.id] || {}).objectives;
          return '<a class=wks href="homework.html#' + it.id + '">' +
            '<span class=n>' + it.id + '</span>' + esc(it.text.toLowerCase()) +
            (nObj ? '<i>' + nObj.length + ' objectives</i>' : '') + '</a>';
        }).join('') +
        w.shut.map(t => '<span class=wkn>' + esc(t.toLowerCase()) + '</span>').join('') +
      '</div>' +
    '</div>').join('');
}

/* The class meets Monday to Thursday, so a closure only matters here when it
   falls on one of those days. The list is those days and nothing else. */
export function mountOff(el, cal) {
  el.innerHTML = '<div class="cal-list two">' + cal.closed.map(c =>
    '<div class="cal-r shut">' +
      '<span class=cal-rn>' + SHORT[parse(c.date).getDay()] + ' ' +
        brief(parse(c.date)).toLowerCase() + '</span>' +
      '<span class=cal-rd>' + esc(c.title) + '</span>' +
    '</div>').join('') + '</div>';
}

export function mountMonths(el, cal, today = new Date()) {
  const start = parse(cal.start), end = parse(cal.end);
  const cols = cal.meets.slice().sort((a, b) => a - b);
  const closed = new Map(cal.closed.map(c => [c.date, c]));
  const nowKey = key(today);

  const months = [];
  for (let d = new Date(start.getFullYear(), start.getMonth(), 1); d <= end;
       d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) months.push(new Date(d));

  /* open on the month the reader is in, or on the term's first month */
  let at = months.findIndex(m => m.getFullYear() === today.getFullYear() &&
                                 m.getMonth() === today.getMonth());
  if (at < 0) at = today < start ? 0 : months.length - 1;

  const nav = () => '<div class=cal-nav>' + months.map((m, i) =>
    '<button type=button data-m=' + i + (i === at ? ' aria-current=true' : '') + '>' +
    MONTH[m.getMonth()] + '</button>').join('') + '</div>';

  const cell = d => {
    const k = key(d), shut = closed.get(k), items = cal.days[k] || [];
    const inTerm = d >= start && d <= end;
    const cls = ['cal-c'];
    if (!inTerm) cls.push('out');
    if (shut) cls.push('shut');
    if (items.some(i => i.kind === 'exam')) cls.push('ex');
    if (k === nowKey) cls.push('now');

    const body = shut
      ? '<span class=cal-shut>' + esc(shut.title) + '<b>no class</b></span>'
      : items.map(it => it.kind === 'section'
          ? '<a class=cal-i href="homework.html#' + it.id + '">' +
            '<span class=cal-id>' + it.id + '</span>' + esc(it.text) + '</a>'
          : it.kind === 'exam'
          ? '<span class="cal-i cal-exam">' + esc(it.text) +
            (it.time ? '<span class=cal-cov>' + esc(it.time) + '</span>' : '') +
            (it.covers ? '<span class=cal-cov>' + esc(it.covers) + '</span>' : '') + '</span>'
          : '<span class="cal-i cal-' + it.kind + '">' + esc(it.text) + '</span>'
        ).join('');

    return '<div class="' + cls.join(' ') + '">' +
      '<span class=cal-n>' + d.getDate() + '</span>' + body + '</div>';
  };

  function draw() {
    const m = months[at], y = m.getFullYear(), mo = m.getMonth();

    /* start on the Monday of the week the month opens in, so a month that
       begins mid-week keeps its first days in the right columns */
    let d = new Date(y, mo, 1);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));

    /* week 1 is the week the term starts in, counted from its Monday */
    const wk0 = new Date(start);
    wk0.setDate(wk0.getDate() - ((wk0.getDay() + 6) % 7));
    const weekOf = mon => Math.round((mon - wk0) / 604800000) + 1;

    /* Stop at the first day of the next month. Comparing month *indices*
       instead had no way out of December: once the cursor stepped into
       January the test `d.getMonth() < mo` read 0 < 11 and stayed true, so
       the loop ran on until Date overflowed to NaN some 274,000 years later
       and the comparisons finally went false. Every other month escaped
       because a larger index existed to fail against. */
    const stop = new Date(y, mo + 1, 1);

    let rows = '';
    while (d < stop) {
      let row = '<div class=cal-w>' + weekOf(d) + '</div>', teaching = false;
      for (const c of cols) {
        const day = new Date(d);
        day.setDate(d.getDate() + ((c + 6) % 7));
        if (day.getMonth() === mo && day >= start && day <= end) teaching = true;
        row += day.getMonth() === mo ? cell(day) : '<div class="cal-c gone"></div>';
      }
      /* weeks the term does not reach are left out rather than drawn empty */
      if (teaching) rows += row;
      d.setDate(d.getDate() + 7);
    }

    const track = 'grid-template-columns:2.6rem repeat(' + cols.length + ',1fr)';
    el.innerHTML = nav() +
      '<div class=cal-head style="' + track + '">' +
        '<span class=cal-wh>wk</span>' +
        cols.map(c => '<span>' + SHORT[c] + '</span>').join('') + '</div>' +
      '<div class=cal-grid style="' + track + '">' + rows + '</div>';

    for (const b of el.querySelectorAll('.cal-nav button'))
      b.addEventListener('click', () => { at = +b.dataset.m; draw(); });
  }

  draw();
}
