/* Draws every month of the term and fails if any takes visibly long.
   Written after a loop that bounded itself by comparing month *indices*
   ran for 20 seconds on December alone: month 11 has no higher index to
   fail against, so the guard that stopped every other month never fired.
   A person felt that instantly; reading the rendered output did not show
   it. This times what the reader waits for.

   node tools/calcheck.mjs */
import { readFileSync } from 'node:fs';
import { mountMonths, examsOf, weeksOf } from '../js/calendar.js';

const BUDGET_MS = 50;
const cal = JSON.parse(readFileSync(new URL('../data/calendar.json', import.meta.url)));
const el = { innerHTML: '', querySelectorAll: () => [] };

const first = new Date(cal.start.split('-')[0], cal.start.split('-')[1] - 1, 1);
const last  = new Date(cal.end.split('-')[0],   cal.end.split('-')[1] - 1, 1);

let worst = 0, worstName = '', fail = false;
for (let d = new Date(first); d <= last; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
  const t0 = performance.now();
  mountMonths(el, cal, new Date(d.getFullYear(), d.getMonth(), 15));
  const ms = performance.now() - t0;
  const name = d.toLocaleString('en', { month: 'long' });
  const cells = (el.innerHTML.match(/class="?cal-c/g) || []).length;
  if (ms > worst) { worst = ms; worstName = name; }
  if (ms > BUDGET_MS) fail = true;
  console.log(`  ${name.padEnd(10)} ${ms.toFixed(1).padStart(7)} ms   ${cells} cells`);
}

const weeks = weeksOf(cal).filter(w => w.items.some(i => i.kind === 'section')).length;
console.log(`\n  slowest: ${worstName} at ${worst.toFixed(1)} ms (budget ${BUDGET_MS} ms)`);
console.log(`  ${examsOf(cal).length} exams, ${weeks} weeks that teach a section`);
if (fail) { console.error('\nFAIL: a month took longer than the budget'); process.exit(1); }
console.log('\nclean');
