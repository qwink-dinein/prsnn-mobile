"""Generates preview/wordmarks.html: wordmark-only logos for prsnn. in the approved palette
(porcelain, midnight, champagne). Each is shown large, reversed, small and on a photo.
Run: python3 scripts/design/wordmarks.py"""
import base64, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
PHOTO = 'data:image/jpeg;base64,' + base64.b64encode((ROOT / 'assets/images/evening.jpg').read_bytes()).decode()
P, W, M, MUT, C, CD, CM = '#F1F1F4', '#FFFFFF', '#181B34', '#6B6E85', '#C9B68E', '#8E7646', '#F6F1E6'

def gem(size, color=C, ml=.14, mb=.06):
    return (f'<i style="display:inline-block;flex:none;width:{size}px;height:{size}px;background:{color};transform:rotate(45deg);'
            f'margin-left:{size * ml * 6}px;margin-bottom:{size * mb * 6}px"></i>')

# Each wordmark: f(ink, size) -> html. Size is the nominal font size.
def urbanist_lower(ink, s):
    return f'<span class="wm" style="font:600 {s}px/1 Urbanist;letter-spacing:-{s * .045}px;color:{ink}">prsnn</span>{gem(s * .17, C, .1, .05)}'
def urbanist_caps(ink, s):
    return f'<span class="wm" style="font:500 {s * .62}px/1 Urbanist;letter-spacing:{s * .62 * .42}px;margin-right:-{s * .62 * .42}px;color:{ink}">PRSNN</span>'
def bodoni_italic(ink, s):
    return f'<span class="wm" style="font:italic 400 {s * 1.06}px/1 Bodoni Moda;letter-spacing:-{s * .01}px;color:{ink}">prsnn</span>{gem(s * .15, C, .14, .14)}'
def didone_caps(ink, s):
    return f'<span class="wm" style="font:500 {s * .66}px/1 Bodoni Moda;font-variation-settings:\'opsz\' 24;letter-spacing:{s * .66 * .14}px;margin-right:-{s * .66 * .14}px;color:{ink}">PRSNN</span>'
def italiana_caps(ink, s):
    return f'<span class="wm" style="font:400 {s * .7}px/1 Italiana;letter-spacing:{s * .7 * .3}px;margin-right:-{s * .7 * .3}px;color:{ink}">PRSNN</span>'
def light_lower(ink, s):
    return f'<span class="wm" style="font:300 {s}px/1 Urbanist;letter-spacing:{s * .02}px;color:{ink}">prsnn</span>{gem(s * .13, C, .14, .05)}'

W_LIST = [
  dict(name='Modern', f=urbanist_lower, pick=True,
       note='Urbanist semibold, tightly set, with a champagne diamond for the full stop. Matches the app’s titles exactly, so the brand and the product feel like one thing.'),
  dict(name='Maison', f=urbanist_caps,
       note='Spaced capitals in Urbanist, the way modern fashion houses set their names. Timeless on packaging, signage and the website header.'),
  dict(name='Editorial', f=bodoni_italic,
       note='Italic Bodoni with the champagne diamond: the Hour wordmark. The most romantic and magazine-like.'),
  dict(name='Couture', f=didone_caps,
       note='High-contrast Didone capitals, the language of fashion magazines and perfume. Very luxurious, more formal.'),
  dict(name='Atelier', f=italiana_caps,
       note='Fine, airy capitals with wide spacing. Delicate and elegant, best at medium to large sizes.'),
  dict(name='Light', f=light_lower,
       note='Urbanist light, loosely set, with the diamond. Soft, calm and quiet luxury, a gentler version of Modern.'),
]

def card(x):
    f = x['f']
    row = lambda ink, s: f'<span style="display:inline-flex;align-items:flex-end">{f(ink, s)}</span>'
    return (f'<section class="c"><div class="big">{row(M, 104)}</div>'
            f'<div class="strip"><div class="u dark">{row(P, 52)}</div>'
            f'<div class="u app"><div class="bar">{row(M, 22)}<span class="bell"></span></div><div class="lines"><i></i><i></i></div></div>'
            f'<div class="u photo" style="background:url({PHOTO}) center 40%/cover"><div class="shade"></div><div style="position:relative">{row("#FAF9F6", 40)}</div></div></div>'
            f'<div class="cap"><h2>{x["name"]}{" <small>My pick</small>" if x.get("pick") else ""}</h2><p>{x["note"]}</p></div></section>')

CSS = f'''*{{box-sizing:border-box}}body{{margin:0;background:{P};font-family:Urbanist,sans-serif;color:{M}}}*{{font-variant-numeric:lining-nums}}
.intro{{max-width:1340px;margin:0 auto;padding:40px 40px 6px}}.intro h1{{font:600 38px Urbanist;letter-spacing:-1.2px;margin:0 0 8px}}.intro p{{margin:0;max-width:74ch;line-height:1.6;color:{MUT};font-size:16px}}
.grid{{max-width:1340px;margin:0 auto;padding:20px 40px 40px;display:grid;grid-template-columns:1fr 1fr;gap:22px}}
.c{{background:{W};border-radius:26px;padding:18px}}.big{{height:220px;background:{P};border-radius:18px;display:flex;align-items:center;justify-content:center}}
.strip{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:12px}}.u{{height:118px;border-radius:16px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}}
.dark{{background:{M}}}.app{{background:{P};flex-direction:column;align-items:stretch;justify-content:flex-start;padding:16px 16px}}
.bar{{display:flex;justify-content:space-between;align-items:center}}.bell{{width:16px;height:16px;border-radius:5px;border:1.6px solid {M}}}
.lines{{margin-top:16px;display:flex;flex-direction:column;gap:8px}}.lines i{{display:block;height:9px;border-radius:5px;background:#DEDEE5}}.lines i+i{{width:60%}}
.photo .shade{{position:absolute;inset:0;background:rgba(10,12,24,.42)}}
.cap{{padding:14px 6px 2px}}.cap h2{{font:600 20px Urbanist;margin:0 0 4px}}.cap h2 small{{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:{CM};color:{CD};margin-left:8px;vertical-align:3px}}
.cap p{{margin:0;color:{MUT};line-height:1.55;font-size:14.5px;max-width:62ch}}
'''
link = ('https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600&family=Bodoni+Moda:ital,opsz,wght@0,6..96,500;1,6..96,400'
        '&family=Italiana&display=swap')
html = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>prsnn wordmarks</title>'
        f'<link href="{link}" rel="stylesheet"><style>{CSS}</style></head><body><div class="intro"><h1>Wordmarks</h1><p>The name on its own, set six ways in the approved palette. Each is shown large, reversed on midnight, at app-header size and on a photo, so you can judge it where it will actually live.</p></div>'
        f'<div class="grid">{"".join(card(x) for x in W_LIST)}</div></body></html>')
(ROOT / 'preview/wordmarks.html').write_text(html)
print('wrote preview/wordmarks.html')
