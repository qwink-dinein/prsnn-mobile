"""Generates preview/logo-luxe.html: three simplified, luxury monograms for prsnn. in the
approved palette, all flat colour (no gradients or glows), each tested as wordmark lockup,
app icon, 16 px, one-colour, on a photo and as a blind-embossed card.
Run: python3 scripts/design/logo_luxe.py"""
import base64, math, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
PHOTO = 'data:image/jpeg;base64,' + base64.b64encode((ROOT / 'assets/images/evening.jpg').read_bytes()).decode()
P, W, M, MUT, C, CD, CM = '#F1F1F4', '#FFFFFF', '#181B34', '#6B6E85', '#C9B68E', '#8E7646', '#F6F1E6'
_n = [0]
def uid(p):
    _n[0] += 1
    return f'{p}{_n[0]}'

def gem(cx, cy, s, fill):
    return f'<path d="M{cx},{cy - s} L{cx + s},{cy} L{cx},{cy + s} L{cx - s},{cy} Z" fill="{fill}"/>'

# ── 1. Cut: a solid p whose counter is a cut diamond ──
def cut(ink, accent, bg, w=None):
    m = uid('cut')
    return ('0 0 100 150',
            f'<defs><mask id="{m}"><rect width="100" height="150" fill="#fff"/>{gem(56, 50, 19, "#000")}</mask></defs>'
            f'<g fill="{ink}" mask="url(#{m})"><circle cx="56" cy="50" r="44"/><rect x="12" y="50" width="26" height="96" rx="13"/></g>'
            + (gem(56, 50, 8, accent) if accent else ''))

# ── 2. Linked: a p and a q whose bowls interlock, over and under ──
def linked(ink, accent, bg, w=8):
    r, c1, c2, cy = 38, 58, 102, 56
    dy = math.sqrt(r * r - ((c2 - c1) / 2) ** 2); xi = (c1 + c2) / 2
    # q's ring passes over p's ring at the top crossing; p's ring is drawn last so it is over at the bottom.
    t = math.atan2(-dy, xi - c2); d = .42
    arc = lambda: (f'M{c2 + r * math.cos(t - d):.2f},{cy + r * math.sin(t - d):.2f} A{r},{r} 0 0 1 {c2 + r * math.cos(t + d):.2f},{cy + r * math.sin(t + d):.2f}')
    return ('0 0 160 160',
            f'<g fill="none" stroke="{ink}" stroke-width="{w}" stroke-linecap="round">'
            f'<circle cx="{c2}" cy="{cy}" r="{r}"/><path d="M{c2 + r},{cy} V150"/>'
            f'<circle cx="{c1}" cy="{cy}" r="{r}"/><path d="M{c1 - r},{cy} V150"/></g>'
            f'<path d="{arc()}" fill="none" stroke="{bg}" stroke-width="{w + 7}"/><path d="{arc()}" fill="none" stroke="{ink}" stroke-width="{w}"/>'
            + (gem(xi, cy - dy - 16, 6, accent) if accent else ''))

# ── 3. Signature: one unbroken line, stem into bowl, like a signed initial ──
def signature(ink, accent, bg, w=9):
    return ('0 0 120 160',
            f'<path d="M30,150 V60 A38,38 0 1 1 68,98 C52,98 40,90 34,80" fill="none" stroke="{ink}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'
            + (gem(68, 60, 7, accent) if accent else ''))

def svg(sym, ink, h, accent=C, bg=P, **kw):
    vb, body = sym(ink, accent, bg, **kw)
    x, y, vw, vh = map(float, vb.split())
    return f'<svg viewBox="{vb}" style="height:{h}px;width:{h * vw / vh}px;display:block;overflow:visible">{body}</svg>'

def word(ink, size, track=.34):
    return f'<span style="font:500 {size}px/1 Urbanist;letter-spacing:{size * track}px;color:{ink};margin-right:-{size * track}px">PRSNN</span>'

def word_lower(ink, size):
    return f'<span style="font:600 {size}px/1 Urbanist;letter-spacing:-{size * .04}px;color:{ink}">prsnn</span>'

CONCEPTS = [
  dict(key='cut', name='Cut', pick=True, sym=cut,
       idea='A single solid p whose counter is cut as a diamond, the way a stone is cut. One shape, one colour, nothing added.',
       why='The simplest of the three and the strongest at any size: it survives 16 pixels, embroidery, a wax seal or a laser on glass. The diamond is negative space, so it stays precious without decoration.'),
  dict(key='linked', name='Linked', sym=linked, kw=dict(w=8),
       idea='A p and a q whose bowls interlock, one over and one under, like two rings or two people arm in arm. A small champagne diamond above.',
       why='The most meaningful and the most “maison”, in the tradition of interlocking monograms. It needs a bolder cut below about 24 pixels.'),
  dict(key='sig', name='Signature', sym=signature,
       idea='One unbroken line from the stem into the bowl, finishing in a flourish, like an initial signed by hand.',
       why='Personal and warm, suits a service about people. It is quieter than Cut and less ownable at very small sizes.'),
]

def card(c):
    sym, kw = c['sym'], c.get('kw', {})
    small_kw = dict(w=12) if c['key'] in ('linked', 'sig') else {}
    lock_caps = f'<div style="display:flex;align-items:center;gap:22px">{svg(sym, M, 66, **kw)}{word(M, 30)}</div>'
    lock_low = f'<div style="display:flex;align-items:center;gap:16px">{svg(sym, M, 54, **kw)}{word_lower(M, 46)}</div>'
    icon = lambda bg, ink, acc: (f'<div class="ic" style="background:{bg}">{svg(sym, ink, 62, acc, bg, **kw)}</div>')
    smalls = ''.join(f'<div class="sm">{svg(sym, M, s, None, P, **small_kw)}<span>{s}px</span></div>' for s in (32, 24, 16))
    mono = f'<div class="u" style="background:{W}">{svg(sym, "#000", 64, None, W, **kw)}<div class="mono-word">{word("#000", 18)}</div></div>'
    photo = (f'<div class="u photo" style="background:url({PHOTO}) center 35%/cover"><div class="shade"></div>'
             f'<div style="position:relative;display:flex;align-items:center;gap:14px">{svg(sym, "#FAF9F6", 46, C, "#000", **kw)}{word("#FAF9F6", 20)}</div></div>')
    emboss = (f'<div class="u emboss"><div class="paper">{svg(sym, "#ECEBF0", 60, None, "#ECEBF0", **kw)}</div></div>')
    return (f'<section class="c"><div class="hero"><div class="big">{svg(sym, M, 200, **kw)}</div>'
            f'<div class="txt"><h2>{c["name"]}{" <small>My pick</small>" if c.get("pick") else ""}</h2><p>{c["idea"]}</p><p class="why">{c["why"]}</p>'
            f'<div class="locks"><div class="u">{lock_caps}</div><div class="u">{lock_low}</div></div></div></div>'
            f'<div class="uses"><div class="u icons">{icon(M, P, C)}{icon(W, M, C)}{icon(C, M, M)}</div><div class="u small">{smalls}</div>{mono}{photo}{emboss}</div></section>')

CSS = f'''*{{box-sizing:border-box}}body{{margin:0;background:{P};font-family:Urbanist,sans-serif;color:{M}}}
.intro{{max-width:1340px;margin:0 auto;padding:40px 40px 10px}}.intro h1{{font:600 38px Urbanist;letter-spacing:-1.2px;margin:0 0 8px}}.intro p{{margin:0;max-width:74ch;line-height:1.6;color:{MUT};font-size:16px}}
.c{{max-width:1340px;margin:22px auto;padding:34px 40px;background:{W};border-radius:28px}}
.hero{{display:grid;grid-template-columns:330px 1fr;gap:44px;align-items:center}}.big{{height:300px;display:flex;align-items:center;justify-content:center;background:{P};border-radius:22px}}
.txt h2{{font:600 26px Urbanist;letter-spacing:-.6px;margin:0 0 10px}}.txt h2 small{{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:{CM};color:{CD};margin-left:8px;vertical-align:4px}}
.txt p{{margin:0 0 10px;line-height:1.6;max-width:70ch;font-size:15.5px}}.txt .why{{color:{MUT}}}
.locks{{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}}
.uses{{display:grid;grid-template-columns:1.25fr .85fr .8fr 1.1fr .8fr;gap:14px;margin-top:22px}}
.u{{background:{P};border-radius:18px;height:140px;display:flex;align-items:center;justify-content:center;gap:12px;padding:0 14px;position:relative;overflow:hidden}}
.ic{{width:88px;height:88px;border-radius:20px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 0 rgba(24,27,52,.08),0 6px 16px rgba(24,27,52,.10)}}
.small{{gap:20px}}.sm{{display:flex;flex-direction:column;align-items:center;gap:6px;color:{MUT};font-size:11px}}
.mono-word{{position:absolute;bottom:12px}}.photo .shade{{position:absolute;inset:0;background:rgba(10,12,24,.45)}}
.emboss{{background:#DADAE0}}.paper{{width:150px;height:96px;background:#F7F7F9;border-radius:4px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 14px rgba(24,27,52,.18)}}
.paper svg{{filter:drop-shadow(-1.5px -1.5px 0 rgba(255,255,255,1)) drop-shadow(1.5px 2px 0.5px rgba(24,27,52,.28))}}
.verdict{{max-width:1340px;margin:10px auto 40px;padding:0 40px}}.verdict h2{{font:600 24px Urbanist;margin:0 0 8px}}.verdict p{{max-width:78ch;line-height:1.65;color:{MUT};margin:0 0 8px}}
'''
html = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>prsnn luxury monograms</title>'
        '<link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600&display=swap" rel="stylesheet">'
        f'<style>{CSS}</style></head><body><div class="intro"><h1>Luxury, simplified</h1><p>Three monograms in the way luxury houses build marks: one shape, flat colour only, no gradients or glows, and a quiet wordmark in two styles (spaced capitals for print and packaging, lowercase for the app). Each is tested as an app icon, at 16 pixels, in one colour, on a photo and blind-embossed on a card.</p></div>'
        + ''.join(card(c) for c in CONCEPTS) +
        '<div class="verdict"><h2>Why Cut</h2><p>Luxury is what remains when everything unnecessary is taken away. Cut is one silhouette: a p, with its counter cut as a diamond. It is unmistakable at 16 pixels, works in one colour on anything, embosses beautifully, and the diamond carries the champagne idea you liked without any added ornament.</p>'
        '<p>Use spaced capitals “PRSNN” beside it on packaging, cards and the website header, and lowercase “prsnn” in the app. If you want more meaning (two people), Linked is the richer second choice.</p></div></body></html>')
(ROOT / 'preview/logo-luxe.html').write_text(html)
print('wrote preview/logo-luxe.html')
