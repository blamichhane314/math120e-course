# MATH 120E — course companion

A static site alongside the course. It holds the structure — objectives, the
schedule, and how the two relate — so that the work a student is doing has
somewhere to sit.

## Pages

- `index.html` — the term at a glance, and the way in to everything else
- `connections.html` — the objective graph at three scales: whole course by
  chapter, section by section, or one objective and its immediate neighbours
- `homework.html` — what each assignment covers, which objective every problem
  serves, and two worked examples per section
- the first-day diagnostic lives in its own repository

## What is and is not here

`data/course.json` carries the *structure* of the assignments: section,
objective, problem number, what kind of answer it takes, whether it involves a
table or a graph. It does not carry the problems themselves.

`data/examples.json` holds two problems per section of chapter 1 — fourteen in
all, under three percent of the assignment set — so students can see what a
section asks before they open it. The rest are in MyLab, which is where the
assignments live.

## Building it

Nothing to build. Static files, no dependencies, no framework. KaTeX and the
two typefaces are vendored so the site makes no external requests.

    python3 -m http.server 8797

## Where the data comes from

Generated from the private working repository, which holds the full converted
assignments. `course.json` here is that file with every content field removed;
`examples.json` is a deliberate small sample. Regenerate both when the source
changes rather than editing them by hand.
