# MATH 120E — course companion

A static site alongside the course. It holds the structure — objectives, the
schedule, and how the two relate — so that the work a student is doing has
somewhere to sit.

## Pages

- `index.html` — the term at a glance, and the way in to everything else
- `connections.html` — the objective graph at three scales: whole course by
  chapter, section by section, or one objective and its immediate neighbours
- `homework.html` — every problem, one at a time, with the objectives it serves
- the first-day diagnostic lives in its own repository

## Why this repository is private

It carries the converted assignments in full. Those are the publisher's
exercises, so the site is served privately to the class rather than published
openly — the repository is private and Cloudflare Pages serves it behind Access,
which gates by email for roughly a class-sized group.

Apply Access to the site itself. Never put it in front of an API path a page
posts to: a browser posting in the background has no session and would be
redirected to a sign-in screen.

## Building it

Nothing to build. Static files, no dependencies, no framework. KaTeX and the
two typefaces are vendored so the site makes no external requests.

    python3 -m http.server 8797

## Where the data comes from

Generated from the private working repository, which holds the full converted
assignments. `course.json` here is that file with every content field removed;
`examples.json` is a deliberate small sample. Regenerate both when the source
changes rather than editing them by hand.
