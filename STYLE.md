# Writing for this course

## Where the content comes from

Three sources, in this order of authority:

1. **The course objectives**, in their exact official wording. They fix what a
   section must cover and what each item is called.
2. **The assigned homework problems.** They fix the *level*. Survey the whole
   assignment before writing practice: in 1.1, order of operations is 9 of the
   30 problems and most carry a fraction bar, a radical, or both, while the
   first draft's practice stopped at $(8-2\cdot 3)/2$. A section can cover
   every objective and still leave students unprepared for the work they are
   actually set.
3. **Evidence of what students actually did.** Diagnostic responses, quiz,
   homework and exam results, and what the instructor sees while walking the
   room. This does not decide what a section *covers* — objectives do that —
   it decides **emphasis**: which item gets a slide of its own, which distractor
   is worth writing, which facet a reflection probes first, what is worth
   returning to. **An error that has been observed outranks one that seems
   likely.** Applies to everything a student reads, not only to reflections.
4. **Explicit instruction from the instructor.** Overrides any of the above,
   including anything written in this file.

Nothing else is a source. Not what a topic usually looks like elsewhere, and
not what seems pedagogically interesting in the abstract.

**Evidence can also say that more coverage is the wrong answer.** Where a
misconception persists in material that already treats it several times, the
fault is in the treatment, not in the amount of it. Adding a seventh instance of
the same shape is the reflex to resist. See `REFLECTION_DESIGN.md` §2 for the
worked case.

## Two versions of the notes

The Canvas version goes to enrolled students. A public web version is derived
from it later and can differ.

Practice problems are written to match the structure and difficulty of the
assigned homework rather than reproduce it. That is enough: matched difficulty
is what prepares students, and it keeps the public version unencumbered.

## Length follows the objective, not the topic

An objective that the homework does not assess is carried at the length it
needs and no further. Absolute value in 1.1 is supplementary — no problem in
the assignment touches it — so it is three slides, not five. Interest in a
topic is not a reason to spend a student's time on it.


Rules for anything a student reads: class notes, the site, question text,
worked examples. Written after a review of the section 1.1 notes, whose first
draft failed most of what follows.

This file exists so the same faults are not re-authored in the next section.
Add to it whenever a draft goes wrong in a new way.

---

## The core fault

The first draft was written in a **persuasive, essayistic register** when the
work requires an **expository, reference register**. An essay wants to change
how you see something; it reframes and editorialises. Notes want to be a
correct record a student can consult in week 12, quote on an exam, and match
against the textbook. A student is not an audience to be persuaded.

### Why the rules below were not enough

Rules 1 to 12 were written after the first review. They name *symptoms*:
invented metaphor, editorial aside, aphoristic closer, second-person
lecturing. Then this passed all twelve and was still wrong:

> "The properties below record which rewritings of an expression are guaranteed
> to leave its value unchanged, so that a calculation can be rearranged without
> being recomputed."

No metaphor, no aside, no flourish, no second person. It breaks no rule on the
list, and no student can use a word of it.

The disease the symptoms come from: **writing one level of abstraction above
the content.** Instead of stating the mathematics, characterising it. The
sentence is a true claim *about* the properties, and true claims about
mathematics are not mathematics.

Three things made it worse in that specific case. **The diction is borrowed
from mathematical logic** — "rewritings", "guaranteed to leave its value
unchanged", "recomputed" — a register no first-course student speaks. **The
purpose clause is abstract**: "so that a calculation can be rearranged without
being recomputed" describes a benefit in terms as general as the claim itself.
And most tellingly, **the concrete version already existed two lines below**,
in the worked box: $3+5$ and $5+3$ both give $8$; $x+5$ and $5+x$ cannot be
computed. The abstraction was written on top of a correct concrete
explanation and given the more prominent position.

That is the pattern to watch. When motivation is called for, the temptation is
to ascend, because a general characterisation feels more explanatory and is
easier to write than a particular instance. It is neither.

## Rule 0, which governs the rest

**State the mathematics. Do not characterise it.**

Two tests, both cheap:

**Can a student use the sentence?** A sentence they can only agree with is not
a sentence they can use. "The properties record which rewritings preserve
value" invites a nod. "$a+b=b+a$ for every real $a$ and $b$" can be applied.

**Is there a number, a symbol, or a named object in it?** Abstraction hides in
sentences whose nouns are all category words — *expression, value, calculation,
property, structure, idea, relationship*. If a sentence contains none of the
mathematics it is about, rewrite it around an instance.

When both a concrete statement and an abstract summary of it exist, keep the
concrete one and delete the summary. Do not lead with the summary.


---

## 1. Do not paraphrase standard terminology

**Rejected:**

> Six things to be able to do by the end:
> 1 name the property that lets you do a step
> 2 put numbers into an expression and evaluate it
> 3 evaluate in the right order
> 4 say which of two numbers is larger
> 5 draw an interval and write it down

**Instead:** the objectives as they are actually written.

> 1. Identify properties of real numbers
> 2. Evaluate algebraic expressions
> 3. Evaluate expressions using the order of operations
> 4. Compare real numbers
> 5. Graph intervals on a number line

**Why the paraphrase is worse, not simpler.** The precise terms are the ones
that appear in MyLab, in the textbook, on the exam, and in every course after
this one. A student who has only met "say which of two numbers is larger" has
not met "compare real numbers", and will meet it cold under assessment
conditions. Vocabulary is not an obstacle placed in front of the mathematics;
it is part of the mathematics being taught.

There is a second cost. Writing down to a co-requisite class signals an
assumption about what they can handle. That assumption is both insulting and
self-fulfilling.

Plain language is for **explanation**. Standard terminology is for
**naming**. Explain plainly, but name correctly, and never substitute the one
for the other.

---

## 2. Do not editorialise about the content

**Rejected:**

> These are permissions, not facts to memorise. Each one tells you a
> rearrangement you are allowed to make.

Three separate faults in two sentences.

**It invents competing vocabulary.** "Permission" is not a term in
mathematics. A student who absorbs it has learned a word that will never be
recognised by a textbook, a grader, or another instructor. Inventing a memorable
frame that displaces the discipline's own language is a disservice, however
well it reads.

**It prescribes an attitude.** "Not facts to memorise" tells the student how to
feel about the material and corrects a stance they may not have held. It also
presumes deficit — that they were about to do the wrong thing and need
heading off.

**The "not X, but Y" construction is rhetorical, not expository.** It is the
shape of an argument. Notes make statements; they do not argue with an
imagined opponent.

**Instead:** state the property and show it being used.

> **Distributive property.** For all real $a$, $b$, $c$: $a(b+c) = ab + ac$.
> Used left to right this expands a product; used right to left it factors.

The reader can see what it permits. Saying so adds nothing and costs precision.

---

## 3. Never narrate the document inside the document

**Rejected:**

> Blank space is deliberate. We fill it in together.

An instruction given during authoring ("leave space for me to work problems in
class") became a sentence in the artifact. Instructions about how a thing is
built are not content of the thing.

A ruled box under a problem is self-evident. If a convention genuinely needs
explaining, it belongs in a syllabus or said aloud once, not printed on the
page every time.

The same rule kills: "one idea per slide", "we will come back to this",
"this is worth your attention".

---

## 3a. A label on a slide element is document narration too

**Rejected:** the small-caps `worked for you` printed above every worked
example.

It fails twice over. It **addresses the reader** — the "for you" is the author
claiming credit for a service (rule 7) — and it **describes the artifact rather
than the mathematics** (rule 3). A filled box containing a solved problem,
placed under a statement, is self-evidently an example. Naming it adds a line
of type and no information.

The macro now prints the box with no heading. The parallel with `practice` is
not a reason to keep it: `practice` is an instruction — it tells the student
there is something for them to do, and where it starts. A worked example asks
nothing of the reader, so it needs no announcement.

**The general form:** before labelling any element, ask whether the label
changes what the reader does. If it only says what the thing is, and the thing
already shows what it is, delete it.

---

## 3b. Do not overclaim in a definition of the subject

**Rejected:**

> Mathematics is the tool used to measure and describe quantities.

**Instead:**

> Mathematics provides the tools for measuring and describing quantities.

"Is **the** tool" is a false and grandiose claim — it asserts that measurement
is what mathematics *is*, which is both wrong and more than the slide needs.
The passive "used to" then hides who is doing the measuring. "Provides the
tools for" claims only what the sentence needs: these are instruments, and the
section is about to hand over some of them.

A motivating opener is permitted by rule 8, but it is still held to the same
standard as everything else: claim exactly as much as is true, and no more. The
temptation at the opening of a section is to reach for the grand definition,
because a section feels like it deserves a grand beginning. It does not.

---

## 4. Slide titles are labels, not headlines

**Rejected:** "The one that catches everyone" · "Why there is an order at all"
· "The two cases, and why they are not two rules"

**Instead:** "Absolute value" · "Order of operations" · "Definition of absolute
value"

A title is an index entry. A student scanning for the absolute value material
in week 12 searches for the word, not for the joke. Headline-writing is a
magazine habit and it makes a document unnavigable.

---

## 5. Drop the editorial aside

Recurring instances: "This one catches everyone." · "The second one is worth
care." · "which is the whole content of the idea" · "and it is the one you will
use most" · "that single sentence is the whole idea".

Each is the author stepping in front of the material to comment on it. Where a
warning is genuinely needed, make it a statement about mathematics rather than
about students:

- Rejected: "This one catches everyone."
- Accepted: "$-9^2 = -81$ and $(-9)^2 = 81$. The exponent applies to 9 unless
  parentheses place the minus inside the base."

---

## 6. Avoid the aphoristic closer

Sentences that end on a flourish — "a different number, from a different
expression", "distance does not carry a direction", "same question, two
registers" — read as writing rather than as reference. Cut the cadence and keep
the content. If the sentence would be at home in an essay's final paragraph, it
does not belong in notes.

---

## 7. Second person, sparingly

"You will use this most", "you are naming one of these", "everyone follows it,
including every calculator you will use" — direct address accumulates into a
lecturing voice.

Instructions to the reader are fine and necessary: "Evaluate the expression",
"Graph the solution set". Commentary addressed to the reader is not.

---

## 8. Open with what the mathematics is for

A section that begins on its first definition has skipped the reason the
definition exists. For a course whose students are not mathematics majors, the
concrete thing they carry away is the reason.

Section 1.1 now opens on measurement: counting a collection needs only
$1,2,3,\dots$; measuring one needs $2.5$ metres, $-4$ degrees, $\tfrac{3}{8}$ of
a share. That motivates the collections of numbers, which motivates $\mathbb{R}$,
which is the setting the properties are about. Only then do the properties
appear — as the record of which rewritings preserve value, because arithmetic
is not free to vary.

The order is: **what is being measured → what numbers are needed → what rules
those numbers obey → how to name a quantity that is not yet known.**

Motivation is stated as fact, never as exhortation. "Counting requires only the
natural numbers; measurement requires more" is a statement about mathematics.
"You'll see why this matters" is not.

## 9. Introduce a variable as a tool before evaluating one

Evaluation is meaningless until a letter means something. Name the unknown
first — "if a shift pays $x$ per hour, two hours pay $2x$" — and only then
substitute a value into it.

Prefer a structure the student can picture: pay, area, distance. `2x + 100`
evaluated at $x=50$ carries more than `3x - 7` at $x = -2$, and costs nothing
extra to write.

## 10. Carry one applied thread across sections, taken from the homework

A worked context that returns is worth more than several that do not — and the
context should be one the assignment actually uses, not one invented because it
is tidy.

HW 1.2 problem 38 gives a salon selling cologne wholesale, with variable costs
as a polynomial in $x$ hundred bottles and fixed costs on top, asking for
revenue, cost and profit. The notes carry the same structure with a book: in
§1.1 a publisher sells at \$18 with cost $C=7x+4000$, and $R$ and $C$ are
**evaluated** at two values of $x$, one of which gives a loss; in §1.2 the
profit becomes one polynomial, $P=18x-(7x+4000)=11x-4000$, which is
**subtracting polynomials**; in §1.6, $11x-4000=0$ is **solved** for the
break-even point. One situation, three sections, three operations on it.

An earlier draft used a rectangle for this. It was replaced because no problem
in the assignment is about a rectangle, while two are about revenue and cost.
The thread should be drawn from the homework for the same reason the practice
is: the assignment is what the student is actually accountable for.

Say the forward reference explicitly and by section number.

**Weight it by the assignment.** Applications are 2 of the 39 problems in
HW 1.2, so the thread is one slide per section, not a running theme that
displaces the mathematics.

## 11. Space is a decision about the problem

Do not label practice space "you try". The heading is **practice**; the
problems follow.

Choose the shape from what the work looks like, and be generous — a box that
only just fits the intended solution leaves no room for a false start, and
false starts are most of the work:

| the answer is | shape | why |
|---|---|---|
| a name, a symbol, one number | `\ptwo`, two side by side | short work, and the right half of the page would otherwise be blank |
| several steps | `\ptwo` with more depth, or `\pfull` | room to go wrong once and restart |
| a graph | `\pline`, axis already drawn | otherwise the student's effort goes into drawing an axis |

**Space to work in is space, not a container.** No dashed border, no ruled
lines. A drawn box adds an edge, a rule and a shape to fit the answer into,
none of which is needed: the prompt and the gap beneath it are enough, and the
page is quieter without them.

A reference a student needs while answering — the list of property names under
*Properties of the real numbers* — belongs directly under the frame title,
above the practice heading. Putting it between the instruction and the problems
pushes the problems down and buys nothing.

## 12. Do not argue for a rule before the rule has been stated

**Deleted outright** — the slide that opened objective 1:

> $3+5$ and $5+3$ both equal $8$. $x+5$ and $5+x$ cannot be computed.
>
> Swapping the $3$ and the $5$ needs no rule, because both sides can be worked
> out and compared. Swapping the $x$ and the $5$ does need one, because neither
> side can be worked out.

**"Swapping the 3 and the 5 needs no rule" is confusing and close to false.**
The commutative property governs $3+5=5+3$ exactly as it governs $x+5=5+x$. What
the slide was reaching for is that a numerical identity can be *checked* by
computing both sides, whereas a symbolic one must be *justified* by a general
law. That distinction is about how mathematical claims are verified — it is
epistemology, not algebra — and a student who is told a rule is not needed here
but is needed there has been handed a distinction they cannot use and may now
believe the property has exceptions.

**It argued for the properties before stating any of them.** A reader who does
not yet know what "commutative" says cannot follow a case for why it is
required. Motivation that precedes its object is not motivation; it is a
puzzle. State the rule, then show it working.

**It also leaned on a variable two objectives early.** Variables are introduced
under objective 2. Leading objective 1 with $x+5$ makes the letter carry an
argument before it has been given a meaning (rule 9).

**And its actual payload already existed elsewhere.** Everything the slide
established — that the properties hold for every real number, which is what
lets them be used on a letter — is one line under the table on the following
slide. The slide was an abstract preamble to a concrete statement, which is
rule 0's failure mode arranged across two slides instead of two sentences.

**The test this gives:** cover the slide and ask what a student cannot do
without it. If the next slide still teaches the objective, the slide is
preamble. Cut it. In notes, a slide is a cost paid in a student's attention;
one that only prepares the ground for the next slide is not worth the payment.

---

## 13. The explanation slot is where abstraction collects

**Removed** — the explanation under the distributive property:

> The only property relating multiplication to addition. Since $b-c$ means
> $b+(-c)$, the same statement gives $a(b-c)=ab-ac$, which is the form used
> whenever a subtraction appears.

Three sentences, three different faults, one cause.

**"The only property relating multiplication to addition"** is a claim about
where the property sits in a classification of properties. It is not a
sentence, and it is not mathematics — it is mathematics *about* mathematics.
It answers a question no student has asked, and the superlative invites them to
audit the taxonomy rather than apply the rule.

**"Since $b-c$ means $b+(-c)$, the same statement gives $a(b-c)=ab-ac$"** is
real mathematics, but $a(b-c)=ab-ac$ is already printed on the properties table
two slides earlier. And "the same statement gives" is the meta-register again:
describing what a statement does instead of stating something.

**"which is the form used whenever a subtraction appears"** is a remark about
usage habits, in the passive, with no agent and no instance.

**The cause.** Directly below this passage, the worked box shows the property
used three ways: $4(x+7)$ expanded, $12x^{3}-18x^{2}$ factored, $5x^{2}-2x^{2}$
combined. The prose was describing in words what the box demonstrates in
symbols, and it had been placed *above* it. This is rule 0's failure mode in
its most common physical form — and rule 12 was the same fault spread across
two slides instead of contained in one.

**So: `\statement`'s second argument is optional, and empty is the default.**
Pass `{}` and let the claim stand. Fill the slot only when the explanation says
something the claim does not and the worked example cannot — a restriction on
when the rule applies, a case that behaves differently, a definition a symbol
depends on. If a worked example follows, assume the slot should be empty until
proven otherwise.

**The test:** read the explanation, then read the worked example. If the
example demonstrates what the explanation asserts, the explanation is a
caption for something the reader can already see. Delete it.

---

## What the figures should be

The figures were the part of the first draft that worked, so the conventions
are worth stating. Generated from values, never traced. Brick carries the
mathematical content and nothing decorative is coloured. Nothing is drawn
across a boundary it does not belong inside — a representative value placed on
the edge of a ring asserts something false. Where two things are being
contrasted, separate them physically: two arrows at the same height read as one
span.

---

## What to keep

Patterns confirmed as working across several reviews. Carry them forward:

- **One idea per slide**, with genuine whitespace.
- **Worked examples fully worked**, so the form of a correct answer is known
  before class.
- **Generous blank space** for problems done live, with the shape chosen by
  the problem (see rule 11).
- **Figures generated from values**, not traced, so a change of range is a
  changed argument.
- **A statement before its symbols** — the ordering is right even though the
  first draft's statements were badly worded.
- **Naming the specific error** a distractor represents, rather than marking it
  wrong.
- **The forward note.** A quiet line at the foot of a slide, in the muted
  colour, naming where this returns and what it becomes there. From the revenue
  slide in §1.1:

  > In §1.2 the profit is written as one polynomial,
  > $P=18x-(7x+4000)=11x-4000$. In §1.6, solving $11x-4000=0$ gives the number
  > of copies at which the publisher breaks even.

  Four things make it work, and all four are required:

  1. **It carries the actual expression forward**, not a promise. The student
     sees $11x-4000$ now and will recognise it in §1.2.
  2. **It names the section by number.** "Later in the course" is not a
     reference.
  3. **It names the operation** the expression undergoes there — subtracting
     polynomials, then solving — so the return has a purpose, not just a
     reappearance.
  4. **It sits at the foot, in the quiet register.** It is orientation, not
     content, and must not compete with the mathematics above it.

  A forward reference that fails any of these is worse than none: "we will come
  back to this" is document narration (rule 3), and "this matters for what
  comes next" tells the reader how to feel (rule 2).

  Used well elsewhere in §1.1: the distributive property naming §1.2 expanding,
  §1.3 factoring and §1.6 clearing parentheses; $-9^{2}$ naming $b^{2}$ in the
  quadratic formula in §1.7 with the value at $b=-9$ given; identity and
  inverse naming the two steps that solve every equation in §1.6.

---

## Checklist before a section ships

0. **Does every sentence contain a number, a symbol, or a named object?** If a
   sentence's nouns are all category words — expression, value, property,
   structure, idea — rewrite it around an instance. This is the check that
   catches what the others miss.
1. Does every objective appear in its exact official wording somewhere?
2. Does any sentence tell the reader how to feel, or what not to do?
3. Does any sentence describe the document rather than the mathematics?
4. Is every title a searchable label a student would type in week 12?
5. Has any non-standard term been invented — including a coined name for an
   error, however well attested in the research literature? Names like *sticky
   sign*, *conjoining* and *pooling* are useful to an instructor and useless to
   a student, who will never see them again.
6. Would any sentence be at home at the end of an essay? Cut it.
7. Does the practice match the *level* of the assigned homework, not just its
   objectives?
8. **Does every slide survive being covered up?** If the next slide still
   teaches the objective without it, it was preamble (rule 12).
9. Does any sentence claim more than it needs — "the tool", "the whole idea",
   "all of mathematics"? Claim exactly what is true (rule 3b).
10. Does any element carry a label that only says what the element already
    shows? Delete it (rule 3a).
11. **For every `\statement` with a worked example under it:** does the
    explanation say anything the example does not demonstrate? If not, empty
    the slot (rule 13).
