# Activity design

How the §1.2-onward activities are conceived and built: one continuing situation
that carries the mathematics, met before any of it is named. Companion to
`STYLE.md`, which governs the words, and successor in kind to
`REFLECTION_DESIGN.md`, which governs the branching reflection. This governs the
sequence.

> **Status, 2026-08-31.** This file records the owner's design as stated in
> conversation on 2026-08-30/31, cleaned for readability. A working prototype of
> the §1.2 opening exists as a scratchpad page published to a private Artifact;
> it is **not** in this repo. Four literature agents are running against the
> open questions in §10 and their findings will land in
> `~/Documents/AGENT_FINDING_LOG.md`. **§9 records what is evidenced and what is
> not — read it before treating any section as settled.**

## How this file is organised

Two kinds of content, kept apart on purpose, following `REFLECTION_DESIGN.md`.

**Owner positions** are the instructor's own design decisions, recorded close to
how they were said and cleaned only for readability. They are the source. They
are marked like this:

> **[owner · story]** The position, in his words.

The tag after the dot classifies the dimension the position governs:
`scope` · `structure` · `progression` · `pedagogy` · `visual` · `story`.
`story` is new to this file: it governs the situation the mathematics is carried
in, which in this design is load-bearing rather than decorative.

Everything else is derivation — what follows from those positions, or what was
found in the literature. **Where the two conflict, the owner position wins**,
and the derivation is wrong and should be rewritten.

---

## 1. What this is, and what it is not

It is not the reflection. That work is set aside:

> **[owner · scope]** The whole reflection part is not rigorous yet. The main
> problem with reflections was that the AI-generated ones had no depth and
> rigour, and getting it right so that it actually is useful to a student is
> difficult. We will rather do more like a quiz type but still have the
> reflection theme in mind. We just won't need to design elaborate trajectories
> yet.

It is also not a shorter homework:

> **[owner · scope]** When I say quiz, you're just thinking about a sequence of
> problems. That's not what it is. The reason it's different from their homework
> is that in homework I can't really ask them other types of problems that will
> help me figure out their proper understanding of this topic.

**The distinction that follows, and the test to apply.** A homework problem asks
a student to produce an answer, and a correct answer can be produced by a
procedure the student does not understand. Such a problem cannot separate the
student who understands from the student who executes. So:

> **Filter for every question: could a student get this right by running a rule
> they do not understand?** If yes, it belongs in the homework. If no, it
> belongs here.

The first prototype failed this filter on all sixteen of its questions. That
failure is the reason this file exists.

## 2. The governing principle: the situation first, the mathematics noticed later

> **[owner · pedagogy]** Still connecting more to the actual example rather than
> the maths. I want them to notice the maths later on.

> **[owner · progression]** Then I also want the general aspect of the maths. In
> maths we just use `f(x) =`, or some formula — that is just the way to abstract
> the use cases and develop general theory. Things like domain and range later
> can also be demonstrated using this.

This is the spine of the whole design, and it inverts the usual order. The
student works inside a situation until the mathematics is something they have
already been doing. Only then is it named — and the name is introduced **as an
explanation of what they have been doing**, not as a new topic.

So `f(x)` does not arrive as notation to be learned. It arrives as the answer to
a question the student can by then actually ask: *we keep writing the same kind
of thing about different situations — is there a way to write it once?*
Abstraction is presented as the point of mathematics rather than its price.

**Consequence for ordering.** Every section introduces its mathematics in three
movements: the situation, the work, then the name. Never the name first. A
section that opens by defining its object has already broken the design.

## 3. The story: one bookstore, all the way through

> **[owner · story]** In this class we do financial modelling, so we can start
> with that. Generally `x` is some kind of quantity so far, like number of books
> sold.

> **[owner · story]** Books and revenue are the same.

**This is settled and it unifies the thread.** There are not two contexts — a
counting story for the early work and a money story for the later work. There is
one bookstore. `x` is the number of books. Everything else is built on it.

**The letter rule, which is not negotiable.** `x` is **the number of** books. It
is never "books". See §7.

### 3.1 The opening, in the owner's words

> **[owner · story]** Suppose you have a copy of a book and your friend gave
> their book to you — now how many books do you have? Two. Say there is a magic
> box where if you give it 3 books it will multiply by that much, giving square
> in a more intuitive sense. Then say another friend gave you 5 books — now how
> many books do you have? And the options could be `x + 5`, `5x`, and so on.

Three moves, and each does a distinct job.

**Actual numbers before any letter.** One book and one book is two, done
concretely. The letter arrives afterwards, standing for however many you have.
Nothing is symbolised before it has been done.

**`x + 5` against `5x`** is the highest-value single item in the opening, and it
is the best-measured confusion in the whole literature: Küchemann asked ~3,000
students which is larger, `2n` or `n + 2` — **6% correct, 71% answered `2n`**.
This version is better than his, because the situation lets a student refute the
wrong answer without being told: four books plus a friend's five is nine, not
twenty.

**The box that squares** is derivation-flagged rather than settled — see §4 and
§10. The idea underneath it is correct and subtle: an operator whose behaviour is
fixed by its own input is exactly what squaring is. The risk is the word *magic*.
If the mechanism is hidden, a student can leave with "the box makes things
bigger" and never see that the 3 appears twice, once as the amount given and
once as the number of times it multiplied. **That doubling is the entire meaning
of `x²`.** Opening the box — 3 books laid out in 3 rows of 3 — turns it into the
array model, which is standard and has published items behind it.

### 3.2 Revenue, cost, and profit

> **[owner · progression]** Then we slowly go to introducing the revenue and cost
> function, and then have them first establish the rule for profit and ask what
> maths tools we might need — hoping that students naturally point out polynomial
> subtraction.

The operation is motivated by a need the student has already felt. This is the
opposite of introducing an operation and then hunting for an application, and it
matches the applied thread already fixed in `COURSE_LOG.md` §2: §1.1 evaluates R
and C, §1.2 forms P = R − C, §1.6 solves for break-even.

**Researched 2026-08-31. The approach survives; three things about it must
change, and one of them is a repair I proposed and got wrong.**

**Good news first: the population worry was unfounded.** The only large
first-year undergraduate study of problem-before-instruction (Chowrira et al.
2019, *npj Science of Learning*, N=574, CC BY) found its **largest** effect in the
**lowest-achieving third** — b = 8.28, 95% CI [3.68, 12.89], p < .001, bigger than
for middle or high achievers. Do not abandon this on the grounds that our
students are under-prepared. (Two caveats: quasi-experimental, and the
"persisted to the final exam" claim rests on p = .060 with a CI crossing zero.)

**⚠ But the target is procedural, and that is exactly where the null is.**
Sinha & Kapur's meta-analysis of 53 studies: overall **g = 0.36**, but
**procedural knowledge g = −0.03, non-significant across 51 comparisons**.
Kapur's own flagship mathematics study reports procedural p = .896. Independently,
the strongest undergraduate RME study found students reinvented Euler's *method*
but flatly **did not reinvent symbolic technique**. **Students reinvent methods
and models; they do not reinvent manipulation.** `P = R − C` is the first kind.
Subtracting two polynomial expressions is the second.
**Consequence: this activity's justification is conceptual, not procedural. It
will not make students better at subtracting polynomials, and it must not be
sold as though it will.**

**⚠ Three defects in the sequence as written.**

1. **The task affords only one answer.** Three literatures state the same
   eligibility condition independently: tasks not affording multiple solution
   methods pool at **−0.11**; the five-practices model requires "multiple
   possible responses"; and Gravemeijer warns that without variety the teacher
   "will have to ask leading questions to solicit the preferred responses."
   **Fix: give two competing options to choose between** — e.g. two cost
   structures, `C = 7x + 4000` against `C = 11x + 2000`, and *which should the
   shop print, and for which `x`?* They cross at `x = 500`, the number already in
   use in §1.1.
2. **"Hoping" has a name in the literature.** Brousseau's **Topaze effect** —
   the teacher cannot end on failure and cannot leave time empty, so the answer
   gets fed. The likelier failure here is **Jourdain**: a student says "you take
   one away from the other", it is credited as the target, and afterwards nobody
   can tell whether it was really there. Base rate for high-demand tasks
   declining during implementation: **36 of 58, 62%**.
   **Fix: decide in advance which approach you will supply yourself, and then
   supply it.** Kapur's own canonical study reports that **none** of the
   problem-first students produced the canonical solution — the method is built
   on the target *not* arriving and on the telling that follows.
3. **It contradicts §2 of this file.** §2 says situation, then work, then the
   name — never the name first. §3.2 as written asks students for **the name** of
   an operation. Move the target from the operation to the **modelling decision**
   (which cost structure, and when), and let the subtraction be told afterwards.

**⚠ THE NUMERIC-REHEARSAL REPAIR ABOVE WAS WRONG AND IS WITHDRAWN.** A bare
arithmetic warm-up before algebra measurably *hurts*: **24% against 46%** in one
randomised undergraduate experiment, and in another — warm-up built from the exact
arithmetic the problems needed, unlimited time, 93rd-percentile students —
**2.43/6 against 3.14**, η²p = .11. Küchemann's own control removes the stated
rationale as well: making the answer numerical did **not** make a matched item
easier (41% against 41%). The obstacle is operating on an unevaluated letter, and
rehearsing arithmetic does not touch it.

**What replaces it, and it is a near miss rather than an opposite.** Koedinger &
Anderson ran this manipulation and **won — 26% against 5%** — with a different
shape: **two** numeric instances, kept **side by side** with the symbolic form,
and the expression presented **as the generalisation of the steps just
performed**. So keep §1.1's two numeric instances (`x = 500` → 1500,
`x = 250` → −1250) and show them **beside** `18x − (7x + 4000)` as its
generalisation. Not a warm-up that finishes before the algebra starts.

### 3.3 Quadratics, from the same bookstore

> **[owner · progression]** Now with the same example we can continue to
> quadratic equations and use ideas like vertex — to ask how to maximise profit —
> and the points where the profit is zero.

**This closes the loop on where `x²` comes from, and it is the strongest part of
the design.** If the price of a book is fixed, revenue is price times quantity,
which is *linear* — there is no `x²` anywhere. A quadratic appears exactly when
**price itself depends on how many you sell**: drop the price and you sell more.
Then revenue is (price that depends on `x`) × (number sold), which is a product
of two things that each depend on `x`, and that product is a quadratic.

So the answer to *where does `x²` come from in this story* is: **from multiplying
two quantities that each depend on `x`** — not from squaring a count. This also
resolves the dimensional oddity of "`x²` books", because the squared term arises
in revenue, measured in money, not in a count of objects.

**⚠⚠ RESEARCHED 2026-08-31, AND THE RECOMMENDATION ABOVE IS OVERTURNED IN TWO
WAYS. Keep revenue LINEAR in §1.2.**

**First: in every published business quadratic, the variable is the PRICE, not
the quantity.** OpenStax College Algebra 2e §5.1 — verified on the page — writes
`Revenue = −2,500p² + 159,000p` and defines "*p for price per subscription and Q
for quantity*", with quantity a function of price. Illustrative Mathematics: "if
they charge `x` dollars for each download…". Yoshiwara: `R = p(40−p)`. **The
squared letter is a price in dollars, never a count of goods.** Across everything
opened, the letter and its square never name the same noun — PISA has `n` = rows
and `n²` = trees; OpenStax elsewhere has `x` = feet and `x²` = square feet.
**Nobody writes "`x²` books."** So the §1.2 framing where `x` is the number of
books cannot also be the framing that produces the quadratic.

**Second: nobody builds a business quadratic at the polynomial-arithmetic
stage.** OpenStax's own §1.4 *Polynomials* — the direct counterpart of our §1.2 —
opens with a little free library, `A = s² = (2x)² = 4x²`, and a word count over
the whole section returns **revenue 0, cost 0, price 0, sell 0, sold 0, area
13**. Its revenue quadratic waits until Chapter 5 and needs a two-point linear
demand fit first; IM defers it to lesson 7 of 17. **May & Bart state the rule in
print: "If the demand price is a linear function, then revenue is a quadratic
function," and "if the slope of the demand curve is 0… the revenue curve will be
linear."** `R = 18x` at a fixed price is correct and should stay linear. Forcing
a quadratic into it imports a demand relation §1.2 has no objective for.

**⭐ What to do instead: introduce `x²` as an `x`-by-`x` array of the goods, on
the PISA APPLES model** — already in the local harvest, released, and adaptable
under OECD terms. `n` is pinned to "the number of **rows** of apple trees";
`n²` is the number of trees; and **`8n` sits beside it in the same picture**,
forcing the quadratic-against-linear discrimination inside one context. That is
precisely the comparison this section needs and the one thing a machine that
squares cannot do. Its difficulty gradient is the caution: OECD/US percent correct
runs **50/53** for filling the table, **25/24** for solving `n² = 8n`, and
**13/15** for explaining which grows faster.

**And the notes already own the payoff without ever setting it up.**
`1.2-polynomials.tex` line 287 puts `\figareamodel` — with its `x²` corner cell —
at **objective 5**, and line 306 has `\figsquarebinomial`. But `x²` is first *met*
on line 38, in the opening table, as `−3x²+485x−325`, "a cost that does not rise
in proportion to volume" — **a fitted curve with no mechanism behind it.** The
hook already exists one row above, at line 37: `2w²+10w`, "area of a rectangle
whose sides are related."

**A caution on the array route specifically.** Vergnaud's product-of-measures
warning applies: a count times a count is legitimate but is the hardest structure
in the field — "simple proportion should come first." So draw the array, but keep
the arithmetic as **`n` rows of `n`**, iterated proportion, rather than as a
Cartesian product of two sets. And the array does **not** carry meaning by
itself: on NAEP grade 12, only **47%** pick the subdivided rectangle for
`(x+2)(x+4)` and **21% pick a line**; on grade 8, **48%** pick `4×6` for the area
of a 6-by-4 rectangle and **26% pick the perimeter**.

**On the magic box, the verdict is upheld and on better grounds than we used.**
The literature that endorses function boxes endorses them *because* they hide the
mechanism: two boxes "are 'the same' if they have the same output for each input
in the domain, **regardless of the particular inner workings of the box**." A
device engineered to make the rule irrelevant cannot be the device that explains
what the rule means.

**⚠ One honest qualification about the money route, if it is used later: it
moves the strangeness rather than removing it.** If price is `a − bx` dollars
per book, then `bx²` is dollars — fine. But `b` now carries the units **dollars
per book squared**, and nobody explains what that is. A business-calculus text in
wide use (LaTorre et al., *Calculus Concepts*) writes *"dollars per unit
squared"* across seven editions **without ever unpacking it**, and a targeted
search found **no source in economics or economics education that asks what the
coefficient of a squared count means.** In economics the question is openly
disputed in print: Barnett argues *"the squares of man-hours and of years are
meaningless concepts"* and that `t²` having a physical meaning *"does not in any
way help us find meaning for t² in the world of the social sciences"*; Folsom &
Gonzalez reply, refereed, that parameter dimensions *"need not be
understandable"* and *"simply are whatever they need to be."*
**Practical consequence: the squared term is safe because revenue is money — do
not open the units of the coefficient.** No published treatment supports doing
so, and the design does not need it.

**The related finding, which supports the whole enterprise.** That quantities can
scale as the square rather than linearly is genuinely hard at university level.
On a physics-department item asking which quantities grow by 1.5 when a flag's
length and width both grow by 1.5, **only 26% of students were completely
correct, and it did not improve across a year — 25%, 25%, 31% across three
quarters** ("suggesting that this kind of reasoning does not improve"). *Read
the caveat honestly:* the published failure modes are students **not** selecting
the linear options, and **the rate at which they wrongly picked the area option
is not reported**, so this evidences difficulty with proportional reasoning
broadly rather than the area error specifically.

And the two features the owner names are the two questions the bookstore
actually has:

- **the vertex** is *how many should we sell to make the most profit*
- **the zeros** are *how many must we sell to stop losing money*

Neither needs to be introduced as a property of parabolas. Both are business
questions whose answers happen to be a vertex and a pair of roots — which is
precisely the "notice the maths later" principle applied.

### 3.4 Abstraction, last

Once the same shape of work has been done for revenue, for cost, and for profit,
`f(x)` is introduced as the observation that these were all the same kind of
object. Domain and range then come from the situation and not from a definition:
the domain is *how many books it is possible to sell* — a whole number, not
negative, bounded by what the shop can stock — and the range is *what profits are
actually attainable*, which is where the vertex reappears as the maximum.

## 4. Exponent rules: derive by expansion, never state first

> **[owner · pedagogy]** For the exponent rules we will have to think about ways
> to present that — maybe visually, like decomposing into different components.
> For example for `(x²)³`, before getting into the formula we can ask them to use
> the definition of exponent to do `x²·x²·x²` and then decompose further. Even if
> they have not had the adding-the-exponents part, if they decompose `x²` they
> would get six of those.

**The derivation's claim — and it is a HYPOTHESIS, not a finding.** `x² + x²` and
`x² · x²` get swapped because they present as two similar-looking rules. Written
out, they stop resembling each other:

    x² + x²  is  (x·x) + (x·x)   — two of the same object
    x² · x²  is  (x·x)(x·x)      — four factors in a row

The argument is that a student who counts never has to remember which rule goes
with which sign. **⚠ Checked 2026-08-31: this specific claim has never been
tested.** Weber's experiment (below) compared two *multiplicative* rules against
each other; the addition-versus-multiplication dissolution is ours, the error is
measured repeatedly in the literature, and it is remediated in **no controlled
study**. Treat it as the design's central bet, not as established.

Supporting evidence, verified: Weber (2002, ERIC ED477690) studied 15 students in
a university pre-calculus course and found that **every one could compute `2³`,
and "not a single student could explain why any of the rules of exponents and
logarithms were true."** Asked whether `(1/2)^x` increases or decreases, all 15
answered correctly and **only 2 could say why** — and saying why requires exactly
the process reading that expansion installs. Separately, the one genuine meaning
item in the OATutor bank has, as its scaffold hint, the words **"Count the b's."**

**⭐ THIS HAS BEEN TESTED, AT THIS LEVEL, AND THE WORKSHEET IS THE OWNER'S
PROPOSAL VERBATIM.** Found 2026-08-31: Weber's promised follow-up **was**
published — ERIC **ED471763**, PME-NA 24, 1019–1027, free full text. The
2026-08-30 sweep had logged it as a minor "companion" to ED477690; **it is the
experiment.** Population: **a college algebra and trigonometry course**, two
sections, different instructors, 15 volunteers each, interviewed three weeks
after instruction. Its worksheet reads:

> `4^3 = 4×4×4 =` the number that is the product of **3 factors of 4**.
> "Simplify each of the expressions below by writing each exponential term as a
> product. **Summarize each simplification in words.**"
> `b^2 b^4 = (b×b)×(b×b×b×b) = b^6` — "The product of 2 factors of `b` and 4
> factors of `b` is 6 factors of `b`."

**Result: "Not a single student in the control group was able to explain why any
of the rules of exponents were true."** Experimental: **8 of 15** explained
`b^x b^y = b^(x+y)`; 6 explained why `√x = x^(1/2)`, which the activities never
taught. On whether `5^14` is odd or even, 8/15 against 3/15 — **12 of 15 controls
thought it was even.**

**And the mechanism was observed directly.** Three experimental students who
believed `b^x b^y = b^(xy)` "wrote out `b^x` as `x` factors of `b`… realized that
there were `(x+y)` factors… so the correct answer must be `b^(x+y)`. **In
contrast, this phenomenon did not occur with any of the students in the control
group.**"

**The caveats travel with the citation.** No pre-test, not randomised,
volunteers, and the author was instructor, investigator *and* grader — he says so.
It is a **bundle** (programming + worksheets + pair work + graded feedback), so
the worksheet's own contribution is not isolated. The replication it promised was
never published. **And two gaps matter for us specifically:** Weber tested two
*multiplicative* rules against each other — **the claim that expansion dissolves
`x^2 + x^2` versus `x^2 * x^2` is still untested**; and his worksheet contains
**no power-of-a-power item at all**, so `(x^2)^3`, the owner's opening example, is
the one case he never ran. Sound, but not the evidenced starting point.

**⚠ Where counting stops meaning anything, and it fights us at `x^0`.** Elstak's
college-level interviews found students reasoning that zero factors "meant that
there are zero factors and the value should be *nothing or zero*" — the image
actively resists `a^0 = 1`. The cliff, from Cangelosi's College Algebra column
(n=128): `(4x^3)^2` — the only positive-integer item — **55%**, against
`4^0 − 4^(-1)` **17%**, `8^(-1/3)` **19%**, `(-4)^(3/2)` **8%**; Section A overall
**26%**. Weber declines the bridge in writing ("beyond the scope of this paper").
The four bridges published curricula actually use are **quotient-rule collision**,
**permanence** (EngageNY refutes `x^0 = 0` and `x^0 = 3` by contradiction before
defining — the only one that makes the definition *forced*), **continue the
pattern**, and **reinterpret what is counted** ("just as `10^2` is two factors
that are 10, `10^(-2)` is two factors that are 1/10"). The last keeps this
course's register alive across the gap.

### 4.1 What this changes in the notes — less than expected, and one gap is sharp

Checked against `notes/1.2-polynomials.tex` directly. **The notes already do most
of it:** `a^n` is already defined as "a used as a factor n times";
`b^4·b^6·b^7` is already worked as "4+6+7 = 17 factors of b" **one slide before
the rule is stated**; the text already says "counting the factors is the proof";
and `\figcountfactors` already draws `x^4·x^3 → x^7`. Three gaps:

1. **The expansion is asserted in prose but never performed by the student.**
   `\pfull` already gives ruled space and the macros are order-agnostic, so
   `\worked` can precede `\statement` with no template change.
2. **No figure and no student work for `(x^m)^n`** — only a prose clause.
3. **⭐ `x^2 + x^2` and `x^2 * x^2` never appear together.** They sit about 140
   lines and three objectives apart. **If the hypothesis is that writing both out
   dissolves the confusion, they have to be adjacent.** This is the single
   cheapest change in the whole file.

### 4.2 The `STYLE.md` rule 12 conflict dissolves — on the course's own Rule 0

Rule 0 says: *"When both a concrete statement and an abstract summary of it
exist, keep the concrete one and delete the summary. **Do not lead with the
summary.**"* The expansion **is** the concrete statement; `(a^m)^n = a^(mn)` is
the summary. Rule 12's target was different — it deleted a slide that *argued in
words* that a rule would be needed, and its own test is "cover the slide and ask
what a student cannot do without it." **Cover the expansion and a student cannot
get `x^6` except by trusting a formula.** Motivation is *about* a rule; a
derivation *produces* it. **No conflict — and Rule 0 actively requires the
derivation to come first.**
The one design constraint the literature attaches: this is a **generic proof**,
and "it is essential to take the step from (generic) explanation to formal
proof." **State the rule explicitly straight after the expansion.**

## 5. What the student is asked to do

The published items below are reproduced unchanged and licensed for this use;
see `COURSE_LOG.md` §2 for the full licence position. **Prefer a published item
with a known baseline over an invented one.**

| Kind | Example | Source and baseline |
|---|---|---|
| Does this notation say what you think | *Does `x·x` equal `2x` for every `x`?* | NAEP M0757CL, **31%** got all three parts |
| Repeated addition vs repeated multiplication | *`k+k+k+k+k` can be written as…* with `k⁵` offered | TIMSS 1999 P11, **intl 57 / US 46** |
| …its matched twin | *equivalent to `n·n·n`* with `3n` offered | TIMSS 1999 P09, **intl 71 / US 85** |
| What does a letter stand for | *`k + (k+2) + (k+4) = 84` — what does `k` represent?* | TIMSS 2003 M022002, **intl 24 / US 23** |
| Match expression to situation | *`80n` could represent…* | NAEP M169401, **44%** |
| Coefficient and exponent in one step | *`2a² × 3a =`* with the 2×2 error grid | TIMSS 2007 M032198, **intl 47 / US 42** |
| Build an expression from the story | *`x` bags of `x` books — how many?* | ours |
| Computation | *simplify `2x² · 3x²`* | ours |

> **[owner · structure]** The computational problems will stay.

They stay, but **after** the meaning questions, never as the whole instrument.


## 5.1 Aspects: what else is inside a question

> **[owner · structure]** Currently we just have back-to-back questions, but I
> want to give options where students can know more about that particular
> question from different aspects of mathematical understanding. For example
> here, the understanding would be that in general these letters can be used to
> represent something, they are called variables, and two other variables can add
> up to give another variable. So that hidden part is there. In a similar way, in
> every single maths problem there are so many aspects of that thinking.

**A question is a door, not a hurdle.** Every item in this activity has more
inside it than the answer it asks for, and a student who wants to look should be
able to. This is the reflection idea in a form that can actually be authored:
**depth on demand rather than a branching trajectory.** Nothing is required,
nothing is scored, and the run of questions is unchanged for a student who never
opens one.

### The six lenses

Not every question earns all six. Two or three is normal; the point is that the
lens is *named*, so the aspect is a deliberate authoring choice rather than
whatever occurred to the writer that day.

| lens | the question it answers |
|---|---|
| **the letter** | what is the letter doing here &mdash; naming a quantity, standing for an unknown, or standing for any number at all |
| **in general** | the property underneath, which holds well beyond this problem |
| **what kind of thing** | units, and what sort of object the answer is |
| **the picture** | the array, area or graph reading of the same fact |
| **what if** | change one thing and see what moves |
| **again later** | where this exact idea returns in the course |

### How an aspect is designed, not chosen

The six lenses are a **checklist for auditing**, not a form to fill in. Writing
one aspect per lens because the lens exists is how the bad ones got made. The
procedure, in order:

1. **Name what the question tests.** For *"Which is larger, `2x` or `x + 2`?"*
   it tests whether a student knows the value depends on `x`.
2. **Name what a student who answers it correctly still might not know.** That
   the two are **equal at `x` = 2**; that *which is larger* flips at that point;
   that finding it is solving an equation. **If this list is empty, the question
   gets no aspects.** Most `Simplify` items are in that position, and that is
   fine.
3. **Only now choose the lens** that fits what step 2 produced, and write one
   aspect per item on that list. Two is common. Five means the question is
   unusually rich, not that five lenses were available.

**The failure this replaces, recorded because it is easy to repeat.** On that
same question I wrote, under *the letter*: **"`x` here is not one number waiting
to be found."** Two things wrong. *Waiting to be found* is a category the
student has never met and the course never uses &mdash; it is invented
vocabulary. And the question's own correct answer already reads *"It depends on
`x`"*, so the aspect restated the answer it had just been given. It has been
deleted, along with the *in general* aspect beside it. That question now carries
**two** aspects instead of four, and both say something the answer did not.

**Deleting is the normal outcome.** A question with no aspect is better than a
question with a filled slot.

### Worked examples

**`Profit is what is left once the costs are paid. Call it P. Write P using R and C.`**

- **the letter** &mdash; `R` is not something to solve for. It is a **name for an
  amount**. Most letters students meet are unknowns waiting to be found; these
  are quantities being labelled so they can be talked about. Both uses are
  ordinary and they are not the same use.
- **in general** &mdash; a relationship between quantities can be written **before
  any of them is known**. `P = R - C` is true whatever `R` and `C` turn out to
  be, which is the entire reason for using letters at all.
- **what kind of thing** &mdash; `R` is dollars, `C` is dollars, so `P` is
  dollars. Two quantities of the same kind combine to give that same kind. You
  could not subtract books from dollars.
- **what if** &mdash; write `C - R` instead and the number is the same size with
  the opposite sign. It answers a different question: *how far short did we
  fall.*
- **again later** &mdash; `f(x)` is this move again, with the naming made
  official.

**`The shop has x shelves, and every shelf holds x books. How many altogether?`**

- **the letter** &mdash; the same `x` is doing **two different jobs at once**:
  how many shelves, and how many books on each. Same number, two roles.
- **the picture** &mdash; a rectangle of shelves by books. `x^2` is an **area**,
  not a number multiplied by itself twice for no reason.
- **what kind of thing** &mdash; shelves times books-per-shelf gives books. The
  answer is still a count of books.
- **what if** &mdash; make it `x` shelves of 5 books and the answer is `5x`, not
  `x^2`. The square appears only because **both** numbers move together.

**`Which is larger, 2x or x + 2?`**

- **the letter** &mdash; here `x` stands for **any number**, not a particular one.
  That is a third use of a letter, different again from a name and an unknown.
- **in general** &mdash; an expression with a letter in it does not have *a*
  value. It has a value for each `x`.
- **the picture** &mdash; two lines crossing. Which is on top depends on which
  side of the crossing you are.
- **what if** &mdash; ask where they are **equal** and you are solving
  `2x = x + 2`. The comparison question and the equation are the same question.

**`Tidy 18x - (7x + 4000) into a single expression.`**

- **in general** &mdash; taking away a bundle takes away **every part of it**.
  That is the distributive property, doing its work through a minus sign.
- **the letter** &mdash; `18x` and `7x` combine because they count the same
  thing; `4000` has nothing to pair with and stays as it is.
- **what if** &mdash; drop the bracket and the rent gets **added** instead. At
  250 copies that is $6,750 rather than a $1,250 loss &mdash; out by $8,000,
  which is twice the rent.
- **again later** &mdash; every polynomial subtraction in §1.2 is this same step.

**`The press sells each copy for $18. What is R?`**

- **what kind of thing** &mdash; 18 is dollars **per copy**, `x` is copies, so
  `18x` is dollars. The units multiply out.
- **in general** &mdash; double the copies and the money doubles. That is what
  makes this relationship linear, and it is why `R = 18x` has no constant on the
  end.
- **what if** &mdash; sell nothing and `R = 0`. A model has to be right at its
  edges, and this one is.

**`Where does the x^2 come from?`**

- **in general** &mdash; multiplying two expressions that each contain `x`
  produces an `x^2`. Degree one times degree one gives degree two, every time.
- **the picture** &mdash; 500 copies with $1.25 off each is a rectangle: 500 by
  1.25, which is the $625 given away. **That rectangle is the squared term.**
- **again later** &mdash; the `x^2` is what bends the profit curve over, which is
  why there is a best number of copies at all. That is §1.6.

### Aspects held back for later sections

An aspect must not lean on machinery the course has not reached. These were
written, judged out of sequence, and parked here rather than deleted &mdash;
they are good material in the wrong section.

**For the graphing section, on `Which is larger, 2x or x + 2?`** &mdash; removed
from §1.2 on 2026-08-31 because graphing has not been taught: *"Draw both and you get two straight lines. They cross at `x` = 2, where each is worth 4. Left of that `x + 2` is on top; right of it, `2x`."*
The question itself belongs in §1.2; only this reading of it has to wait. It
would make a strong first item wherever two lines are first drawn together.

**The rule it establishes:** before writing an aspect, check that everything it
mentions has already been met. `x^2` as an **area** is fine at §1.2 &mdash; area
is arithmetic. Two lines **crossing** is not, because that is a graph.

### Authoring rules for aspects

1. **⭐ It must say something the question did not.** This is the test that
   separates a good aspect from a bad one, and it was learned the hard way.
   Compare, both authored on 2026-08-31:

   > *bad* &mdash; on `Call the money coming in R`: "`R` is the name of an
   > amount." The student was **just told that**. The aspect restates the
   > question and adds nothing.
   > *bad* &mdash; "`R` is dollars, `C` is dollars, `P` is dollars. Dollars less
   > dollars leaves dollars." A tautology dressed as an insight.
   > *good* &mdash; "`R` and `C` can never be negative &mdash; you cannot take in
   > less than nothing. `P` can. At 250 copies `P` is -1,250, and that minus
   > sign is the whole point of tracking it."
   > *good* &mdash; on `x` shelves of `x` books: "3 shelves of 3 was a 3-by-3
   > block of 9. `x` shelves of `x` is the same block with its side unknown, so
   > `x^2` is an **area**."

   **The check: cover the question. Does the aspect still tell you anything?**
   If it only makes sense as a paraphrase of what was just asked, it is not an
   aspect. Aim for the fact a student would not have arrived at alone &mdash;
   that `x^2` is an area, that profit can be negative while revenue cannot,
   that the square needs *both* numbers to move.
2. **Answer-independent.** An aspect explains the mathematics, not the student's
   attempt. It reads the same whether the question was right or wrong.
3. **Opened only after an answer is committed** &mdash; the owner's ruling,
   2026-08-31: *"the aspects should come after the student answers the
   question, regardless of whether they get it right or wrong. We won't say
   if they got it right or wrong there though."* So answering earns the
   depth, and the aspect can never be worked as a hint. It says **nothing**
   about whether the answer was right; correctness still waits for the
   checkpoint, which keeps §6's batching intact.
4. **Short.** Two or three sentences. An aspect that needs a paragraph is a
   note, and notes belong in the notes.
5. **Concrete, in the register of `STYLE.md` §7** &mdash; state the mathematics,
   show the arithmetic, and never open with what the aspect is *about*.
6. **Name the lens.** Authoring against six named lenses is what stops these
   becoming whatever occurred to the writer that morning.


## 5.2 Factoring: the GCF widget, and the road to a &ne; 1

> **[owner · scope]** We are going to make this factorization a section on its
> own. For now it can stay there, but later we will separate it for
> factorization / product from the one we have now, polynomial.

**Not yet split. Set 7, "What they share", currently lives inside the §1.2
activity and will move to its own §1.3 activity later.** Nothing about the
questions changes when it moves; only which page they sit on.

### What §1.3 is actually doing, and why one widget covers it

Reading `notes/1.3-factoring.tex`: **GCF is not a preliminary topic, it is the
engine.** The same operation runs the whole way to `a &ne; 1`, and only *what is
shared* changes:

an `x` &rarr; a **number and an `x`** (`2x` from `4x^2 + 10x`) &rarr; a term that
is **entirely shared**, leaving a **1** &rarr; a **negative** factor &rarr; a
factor out of **each pair** of four terms &rarr; and then a **bracket**, which
the notes state outright: *"the shared bracket is itself a common factor."*

Then `a &ne; 1` is **not a new method**. Splitting the middle term using `ac`
manufactures four terms *so that grouping becomes available*, and grouping is
this same operation twice &mdash; a monomial from each pair, then the bracket
from both. The notes' own slide makes the point that the middle line is
identical in the multiplying and factoring columns.

**So the widget treats `2`, `x` and `(2x+5)` as the same kind of thing:** a chip
that either appears in every term or does not. That is the whole design.

### The interaction, and two things it must never say

A term is written out on its own click, one at a time. A factor present in
**every** term can then be **written once, out front**. When nothing more is
shared, a final line collects the factors back up &mdash; `x &middot; x` becomes
`x^2`, `2 &middot; 2` becomes 4 &mdash; so the chain ends in the form a student
writes.

1. **Never "take out" or "take away".** Nothing is removed; `4x^2 + 10x` and
   `2x(2x+5)` are the same expression. What happens is that a factor appearing
   in every term is **written once instead of twice** &mdash; the distributive
   property read right to left, which is how the notes put it. The owner
   rejected the removal framing and he was right.
2. **Every earlier line stays on screen**, dimmed, the way a worked example
   keeps its working, and the first line is pinned to the expression as given.
   The chip about to move is marked in each term, so the eye can follow it from
   one line to the next.

### The seven, in order

`x^3 + x^2` (an `x` only) &rarr; `6x + 9` (a number only, and the `x` **cannot**
come out) &rarr; `4x^2 + 10x` (both) &rarr; `4x^2 + 4x` (a term used up, leaving
**1**) &rarr; `6x^3 + 9x^2 + 3x` (three terms; the shortest limits all) &rarr;
`-6x - 15` (a **negative** common factor) &rarr; `2x(2x+5) - 3(2x+5)` (a
**bracket**).

**The last three are the notes' grouping example, split across the widget.**
`4x^2 + 10x` gives `2x(2x+5)`; `-6x - 15` gives `-3(2x+5)` &mdash; *the same
bracket*; and the seventh question is those two pieces added, where the bracket
comes out. **Grouping therefore needs no new widget, only the right sequence.**

### What is still missing

**Splitting the middle term.** `2x^2 + 7x + 3` &rarr; find two numbers
multiplying to `ac` and adding to `b` &rarr; `2x^2 + 6x + x + 3` &rarr; group.
That is a preparation step in front of the existing widget, not a new mechanic,
and it is the last rung before `a &ne; 1`. Also absent: `a = 1` quadratics, and
**factoring out the GCF before looking for two numbers** (`3x^2 + 15x + 18 =
3(x^2 + 5x + 6)`), which the notes place at objective 2.

## 6. Structure: sets, checkpoints, and no score

> **[owner · structure]** We will let students see the answer after a certain
> number of questions. But let's not collect any scores. At the end students will
> be able to see what topics they are good at, and what topics and types of
> problem they might need to look at more.

Three properties, each doing distinct work.

**Answers are batched, not per question.** Immediate feedback measures *can you
do this with help* rather than *what do you actually think*, and right-wrong
delivered one at a time is a score arriving in instalments. Answering several
before seeing any forces real commitment, and lets a student see their misses as
a **set** — which is when a pattern becomes visible. One wrong answer is an
accident; three that failed the same way is a finding.

**Nothing is collected.** Not merely "no score displayed" — nothing stored. If a
student believes anything is recorded, some will answer safely rather than
honestly, and the instrument only works if the answer is the student's real
belief. **Not collecting is what makes the information true.**

**The ending is worked examples, not a scorecard.** A first draft sorted topics
into buckets; the owner judged it *demotivating and not so useful* and asked for
examples. The final screen now shows the actual expressions that came out
differently, worked, grouped by idea — material to take away rather than a
verdict on the student. No numbers appear on it.

**Where branching survives.** Not per question. The one branch sits at the first
checkpoint and reads four distinguishable states off the TIMSS matched pair.
Four screens, not the reflection's fifty-two.

## 7. Register and wording

`STYLE.md` governs, in particular Rule 0: state the mathematics, do not
characterise it. Three additional laws this work has forced.

**The letter is *the number of* the thing, never the thing.** Write *"take `x` to
be the number of books"*. Never *"`x` = books"*. Küchemann's `4c + 3b` item —
*cakes cost `c` pence, buns cost `b` pence* — drew **22% correct and 39%
answering "4 cakes and 3 buns"**, and McNeil et al. (2010, randomised, N=322)
found **mnemonic letters scored 37% against 56% for non-mnemonic ones**. The
mnemonic *caused* the drop. A student holding `x` as *books* cannot tell `x²`
books from books-squared, which is the very distinction the unit is about.

**Ask a real question.** Not *"Write what comes in."* &mdash; nobody says that.
*"The press sells each copy for $18. If it sells `x` copies, how much money comes
in?"* The fault is the same one that produced "two factors beside three factors
make five": sentences bent out of shape to dodge the second person, until they
stop being English. **`STYLE.md` forbids second-person *lecturing*, not
second-person questions** &mdash; a question put to a student is an instruction,
which the rule explicitly allows. So *"how many books do you have?"* is correct
and *"write the number of books"* is not. Prefer **how much / how many / what
is** over **write / state / give**, and name the thing being asked about rather
than gesturing at it: *"where did the other $625 go?"* beats *"why the gap?"*

**Show the arithmetic; do not summarise it in words.** An explanation here is
usually a line of algebra, not a sentence of English. *"Two factors beside three
factors make five"* is bad writing because a student must translate it back into
the expression they were already looking at. `(x·x)(x·x·x)` is the explanation.
For adding, anchor to a numeric twin the student already trusts: `x² + x²` is
`2x²` **the same way `7 + 7` is `2·7`**.

**Never print the design decision on the page.**

> **[owner · pedagogy]** One of the frequent mistakes the sessions have been
> making is making everything explicit — things that were instructions.

A draft opened with *"Nothing is scored and nothing is recorded"* and *"Answers
appear at the end of each set"*: the design brief read back to the student. A
colour legend did the same to the visual encoding. Announcing a property turns a
fact into a claim and spoils the effect it describes. **Test: if the sentence
would appear in the design brief, it does not belong in the product.**

## 8. The visual

> **[owner · visual]** I want to make it visually more interesting for the
> students too. For example a tree gradually growing on the side, that the
> student can visually see the representation of their understanding, with red
> and green and other colour flowers.

**RULED, 2026-08-31.** The plant responds to the student's work, and the aesthetic
is retro:

> **[owner · visual]** We can create like retro, Mario, Minecraft style light
> visual. As the student progresses, correct one adds a flower and incorrect a
> red flower or something.

> **[owner · visual]** One tree gets leaves, flowers attached — kind like a plant
> getting bigger.

**One plant that accumulates, not a garden of cells or one plant per question.**
This is the configuration with the best evidence behind it, and it was arrived at
by taste before the research came back. A **private, self-referenced growth
display** avoids the one ingredient the literature consistently blames:
normative comparison. Shute concludes that low-achieving students "should not
receive normative feedback but should instead receive self-referenced feedback";
Jivet found bottom-performing learners "felt demoralised and stressed" by
norm-referenced displays specifically. And in the one tally of element-level
outcomes, **progress and status displays are the cleanest element in the
literature — 5 positive, 2 mixed-positive, 1 null, and zero negative results
across 8 studies.**

The derivation had argued against a correctness-driven plant, on the ground that
it is a score with better art. **The owner has ruled otherwise and the ruling
stands.** What survives from that objection is not an argument but three
constraints, which are matters of mechanism rather than taste:

1. **⚠ It must not reveal correctness before the checkpoint.** §6 withholds
   answers until a set ends so a student commits without a safety net and then
   reads their misses as a pattern. A flower that turns red the instant an answer
   is given is per-question feedback and destroys that. **Resolution being
   built: a colourless bud plants on every answer, so progress shows at once,
   and the buds bloom — colour arriving — at the checkpoint.** This satisfies
   both decisions; if a better resolution appears it replaces this one.
2. **Colour is never the only channel, and for two separate reasons.**
   *Accessibility:* WCAG 2.2 SC 1.4.1 (Level A) names this exact case — its
   Understanding page states that where content relies on distinguishing
   colours, "an additional visual indicator will be required **regardless of the
   contrast ratio**", giving *"whether an outline is green for valid or red for
   invalid"* as the example. A lightness difference is **not** an adequate second
   channel here. The NEI puts colour-vision deficiency at **about 1 in 12 men**;
   note it is strongly ancestry-dependent (Xie et al. 2014, N=4177: **5.6%** of
   non-Hispanic White boys but **1.4%** Black, **2.6%** Hispanic, **3.1%**
   Asian), so 8% is the upper end rather than a flat rate.
   *And a mathematical reason that matters more here:* **colouring the parts of a
   figure is documented to induce the ADDITIVE reading** — the very reading §4
   exists to displace. Mielicki et al. (2021, N=72) found that shading a figure
   pushed students to write `3x + 4x` where `7x` was available, dropping them to
   **48%** against **94–95%** unshaded. Encode with **fill, shape and position**
   instead, as the Shell Centre materials do.
3. **It must not disturb the mathematics.** It sits in the margin. No layout
   shift, no motion while a question is being read, and it respects
   `prefers-reduced-motion`. Register still applies: **the plant says it without
   words** — no praise, no encouragement, no second person.

**⚠ THE BRANCHING PLANT WAS MY IDEA AND THE EVIDENCE IS AGAINST IT.** Research
returned 2026-08-31. A stem splitting into `x` branches, each splitting again,
does give `x^n` tips — the mathematics is right. **The picture is already taken.**
Branching-and-doubling is the field's canonical image for **exponential growth
over generations**, `2^n` — the chessboard-and-grains diagram — which is exactly
the reading we are trying to keep away from `x^2`. Worse, a tree draws `x^n` and
`n^x` with the *same picture type*, differing only in which parameter varies, and
at `x = 2, n = 2` they are literally the same tree: the first case a student
meets is the one where the distinction collapses. A tree also forces `x` to be a
counting number — you cannot draw 1.5 branches — which is the argument
Illustrative Mathematics itself makes in its commentary on *Seeing Dots*, noting
that replacing "numbers of dots" with "areas of regions" gives a version that
"works for all positive real numbers". **Do not build the branching plant except
as a deliberate contrast.**

**⭐ WHAT TO GROW INSTEAD: an assembly of AREA.** Let the thing built during the
activity be a figure that gains regions — an `n`-by-`n` square, then strips, then
the four regions of `(n+6)^2`. This is not decoration: §1.2's largest objective is
**O5, multiply polynomials, at 13 problems**, with add/subtract beside it, and the
area model *is* the representation for those objectives. A branching tree serves
neither.

**And the add-versus-multiply distinction is already solved visually, in licensed
figures, without colour.** MAP/Shell Centre's *Interpreting Algebraic
Expressions* Card Set D draws `3n^2` as a **row** of three `n`-by-`n` squares and
`(3n)^2` as a **3×3 array** of the same square; and — the figure worth stealing
the idea from — `n^2 + 3^2` as **two disjoint squares that refuse to tile a
rectangle** against `(n+3)^2` as **one connected square**. The whole distinction
is carried by whether the pieces assemble, not by hue. Its companion lesson
encodes two summands as **filled versus hollow dots**.
**Licences:** MAP/Shell Centre is CC BY-NC-ND 3.0 — reproduce **unmodified only**,
so show or hand out the page but do not redraw or recolour the cards. The Swan
2005 Standards Unit original permits **extracts** but still not adaptation.
**Illustrative Mathematics *Seeing Dots* is CC BY-NC-SA 4.0 — the only one of the
three we may legally redraw.**

### 8.0 What the evidence says about a rewarding visual at all

Returned 2026-08-31. **The instinct to add a visual is supported; the specific
encoding is not.**

**Gamification is not the problem, and the usual objection to it is
over-claimed.** Sailer & Homner's meta-analysis is **positive** (cognitive
**g = .49**, k=19). The undermining effect from Deci, Koestner & Ryan attaches to
**tangible, expected** rewards; *positive feedback* **enhanced** free-choice
behaviour (d = 0.33) and interest (d = 0.31), and more so for college students
than children. An unscored, unstored, non-tradeable plant is not in the indicted
category. Hanus & Fox — the study usually cited against gamification — was
**N=80, two intact non-randomised sections**, its manipulation was
**leaderboard + badges + competition** with the badges **part of the course
grade**, and "course type alone did not affect students' grades over time".
None of that describes this design.

**But two findings do bite.**

**⭐ Correctness-only feedback is the weakest signal there is.** Van der Kleij et
al. (2015): elaborated feedback **d = 0.49**, correct-answer **0.32**,
**knowledge-of-result — right/wrong alone — 0.05**, with effects *larger* for
mathematics. Corroborated by Wisniewski et al. (2020): reinforcement/punishment
**d = 0.24** against high-information **d = 0.99**. **A green flower and a red
flower are knowledge-of-result.** The design error is not that a plant is
motivating; it is that the most salient thing on the screen would carry the
least informative signal available.

**A decorative visualisation layer specifically bought stress, not learning.**
van den Broek et al. (2026), N=166, Bayesian, is the closest-matched study:
motivation rose decisively, **learning stayed flat** (BF01 = 18.99 against an
effect on delayed recall), and the *visualisation* layer over plain points
produced **stress** (BF10 = 5.16) and **distraction** (BF10 = 3.08) with no gain.
It also found a **removal cost** — a plain condition was rated worse *after* a
gamified one, meaning a plant on §1.2 makes §1.3 feel worse than if §1.2 had
never had one. **If it goes in, it should go in for the whole course, not one
section.**

**One correction to a claim made earlier in this file's own derivation.** The
batching rule was defended partly on delayed-feedback research; that support is
weaker than stated. Butler et al.'s 10-minute delay — batch scale — was **not
significant** (.73 vs .68, p = .34), and Kandemir et al. (2026) find **g = 0.01,
p = .76 for tertiary students**. **§6's batching stands on its own design
rationale** — commitment without a safety net, and misses read as a pattern —
**not on a claimed feedback-timing effect.**

**⚠⚠ CORRECTION, 2026-08-31, second research round: THE DERIVATION'S CENTRAL
OBJECTION IS NOT SUPPORTED.** This file argued that a visible performance display
makes a student watch their performance instead of thinking about the
mathematics. That is a named hypothesis in the literature — **task distraction** —
and it has been reviewed and rejected. Senko, Hulleman & Harackiewicz: **"there
is a dearth of evidence for the task distraction hypothesis. Normative goals,
like mastery goals, do not appear to distract students to any significant degree
and in some cases actually improve task focus."** The harm they locate is in
**performance-*avoidance*** goals — the motive to avoid looking bad — not in
performance being visible. Kluger & DeNisi likewise found **no moderating effect
for normative feedback**, and none for *public* feedback once time-series studies
were excluded; they flag it themselves as a failed prediction.

**And the choking studies do not say what this file implied.** In both Beilock
experiments, per-item **"Correct" / "Incorrect" feedback was on screen in every
condition, including the controls.** What produced the choking was money, team
interdependence, and being videotaped for teachers to review. Item-level
correctness signalling was held constant and was not the cause. The students'
own reported thoughts were worry, not self-monitoring — *"I am not gonna get the
money"*, *"I hope I don't look stupid"* — with **52.8%** of all reported thoughts
about the pressure situation against **12.0%** about the mathematics.

**What survives is narrower, better evidenced, and points at the red flower
specifically.** Kluger & DeNisi: **over 38% of feedback interventions made
performance worse**, and their moderator table says why — where feedback threatens
self-esteem the benefit collapses to **d = .08**, against **.47** where it does
not. Separately, **person-focused negative feedback is a measured antecedent of
performance-avoidance goals** (β = .22), and performance-avoidance predicts worse
grades (β = −.34; β = −.27; r = −.14 in education). **A red flower is
person-focused by construction: it says you were wrong and nothing about what
went wrong.** Also worth expecting little: on the most complex tasks, feedback of
this kind runs at **d = .03**.

**⭐ THE SHARPEST STATEMENT OF THE PROBLEM, AND THE BETTER FIX.** The design as
drafted "is not withholding evaluation; it is withholding *explanation* while
delivering the verdict instantly." Knowing you were wrong without yet knowing why
is the **worst-supported** configuration in this literature — it carries the
self-relevant signal without the correct-solution content that produces the
benefit, and **supplying the correct solution nearly doubles the effect
(d = .43 against .25).** So the fix is not to remove the plant and not merely to
"drop the red": **make the wrong-answer mark neutral and non-salient at the
moment of answering, and let it resolve into its final form at the batch reveal,
where the explanation arrives with it.**

**Two findings that actively favour this design.** Computer-delivered feedback
outperformed person-delivered feedback (**d = .41 against .23**), attributed to
its directing attention to the task rather than to the evaluator's intentions.
And **the absence of peer comparison matters more than anything else here**: the
two dashboard studies that show real harm both turn on seeing *other people's*
performance — completion falling **68% → 64% → 45%** as the peer work students saw
got better, and a comparison dashboard that lifted more-educated learners
(16.3 → 19.5) while nudging less-educated ones *down* (14.4 → 13.6). A private
plant provides none of that.

**Honest caution against the recommendation above.** A display that shows
*territory covered* rather than performance has **no published evidence base**:
Bodily et al. (2018) found open learner models use assessment data **100%** of the
time. It is the option most consistent with the evidence on feedback quality and
reference frames — Jivet et al. found bottom-performing learners "felt
demoralised and stressed" by **norm-referenced** displays and preferred
criterion- and self-referenced ones — but it is reasoned, not tested.

**Also practical:** the course's four themes each carry **one accent colour and
no semantic red/green pair**; the `sage` theme's two tokens are a red-brown
`#7a3b32` and a green `#4f6b52` that carry no meaning. Red and green flowers
would collide with them directly.


### 8.2 Scene themes, and which two survive a cull

Four scene palettes sit on the field, independent of the site theme, each with
its own creatures: **day** (birds), **dusk** (birds), **night** (a crescent
moon, stars, and fireflies that pulse at three different rates), **meadow**
(bees, bobbing, with fast wingbeats). A site theme picks a default &mdash; ink
opens at night, paper at day, slate at dusk, sage in the meadow &mdash; and the
teacher control overrides it.

> **[owner · visual]** Dusk looks the best. Later if I ask to choose a few, keep
> dusk and night.

**Recorded now so it is not re-argued later: if the four are ever cut down,
`dusk` and `night` are the two that stay.** Nothing is being removed today.

**⚠ The rule the contrast audit established, which any new scene must obey:**
**text colour belongs to the scene, not to the site theme.** The first version
took the palette from the scene and the type colour from the site theme, so a
light *day* scene under the dark *ink* theme rendered light text on a light sky
&mdash; a measured contrast of **1.03**. Every scene now sets its own `--ink`,
`--ink-soft` and `--ink-faint` inside `.field`.
**Any new scene must be measured, not eyeballed**, against every surface the
text can actually reach &mdash; sky, sky2, meadow, soil, hill and the far range
&mdash; and clear **4.5:1** for all three roles. Current worst case across all
four scenes is **4.69**.

### 8.1 The garden, and watering — recorded now, built later

> **[owner · visual]** Once we have the cloud part set up, we will let students
> log in and see their plants, and when they go through multiple of those it
> becomes a garden. They will have to come back and "water" the plant — meaning
> review or something — and the plants start ageing, and so on. This schedule is
> set by the teacher or the ontology of the class. For now we will just do one
> session and students can download that alongside the notes and problems they
> can practise. Then later all we have to do is connect different sessions once
> we have login.

**What this is, named plainly: the watering mechanic is spaced review.** A plant
that ages when untended and revives when returned to is a review schedule with a
face on it, and the schedule being set by the teacher or by the class ontology is
what keeps it pedagogical rather than a streak counter.

**The only part of this that constrains the work now** is that each plant's state
must be **serialisable to a small plain object** — planted, bloomed, missed,
stage, last watered — so that a later login can store it, age it against a
schedule, and re-render a whole garden without the drawing code being rewritten.
Every option being drawn must carry that object and show it.

**Deliberately not built yet:** login, storage, the garden view, ageing, and the
schedule. One session, self-contained, and a student can keep the file. Sessions
get connected once login exists. Note that this remains consistent with §6 — the
per-session activity still stores nothing; what a future login stores is the
garden, which is the student's own, not a record of their answers.

## 9. What is evidenced, and what is not

**Evidenced.** Situating the mathematics helps rather than hinders: Koedinger &
Nathan gave matched story, word-equation and symbolic versions of the same
problems and got **70% / 61% / 42%** — the story version was the *easiest*.
The `x + 5` vs `5x` discrimination, the repeated-addition-vs-multiplication swap,
and the missing process reading of exponents are all measured, at scale, and are
catalogued in `~/Documents/AGENT_FINDING_LOG.md` under 2026-08-30.

**Not evidenced, and known to be ours.** The item asking what each number in
`3x²` separately counts **exists in no published instrument** — confirmed across
OATutor's 13,287 problems, 90 NAEP items, TIMSS, PISA, Smarter Balanced and
PARCC. It is original and untested. So is the bookstore thread as a whole, the
tree, and the numeric-rehearsal repair in §3.2.

**Prevalence caveat.** Almost every rate quoted here is from students in grades
8–11 and mostly not US. Weber is the college-level exception and it is n=15.

## 10. Open questions

**All four research questions returned 2026-08-31 and are closed.** What is left
below needs the owner. The research answers are recorded in the sections named,
and in `~/Documents/AGENT_FINDING_LOG.md`.

**Closed by research — read the section, do not re-open the question:**

1. ~~Where does `x²` enter?~~ **§3.3.** *Not* from price-times-quantity — in every
   published business quadratic the variable is the **price**, and nobody builds
   one at the polynomial-arithmetic stage. **Keep revenue linear; introduce `x²`
   as an `x`-by-`x` array on the PISA APPLES model, with `8n` in the same
   picture.** The magic-box judgement is upheld on stronger grounds.
2. ~~Is derive-by-expansion better, and how does it bridge past positive
   integers?~~ **§4, §4.1, §4.2.** Weber's follow-up **was** published
   (ERIC ED471763) and it tested this worksheet on **a college algebra course**:
   not one control student could explain any exponent rule. Four published
   bridges exist for `x⁰` and fractional exponents; the "reinterpret what is
   counted" family keeps this course's register. **The notes already do most of
   it** — the sharp gap is that `x²+x²` and `x²·x²` are three objectives apart.
3. ~~What should the plant depict?~~ **§8, §8.0.** One plant, accumulating —
   ruled by the owner and, as it happens, the best-evidenced configuration.
   **Bloom at batch boundaries, and drop the red**: those two changes are what the
   evidence actually supports. Branching is the `2ⁿ` picture and should not be
   built except as a contrast.
4. ~~How is the "students propose the tool" moment structured?~~ **§3.2.**
   Problem-first survives and is *strongest* for the lowest-achieving third, but
   it is **null on procedural knowledge**, so the activity is justified
   conceptually only. Three defects fixed; the numeric repair withdrawn and
   replaced.

**Still open, and the owner's to settle:**

5. **⭐ There is no course objective a meaning question can attach to.**
   `data/objectives.json` is uniformly manipulation-framed — Solve 36, Find 21,
   Evaluate 8, Calculate 8, Identify 7, and not one *explain*, *interpret*,
   *represent* or *describe*. `STYLE.md` makes objectives source 1, so on the
   course's own terms these questions currently cover nothing. **This blocks the
   activity from entering the repo.** Recorded as `COURSE_LOG.md` §5.1 q8.
6. ~~**Does deriving before naming violate `STYLE.md` rule 12?**~~ **Answered
   2026-08-31, pending the owner's assent: rule 12 governs what students
   *read* — the notes — not what happens live in an activity.** The notes stay
   rule-first; the activity may derive first. No conflict.
7. **Format and time budget.** In-class activity, the web page, or the §1.2
   notes — and how many minutes. This decides how much story is affordable.
8. **How far does the bookstore stretch?** It is settled through §1.6. Whether it
   carries into §2 and beyond, or hands off, is undecided.
