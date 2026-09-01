/* Times every control on the page and reports any that block.
   Paste into the browser console on each page, or run via automation.

   Written after a month button on schedule.html took 20 seconds: reading the
   rendered output showed nothing wrong, because the output WAS correct — the
   fault was entirely in how long a person waited for it. Static review cannot
   see this class of bug and neither can checking state after it settles.

   Anything over ~40ms is worth a look; over 100ms is felt. */
(() => {
  const out = [];
  let i = 0;
  for (let pass = 0; pass < 8; pass++) {
    const ctrls = [...document.querySelectorAll(
      'button, [role=button], .fxterm[data-t], .fxx.live, .leaf, .skybar button')]
      .filter(e => e.getBoundingClientRect().width > 0);
    for (const c of ctrls) {
      if (i++ > 150) break;
      const label = String(c.textContent || c.getAttribute('class') || c.tagName)
        .trim().slice(0, 28).replace(/\s+/g, ' ');
      const t0 = performance.now();
      try { c.click(); } catch (e) {}
      const ms = performance.now() - t0;
      if (ms > 40) out.push({ label, ms: Math.round(ms) });
    }
  }
  console.table(out.length ? out : [{ label: 'none over 40ms', ms: 0 }]);
  return { page: location.pathname, clicked: i, slow: out };
})();
