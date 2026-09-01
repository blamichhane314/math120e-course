# Reflection design

How reflection activities for this course are conceived and built. Companion to
`STYLE.md`, which governs the words; this governs the structure.

> **Evidence base.** A five-agent literature scan was run on 2026-08-26 and is
> recorded in `~/Documents/AGENT_FINDING_LOG.md` under that date. It contradicts
> parts of what follows — in particular the anchor-first *attempt* (§3) and the
> pre-attempt claim (§1). **Nothing in this file has been rewritten in response
> yet**; the scan and the owner's own elements are to be merged after discussion.
> Read the log entry before treating any section below as settled.

## How this file is organised

Two kinds of content, kept apart on purpose.

**Owner positions** are the instructor's own design decisions, recorded close to
how they were said and cleaned only for readability. They are the source. They
are marked like this:

> **[owner · scope]** The position, in his words.

The tag after the dot classifies the dimension the position governs:
`scope` · `structure` · `progression` · `pedagogy` · `visual`.

Everything else is derivation — what follows from those positions, or what was
found on disk. **Where the two conflict, the owner position wins**, and the
derivation is wrong and should be rewritten.

---

## 1. What a reflection is

An instrument for measuring the gap between **what a student believes they can
do** and **what they can actually do**. Not a quiz that also asks for
confidence.

`reflection.html` builds a 2×2 of the claim against the outcome, and the comment
above it states the design: the off-diagonals are the only interesting cells.
Claimed it and got it wrong is overconfidence; did not claim it and got it right
is underconfidence. A graded quiz collapses both into a mark and reports
neither.

The four claim levels are not a confidence slider:

1. I could do this now
2. I could do this with my notes
3. I know what it is asking, not how
4. I do not recognise this

Levels 1 and 2 count as claiming it. Level 3 is the diagnostically richest
state: knowing what a question wants without knowing how to answer it is
specific, common, and recoverable.

**Per block:** claim first, then answer, then find out. The claim must be
committed before the answer or there is nothing to compare against. A wrong
answer is met with `diag`, which names the particular misconception that answer
represents rather than marking it incorrect.

**Across a set:** probe one idea from several directions rather than asking it
several times. `facet` is the unit of understanding; the `ask` variants
(`recognise`, `match`, `error`, `method`) are the directions. `predict`,
`contrast` and `show` add variation in kind rather than in difficulty.

Nothing is graded and nothing is identified.

---

## 2. Student performance is a design input

> **[owner · pedagogy]** Assessment of the students' performance plays an
> essential role. That is why we have quizzes, homework and exams. We have to
> make use of those performances to design these reflection tools — and this
> goes not just for reflection tools but for anything we teach in class.

The sources are the diagnostic, quizzes, homework, exams, **and the instructor's
own observation while walking the room**. The last is not a lesser source. It
catches what a scored instrument cannot: hesitation, the question asked aloud,
the student who gets the right answer by a wrong route.

This is recorded as source 3 in `STYLE.md`, which governs every artifact a
student reads — notes, questions, tool text and reflections alike. It sits below
the objectives and the homework, and below explicit instruction, because it
governs emphasis rather than content.

### What it changes

Evidence does not decide what a section covers; objectives do. It decides
**emphasis** — which item earns a slide, which distractor is worth writing,
which facet a reflection probes first, and what is worth returning to. An error
that has been *observed* outranks one that seems *likely*, and inventing
plausible misconceptions when recorded ones are available is the failure mode.

### Recorded observations

**`−a²` against `(−a)²`.**

> **[owner · pedagogy]** From the diagnostic and also from my walking through in
> the class, `−()²` vs `(−)²` type questions were confusing to a lot of them.

Two independent sources agree, which is the strongest evidence available here.

The instructive part is what the material already contains. This misconception
is treated in **six** places:

| where | what |
|---|---|
| notes §1.1 | a full slide, *Exponents and the minus sign*, with its own figure `\figstickysign` |
| `facts.json` | three entries — `1.1/O3` *Exponents and the minus sign*, `1.2/O1` *Where the minus sits*, `1.2/O1` *Sign of a power of a negative* |
| practice | five questions — `1.1/O3/q2`, `1.1/O3/q4`, `1.1/O4/q4`, `1.1/O2/q2`, `1.2/O1/q4` |
| the tool | two authored kinds, `pow.minus-outside` and `pow.negative-base`, each with a written tip |
| reflection | block 10 of the quadratics set, a `contrast` on `−3²` against `(−3)²` |
| notes §1.1 | named again in the forward note from the quadratic formula, `b²` at `b = −9` |

**So coverage is not the problem, and a seventh treatment of the same shape is
the wrong response.** This is the clearest available demonstration of why
evidence is a source: the design instinct on being told "students find this
confusing" is to cover it more, and the evidence says that instinct is wrong
here. What has been tried is *stating the rule and showing the contrast*, six
times. What has not been tried is making a student commit to an answer before
seeing which reading the notation forces — which is what a reflection block
does, and is why this facet belongs early in the order-of-operations set.

**Also recorded from the live diagnostic**, tagged as students met them: *order
of operations · sticky sign*; *order of operations · precedence*; *order of
operations · grouping bar*, logged as "divides only the last term instead of the
whole group"; and *evaluate · substituting a negative*, logged as "substitutes
the negative into x² but treats −2x as if x were positive".

### Keeping the loop closed

Reflection responses are themselves performance data. A facet where many
students claim the skill and then miss it is the strongest signal the course
produces, because it is the only instrument that records the claim at all. That
feedback should reach the next revision of the notes, not only the next
reflection.

---

## 3. The anchor-problem model

This is the organising idea for every reflection in the course.

> **[owner · scope]** For each section, or couple of sections, I select one main
> problem. That problem goes through multiple ideas — sometimes not all of them.
> It is the end goal. If a student already knows how to do it, good. Otherwise
> the reflection works through simpler aspects that build up to it.

> **[owner · scope]** This way we do not crowd the website with too many
> reflections, and students have a specific goal to target.

> **[owner · progression]** These bigger problems are usually the ones they will
> be asked in an exam, so they cover multiple aspects.

### What follows

**One anchor per section or per pair of sections, not one per objective.** The
count of reflections is bounded by anchors, not by skills. A section with six
objectives still gets one reflection.

**The anchor is the entry point, not the destination.** The student meets it
first. Doing it correctly is a valid and complete outcome — the ladder below it
exists only for students who need it. This inverts the usual worked-example
order and is the point: it lets a competent student out in one step, and it
tells a struggling student *what they are struggling toward* before they start
struggling.

**The decomposition is discovered, not declared.** The sub-skills are whatever
the anchor actually contains. That is why anchors are chosen from the homework:
the assignment already fixes which combinations occur.

**Exam shape is the selection criterion.** An anchor earns its place by covering
several aspects at once, because that is what an exam question does.

---

## 4. Two kinds of anchor, two kinds of ladder

The two examples the owner gave decompose along different axes. This distinction
matters when authoring: the ladder under an anchor is not generic.

### 4a. The computational anchor — decomposes by operation

Example: **HW 1.1 problems 12 and 13** (pids `1.1.27`, `1.1.28`).

Its hidden components are the operations it contains and the order they must be
taken in. The ladder is the precedence structure of the expression itself.

### 4b. The modelling anchor — decomposes by representation

Example: **HW 1.2 problem 38** (pid `1.2.39-BE`, objective 1.2/O6), or the
publisher-and-book example carried through the notes.

> **[owner · structure]** We can start with that problem, and if the students can
> create their own expressions, subtract them, and solve — that is fine. But
> otherwise there are so many components hidden. Starting from the biggest one,
> the domain of the problem. The ability to convert English instructions into
> mathematics is one skill, and knowing which mathematical tool to use is
> another. In terms of the mathematics: whether students know that certain
> things can be represented by numbers, then by variables, then by expressions,
> then subtracting polynomials, and so on.

So the modelling ladder has rungs of a different type:

1. **The domain** — what the quantities are and what values make sense for them.
2. **English into mathematics** — turning a described situation into symbols.
3. **Tool selection** — knowing which operation the situation calls for.
4. **The representation ladder** — number → variable → expression → operation on
   expressions.

Rungs 2 and 3 are distinct skills and a student can have either without the
other. A student who writes `R = 18x` correctly but cannot say why profit is a
subtraction has rung 2 and not rung 3.

> **[owner · pedagogy]** The reflection should allow students to explore that and
> to realise that they are exploring. This is a relatively more difficult goal.

Recorded as a **component to consider**, not a requirement to solve before
building — the owner has said explicitly not to hold work up for it. Kept here
so it is not lost: making a student aware that they are exploring, rather than
being marched through a decomposition someone else prepared, is not achieved by
any block type currently in `reflect.js`. Possible directions, none tried:
letting the student choose which rung to attempt next rather than being routed;
showing the ladder itself so the descent is visible; or naming the sub-skill
only after it has been used rather than before.

---

## 5. Anchors chain across sections

> **[owner · progression]** We can always connect one bigger problem to an even
> bigger one. In coming chapters, when we solve problems with a similar story —
> for example, find the number of copies that must be sold to earn a certain
> profit — the previous problem becomes a part of it.

An anchor is not only a ceiling for its own section; it is a **component of a
later anchor**. The same situation returns with one more operation applied to
it.

This is already the structure of the applied thread in the notes
(`STYLE.md` rule 10), which was built from the homework for the same reason:

| section | the same situation | the operation |
|---|---|---|
| §1.1 | `R = 18x`, `C = 7x + 4000` | **evaluate** at two values of `x` |
| §1.2 | `P = 18x − (7x + 4000) = 11x − 4000` | **subtract** polynomials |
| §1.6 | `11x − 4000 = 0` | **solve** for break-even |
| later | `11x − 4000 = 2000` | **solve** for a target profit |

Each row absorbs the row above it. A student who has met §1.1's version has
already met two thirds of §1.6's.

**Consequence for authoring:** an anchor should be chosen with its successor in
mind. Prefer a homework problem whose situation recurs over an equally difficult
one that does not.

---

## 6. Worked instance: the order-of-operations anchor

The first reflection to be built. Recorded here because the alignment with what
already exists is unusually complete and should not be rediscovered.

**Anchor: HW 1.1 #12** (pid `1.1.27`), with **#13** (pid `1.1.28`) as the
second form.

Both are already hand-authored in `data/solutions.json` and already play in the
order-of-operations tool as *several fractions* and *roots*. That means the
decomposition is not a design task — **it already exists as the authored step
data**, and each level of the player is one rung of the ladder.

The sub-skills are the `kind` values in the authored steps, and every one of
them already has a written explanation in `TIPS` in `js/solve.js`:

| anchor | levels | sub-skills present |
|---|---|---|
| #12 `1.1.27` | 4 | `mul.implicit`, `paren.drop`, `sqrt.square` ×2, `frac.divide`, `frac.negative`, `sub.plain` ×2, `add.fractions` |
| #13 `1.1.28` | 4 | `pow.plain` ×2, `sqrt.square` ×2, `mul.implicit`, `add.plain`, `sub.plain`, `frac.divide` |

**The `kind` taxonomy is a facet taxonomy.** A reflection block probing
`frac.divide` and a stepper click tagged `frac.divide` are about the same thing,
so a student's performance in one is evidence about the other.

**Measured misconceptions, not imagined ones.** The live diagnostic has already
recorded, from real students this term, errors tagged: *order of operations ·
sticky sign*, *order of operations · precedence*, *order of operations ·
grouping bar* (logged as "divides only the last term instead of the whole
group"), and *evaluate · substituting a negative* (logged as "substitutes the
negative into x² but treats −2x as if x were positive"). Facets should be built
around these before any invented ones.

**Existing treatment to reuse:** block 10 of `reflect_quadratic.json` is already
a `contrast` on `−3²` against `(−3)²`, tagged `1.1/O3`.

**The stepper as a block type.** A student who claims the anchor, gets it wrong,
and is then handed the same expression to work one operation at a time would be
the first reflection block that reuses a course tool instead of a bespoke
figure. Not yet built.

---

## 7. Open questions

Recorded rather than assumed.

1. **Does the set branch on what the student showed?** The owner described
   adaptivity — gauge understanding, then give information *depending on what
   they know*, then ask further questions. The prototype is linear: block 8 is a
   static `tell` everyone sees regardless of blocks 1–6. Unresolved.

2. **Is the rating on every block or only the opening probes?** The prototype
   rates 6 of 12, front-loaded. Unclear whether that is deliberate or unfinished.
   It matters because an unrated block contributes nothing to the 2×2, which is
   the instrument's whole output.

3. **Per topic or per section?** The quadratics prototype spans five sections
   (1.7, 2.1, 1.1, 1.2, 1.3) because it is organised around a topic. The anchor
   model is stated per section or per pair. These may be the same thing seen
   from two ends — an anchor sits in one section but its ladder reaches back —
   but it is not yet settled.

4. **Where does a reflection live in the site?** `reflection.html` is currently
   hardcoded to one data file, has no routing, and is linked from nowhere. This
   is shell work and should be one pass, before per-topic authoring.

**Not blocking:** "realising that they are exploring" (§4b) is a component to
consider, not a gate. The owner has said not to hold work up for it.
