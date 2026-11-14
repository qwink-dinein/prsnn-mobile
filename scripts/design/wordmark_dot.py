"""Generates preview/wordmark-dot.html: 'prsnn.' in a heavy geometric sans (the owner's
'arcture' reference), with a round champagne full stop from the approved palette.
Four close Google fonts, a dot-colour study, app icons and real-use mock-ups.
Run: python3 scripts/design/wordmark_dot.py"""
import base64, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
PHOTO = 'data:image/jpeg;base64,' + base64.b64encode((ROOT / 'assets/images/evening.jpg').read_bytes()).decode()
P, W, M, MUT, C, CD, CM = '#F1F1F4', '#FFFFFF', '#181B34', '#6B6E85', '#C9B68E', '#8E7646', '#F6F1E6'

FONTS = [  # (name, css family, weight, tracking em, note)
  ('Outfit', 'Outfit', 700, -.045, 'The closest match: perfectly round bowls, flat ends, compact and confident.'),
  ('Urbanist', 'Urbanist', 800, -.04, 'The app’s own font at extra-bold, so logo and screens are one family.'),
  ('Sora', 'Sora', 700, -.05, 'Slightly wider and more technical, very stable at small sizes.'),
  ('Red Hat Display', 'Red Hat Display', 800, -.035, 'Warmer, with softer joins; friendly but still premium.'),
]

def mark(fam, wt, tr, ink, s, dot=C):
    d = s * .2  # dot diameter
    return (f'<span style="display:inline-flex;align-items:baseline;font:{wt} {s}px/1 \'{fam}\';letter-spacing:{tr}em;color:{ink}">prsnn'
            f'<i style="display:inline-block;width:{d}px;height:{d}px;border-radius:50%;background:{dot};margin-left:{s * .045}px"></i></span>')

def icon(fam, wt, bg, ink, dot, size=96):
    s = size * .62; d = s * .2
    return (f'<div class="ic" style="width:{size}px;height:{size}px;border-radius:{size * .225}px;background:{bg}">'
            f'<span style="display:inline-flex;align-items:baseline;font:{wt} {s}px/1 \'{fam}\';color:{ink};margin-top:-{size * .1}px">p'
            f'<i style="display:inline-block;width:{d}px;height:{d}px;border-radius:50%;background:{dot};margin-left:{s * .05}px"></i></span></div>')

def font_card(f, pick):
    name, fam, wt, tr, note = f
    m = lambda ink, s, dot=C: mark(fam, wt, tr, ink, s, dot)
    return (f'<section class="c"><div class="big">{m(M, 112)}</div><div class="strip">'
            f'<div class="u" style="background:{M}">{m(P, 50)}</div>'
            f'<div class="u app"><div class="bar">{m(M, 22, CD)}<span class="bell"></span></div><div class="lines"><i></i><i></i></div></div>'
            f'<div class="u icons">{icon(fam, wt, M, P, C, 78)}{icon(fam, wt, W, M, C, 78)}</div></div>'
            f'<div class="cap"><h2>{name}{" <small>My pick</small>" if pick else ""}</h2><p>{note}</p></div></section>')

BEST = FONTS[0]
bm = lambda ink, s, dot: mark(BEST[1], BEST[2], BEST[3], ink, s, dot)
DOTS = [('Champagne', C, 'Soft and premium; on light backgrounds it is gentle rather than loud.'),
        ('Deep champagne', CD, 'Stronger on white and porcelain, still warm. Best for small sizes on light screens.'),
        ('Midnight', M, 'One colour only: the most restrained, the dot just ends the word.')]
dot_study = ''.join(f'<div class="dot"><div class="pair"><div class="half" style="background:{P}">{bm(M, 58, col)}</div>'
                    f'<div class="half" style="background:{M}">{bm(P, 58, C if col == M else col)}</div></div><b>{n}</b><span>{hx}</span><p>{why}</p></div>'
                    for n, col, why in DOTS for hx in [col])

uses = (f'<div class="use photo" style="background:url({PHOTO}) center 40%/cover"><div class="shade"></div><div style="position:relative">{bm("#FAF9F6", 64, C)}</div></div>'
        f'<div class="use card"><div class="biz">{bm(M, 34, CD)}<div class="who"><b>Alex Rivera</b><span>Guest relations</span><span>hello@prsnn.com</span></div></div><div class="biz dark">{bm(P, 40, C)}</div></div>'
        f'<div class="use splash"><div class="phone">{bm(P, 40, C)}</div><div class="phone light">{bm(M, 40, CD)}</div></div>')

CSS = f'''*{{box-sizing:border-box}}body{{margin:0;background:{P};font-family:Urbanist,sans-serif;color:{M}}}
.intro{{max-width:1340px;margin:0 auto;padding:40px 40px 6px}}.intro h1{{font:600 38px Urbanist;letter-spacing:-1.2px;margin:0 0 8px}}.intro p{{margin:0;max-width:76ch;line-height:1.6;color:{MUT};font-size:16px}}
h3{{max-width:1340px;margin:26px auto 0;padding:0 40px;font:600 22px Urbanist}}
.grid{{max-width:1340px;margin:0 auto;padding:16px 40px 10px;display:grid;grid-template-columns:1fr 1fr;gap:22px}}
.c{{background:{W};border-radius:26px;padding:18px}}.big{{height:220px;background:{P};border-radius:18px;display:flex;align-items:center;justify-content:center}}
.strip{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:12px}}.u{{height:118px;border-radius:16px;display:flex;align-items:center;justify-content:center;gap:10px;position:relative;overflow:hidden;background:{P}}}
.app{{flex-direction:column;align-items:stretch;justify-content:flex-start;padding:16px}}.bar{{display:flex;justify-content:space-between;align-items:center}}.bell{{width:16px;height:16px;border-radius:5px;border:1.6px solid {M}}}
.lines{{margin-top:16px;display:flex;flex-direction:column;gap:8px}}.lines i{{display:block;height:9px;border-radius:5px;background:#DEDEE5}}.lines i+i{{width:60%}}
.ic{{display:flex;align-items:center;justify-content:center;box-shadow:0 1px 0 rgba(24,27,52,.08),0 6px 14px rgba(24,27,52,.12)}}
.cap{{padding:14px 6px 2px}}.cap h2{{font:600 20px Urbanist;margin:0 0 4px}}.cap h2 small{{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:{CM};color:{CD};margin-left:8px;vertical-align:3px}}
.cap p{{margin:0;color:{MUT};line-height:1.55;font-size:14.5px}}
.dots{{max-width:1340px;margin:0 auto;padding:16px 40px 10px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px}}
.dot{{background:{W};border-radius:22px;padding:16px}}.pair{{display:grid;grid-template-rows:1fr 1fr;gap:10px}}.half{{height:120px;border-radius:14px;display:flex;align-items:center;justify-content:center}}
.dot b{{display:block;margin-top:12px;font-size:16px}}.dot span{{font-size:12px;color:{MUT}}}.dot p{{margin:6px 0 0;color:{MUT};font-size:14px;line-height:1.5}}
.uses{{max-width:1340px;margin:0 auto;padding:16px 40px 44px;display:grid;grid-template-columns:1.2fr 1.1fr 1fr;gap:22px}}
.use{{height:300px;border-radius:22px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:16px}}.photo .shade{{position:absolute;inset:0;background:rgba(10,12,24,.42)}}
.card{{background:#DCDCE3;flex-direction:column}}.biz{{width:300px;height:118px;border-radius:6px;background:{W};box-shadow:0 10px 22px rgba(24,27,52,.18);display:flex;align-items:center;justify-content:space-between;padding:0 22px}}
.biz.dark{{background:{M};justify-content:center}}.who{{display:flex;flex-direction:column;font-size:11px;color:{MUT};text-align:right;gap:2px}}.who b{{color:{M};font-size:13px}}
.splash{{background:#DCDCE3}}.phone{{width:130px;height:270px;border-radius:24px;background:{M};display:flex;align-items:center;justify-content:center;box-shadow:0 10px 24px rgba(24,27,52,.25);border:5px solid #0A0A0A}}
.phone.light{{background:{P}}}.phone span{{transform:scale(.62)}}
'''
link = 'https://fonts.googleapis.com/css2?family=Outfit:wght@700&family=Urbanist:wght@500;600;800&family=Sora:wght@700&family=Red+Hat+Display:wght@800&display=swap'
html = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>prsnn. wordmark</title>'
        f'<link href="{link}" rel="stylesheet"><style>{CSS}</style></head><body>'
        '<div class="intro"><h1>prsnn. in a heavy geometric sans</h1><p>Set in the style of your reference: round bowls, flat-cut ends, tight spacing. The full stop is a round dot in champagne from the agreed palette. Four close fonts first, then the dot colour, then real uses.</p></div>'
        f'<div class="grid">{"".join(font_card(f, i == 0) for i, f in enumerate(FONTS))}</div>'
        f'<h3>Dot colour (shown in Outfit)</h3><div class="dots">{dot_study}</div>'
        f'<h3>In use</h3><div class="uses">{uses}</div></body></html>')
(ROOT / 'preview/wordmark-dot.html').write_text(html)
print('wrote preview/wordmark-dot.html')
