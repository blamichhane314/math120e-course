# Writing practice questions for MATH 120E

You are writing **original** practice questions for a first-course college
mathematics class, to be published on the instructor's own course site. They
replace a publisher's exercise set that cannot be republished.

Write questions from the objective, not from anyone else's exercises. Do not
adapt, reword, renumber, or change the values in an existing problem. The
objective text and the skill it names are the entire brief.

## What to produce

For each objective you are given, write **four** questions: three that a student
should be able to do after the lesson, and one harder one that combines the
objective with something earlier in the course.

Vary the form. A page of eight identical fill-in-the-blank prompts teaches less
than a mix, and the real assignments mix compute, multiple choice, fill-in and
multi-part.

## The schema

Output a JSON object keyed by section id. Each question:

```json
{ "id": "1.1/O3/q1",
  "obj": "1.1/O3",
  "level": "core",
  "kind": "compute",
  "stem": [
    {"t":"text","v":"Simplify."},
    {"t":"math","tex":"12-3\\cdot 2^{2}","display":true}
  ],
  "answer": {"kind":"compute","slots":[{"size":5}],"note":"type an integer"},
  "key": "0",
  "why": "exponent, then multiplication, then subtraction"
}
```

`level` is `core` or `stretch`. `key` is the correct answer as a plain string,
or the index of the correct option for a choice. `why` is one sentence naming
the reasoning — it is shown after an attempt, so write it as an explanation, not
as a restatement of the answer.

### Content blocks

```
{"t":"text","v":"prose, with inline math in dollars like $x \\le 4$"}
{"t":"math","tex":"\\frac{x^{2}-9}{x+3}","display":true}
{"t":"numberline","min":-10,"max":10,"step":2,
 "intervals":[{"from":4,"to":null,"openFrom":false}]}
{"t":"table","cols":["x","y"],"rows":[[1,2]],"numeric":true}
```

On a number line, `"to": null` runs to infinity and `openFrom`/`openTo` give a
hollow endpoint.

### Answer components

```
{"kind":"compute","slots":[{"label":"optional","size":5,"unit":null}],"note":null}
{"kind":"fill","template":"The vertex is ( ⟨0⟩ , ⟨1⟩ ).","slots":[{"size":4},{"size":4}]}
{"kind":"choice","options":[ [ …blocks… ], [ …blocks… ] ],"multi":false}
{"kind":"multipart","parts":[{"label":"(a)","stem":[…],"answer":{…}}]}
```

An option is a list of blocks, so an option can be an expression or a figure.

## Distractors carry the diagnosis

For every multiple-choice question, each wrong option must be **the answer a
student gets by making a specific, nameable error** — never a random number.
Record it:

```json
"diag": { "0": "sticky sign: reads the minus as part of the base",
          "2": "left to right: subtracts before multiplying" }
```

Errors worth building on, all documented in the mathematics-education
literature for exactly this material:

- **sticky sign** — reading `-9^{2}` as `(-9)^{2}`. Survives into calculus.
- **left to right** — evaluating in reading order rather than by precedence
- **the fraction bar does not group** — dividing only the last term
- **conjoining** — `2 + 3x` becoming `5x`, from "every sum has an answer"
- **the letter as an object** — `3a` read as "three apples", giving `6x^{2}+4x = 10x^{3}`
- **distributing over everything** — `(a+b)^{2} = a^{2}+b^{2}`, `\sqrt{a+b} = \sqrt a + \sqrt b`
- **sign lost across a subtracted bracket** — `(8y-2)-(7y+5)` dropping the second minus
- **an endpoint included that a strict inequality excludes**
- **the inequality not flipped** when multiplying or dividing by a negative

## Rules

- **Numbers must work out.** Verify every answer by hand before writing it down.
  Prefer integers and simple fractions; a question whose answer is `-17/23`
  tests arithmetic stamina rather than the objective.
- **Valid KaTeX**: `\frac{}{}` `^{}` `_{}` `\sqrt[n]{}` `\le` `\ge` `\ne`
  `\cdot` `\pm` `\infty`. No `$` inside a `tex` field.
- **One skill per question.** If a student can fail it for two unrelated
  reasons, the result tells you nothing.
- **Plain language.** Short sentences, no invented context that has to be waded
  through before the mathematics starts.
- Do not number questions in the stem text; the interface does that.

## Output

Write your file, then reply with a short summary only: how many questions, the
spread of kinds, and any objective you found hard to write for. Do not paste the
JSON.
