"""Verify the authoring contract in data/solutions.json.

The contract: step N+1 is the whole expression as it stands after every mark in
step N has been substituted. So applying step N's substitutions and stripping
the marks must reproduce step N+1 with its marks stripped. A mismatch is an
authoring bug of exactly the kind that produced "7(3) -> 73" before.
"""
import json, re, sys

def find_marks(tex):
    """Yield (start, end, id, content) for each \\C{id}{content}, brace-matched."""
    out = []
    i = 0
    while True:
        j = tex.find('\\C{', i)
        if j < 0:
            return out
        k = tex.index('}', j + 3)
        ident = tex[j + 3:k]
        if k + 1 >= len(tex) or tex[k + 1] != '{':
            i = k + 1
            continue
        depth, m = 0, k + 1
        while m < len(tex):
            if tex[m] == '{':
                depth += 1
            elif tex[m] == '}':
                depth -= 1
                if depth == 0:
                    break
            m += 1
        out.append((j, m + 1, ident, tex[k + 2:m]))
        i = m + 1

def strip_marks(tex):
    while True:
        marks = find_marks(tex)
        if not marks:
            return tex
        s, e, _, content = marks[0]
        tex = tex[:s] + content + tex[e:]

def apply_step(step):
    """step's tex with every mark replaced by what it becomes."""
    tex = step['tex']
    clicks = step.get('clicks') or {}
    while True:
        marks = find_marks(tex)
        if not marks:
            return tex
        s, e, ident, content = marks[0]
        rep = clicks[ident]['to'] if ident in clicks else content
        tex = tex[:s] + rep + tex[e:]

def norm(t):
    t = t.replace('\\left', '').replace('\\right', '')
    return re.sub(r'\s+', '', t)

def main(path):
    data = json.load(open(path))
    bad, checked, chains = [], 0, 0
    for key, val in data.items():
        if key.startswith('_'):
            continue
        for chain in ([val] if isinstance(val, dict) else val):
            chains += 1
            name = key + (f" [{chain.get('label')}]" if chain.get('label') else '')
            steps = chain['steps']
            for n in range(len(steps) - 1):
                got = norm(apply_step(steps[n]))
                want = norm(strip_marks(steps[n + 1]['tex']))
                checked += 1
                if got != want:
                    bad.append((name, n + 1, got, want))
            # every id named in clicks must exist as a mark in that step
            for n, st in enumerate(steps):
                ids = {m[2] for m in find_marks(st['tex'])}
                named = set((st.get('clicks') or {}).keys())
                if named - ids:
                    bad.append((name, n + 1, f'clicks name missing marks {named-ids}', ''))
            if (steps[-1].get('clicks') or {}):
                bad.append((name, len(steps), 'final step still has clicks', ''))

            # Every letter a chain substitutes must be shown as a given, and
            # every given must be used. A value arriving with nothing on screen
            # to justify it is the bug this catches.
            subbed = set()
            for st in steps:
                for ident, spec in (st.get('clicks') or {}).items():
                    if spec.get('kind') != 'eval.substitute':
                        continue
                    for _, _, mid, content in find_marks(st['tex']):
                        if mid == ident:
                            subbed.add(content.strip())
            shown = {str(g).split('=')[0].strip() for g in (chain.get('given') or [])}
            if subbed - shown:
                bad.append((name, 0, f'substitutes {sorted(subbed-shown)} with no given', ''))
            if shown - subbed:
                bad.append((name, 0, f'given {sorted(shown-subbed)} never substituted', ''))

    print(f'{chains} chains, {checked} step transitions checked')
    if not bad:
        print('ALL CONSISTENT')
        return 0
    print(f'\n{len(bad)} PROBLEM(S):')
    for name, n, got, want in bad:
        print(f'\n  {name}  step {n} -> {n+1}')
        print(f'    after substitution : {got}')
        print(f'    next step says     : {want}')
    return 1

if __name__ == '__main__':
    sys.exit(main(sys.argv[1]))
