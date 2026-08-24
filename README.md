# MATH 120E — course companion

A static site for the course. It holds the objectives, the schedule, and
practice questions written for this course. The assigned problems are in MyLab
and are not reproduced here.

## Pages

- `index.html`: the term at a glance
- `connections.html`: the objective graph by chapter, by section, or one
  objective at a time
- `homework.html`: the objectives for a section, with practice questions
  written for them, one at a time
- the first-day diagnostic is in its own repository

## What is and is not in this repository

The repository is public and is served by GitHub Pages at
<https://blamichhane314.github.io/math120e-course/>.

Nothing here reproduces the publisher's exercises. `data/course.json` carries
the structure only — section, week, objective, and a record for each assigned
problem giving its number, the objectives it serves, and what kind of problem
it is (`mcq`, the block types it uses), with every content field stripped.
The converted assignments stay in the private working repository.

Publishing anything to this repository publishes it openly. Check what a data
file contains before committing it.

## Building it

Nothing to build. Static files, no dependencies, no framework. KaTeX and the
two typefaces are vendored so the site makes no external requests.

    python3 -m http.server 8797

## Where the data comes from

`data/course.json` is generated from the private working repository, stripped of
content fields. `data/q_a.json`, `q_b.json` and `q_c.json` are the practice
questions, written against `AUTHORING.md`. Regenerate `course.json` from the
source rather than editing it by hand.
