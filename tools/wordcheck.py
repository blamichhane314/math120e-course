#!/usr/bin/env python3
"""Scan every student-facing string in the activity data for the wording faults
the instructor has flagged. Run before shipping any change to the questions."""
import json,re,sys
FAULTS=[
 (r'\b(tidy|tidier|tidiest|dearer|whilst|amongst|maths|colour|realise|recognise|behaviour|centre)\b',
  'British spelling or idiom'),
 (r'(nothing like it|the whole point|which is what the|and that is what|which is not\.)',
  'editorial tag-on clause'),
 (r'\b(write what|write the number of|write the price|write the revenue)\b',
  'instruction that is not a question'),
 (r'\bwaiting to be found|largest pieces?|biggest pieces?\b', 'invented vocabulary'),
 (r'(?<!\w)\*\w|\*\*|_\w', 'stray markdown'),
 (r'\b(great|well done|nice|excellent|good job|oops|remember,)\b', 'praise or coaching'),
 (r'\b(graph|straight lines?|the lines?|curve|plot|axis|axes|slope|parabola)\b',
  'leans on graphing, which §1.2 has not reached'),
]
FILES=['data/powers.json','data/factoring.json','data/factored.json']
d={'sets':[],'ideas':{}}
for _f in FILES:
    _d=json.load(open(_f))
    d['sets']+=_d['sets']; d['ideas'].update(_d.get('ideas',{}))
bad=0
for s in d['sets']:
    for q in s['questions']:
        fields=[('stem',q['stem']),('work.why',q['work']['why'])]
        opts=q.get('opts',[])
        fields+=[(f'opt[{i}].t',o['t']) for i,o in enumerate(opts)]
        fields+=[(f'opt[{i}].d',o.get('d','')) for i,o in enumerate(opts)]
        fields+=[(f'aspect[{a["lens"]}]',a['body']) for a in q.get('aspects',[])]
        for name,val in fields:
            for pat,why in FAULTS:
                m=re.search(pat,val,re.I)
                if m:
                    bad+=1
                    print(f'  {q["id"]}.{name}: {why} — "{m.group(0)}"')
                    print(f'     …{val[max(0,m.start()-45):m.end()+30]}…')
# a distractor must never be a true statement that also gives the key's value
ident=re.compile(r'^\s*([\d\s+*-]+)=\s*(\d+)\s*$')
def _val(t):
    t=t.replace('&times;','*').replace('&middot;','*').replace('\u00d7','*').replace('\u00b7','*')
    m=ident.match(t)
    if not m: return None
    try: return (eval(m.group(1))==int(m.group(2)), int(m.group(2)))
    except Exception: return None
for s_ in d['sets']:
    for q in s_['questions']:
        key=next((o for o in q.get('opts',[]) if o.get('ok')),None)
        kv=_val(key['t']) if key else None
        if not kv: continue
        for o in q.get('opts',[]):
            if o.get('ok'): continue
            v=_val(o['t'])
            if v and v[0] and v[1]==kv[1]:
                bad+=1
                print(f'  {q["id"]}: distractor "{o["t"]}" is true and gives the key\'s value')
print(f'\n{bad} issue(s)' if bad else '\nclean')
sys.exit(1 if bad else 0)
