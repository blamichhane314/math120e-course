// theme.js — the palette control, shared by every page.
//
// The choice is applied in a blocking script in <head> before anything paints;
// setting it from a module would show one frame of the default palette first.

export const THEMES = [
  { id: 'paper', name: 'paper', swatch: '#f4f0e6', ring: '#9c3b27' },
  { id: 'slate', name: 'slate', swatch: '#eef0f3', ring: '#2f5d8c' },
  { id: 'sage',  name: 'sage',  swatch: '#edf0ea', ring: '#7a3b32' },
  { id: 'ink',   name: 'ink',   swatch: '#1b1e22', ring: '#d98a6a' },
];

const KEY = 'm120.theme';

export function current() {
  try { return localStorage.getItem(KEY) || 'ink'; } catch { return 'ink'; }
}

export function apply(id) {
  document.documentElement.dataset.theme = id;
  try { localStorage.setItem(KEY, id); } catch {}
}

export function mountThemes(into) {
  const box = into || document.body.appendChild(
    Object.assign(document.createElement('div'), { id: 'theme' }));
  box.id = 'theme';
  box.innerHTML = THEMES.map((t) =>
    '<button data-t="' + t.id + '" title="' + t.name + '" aria-label="' + t.name +
    ' theme" aria-pressed="' + (current() === t.id) + '"' +
    ' style="background:' + t.swatch + ';border-color:' + t.ring + '"></button>').join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-t]');
    if (!b) return;
    apply(b.getAttribute('data-t'));
    box.querySelectorAll('button').forEach((x) =>
      x.setAttribute('aria-pressed', String(x.getAttribute('data-t') === current())));
  });
  return box;
}
