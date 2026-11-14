"""Generates preview/logo-concepts.html: four symbol + wordmark concepts for prsnn. in the
approved palette (porcelain, midnight, champagne; Urbanist). Each concept is shown as the
symbol, the lockup, the app icon, small sizes and on a photo. Run: python3 scripts/design/logo_concepts.py"""
import base64, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
PHOTO = 'data:image/jpeg;base64,' + base64.b64encode((ROOT / 'assets/images/together.jpg').read_bytes()).decode()
P, W, M, MUT, C, CD, CM = '#F1F1F4', '#FFFFFF', '#181B34', '#6B6E85', '#C9B68E', '#8E7646', '#F6F1E6'
_n = [0]
def uid(p):
    _n[0] += 1
    return f'{p}{_n[0]}'

def diamond(cx, cy, s, fill=C):
    return f'<path d="M{cx},{cy - s} L{cx + s},{cy} L{cx},{cy + s} L{cx - s},{cy} Z" fill="{fill}"/>'

# ── Symbols (each returns svg inner markup and its viewBox) ──
def face_to_face(ink, accent=C):
    """p and q facing each other: two people, one shared line between them, a spark above."""
    w, r = 18, 41
    return ('0 -30 200 180',
            f'<g fill="none" stroke="{ink}" stroke-width="{w}" stroke-linecap="round">'
            f'<circle cx="59" cy="50" r="{r}"/><path d="M18,50 V141"/>'
            f'<circle cx="141" cy="50" r="{r}"/><path d="M182,50 V141"/></g>{diamond(100, -12, 12, accent)}')

def pin_p(ink, accent=C, hole=None):
    """A p that is also a map pin: the meeting place. The counter holds a champagne diamond."""
    m = uid('m')
    return ('-4 -4 112 166',
            f'<defs><mask id="{m}"><rect x="-10" y="-10" width="130" height="180" fill="#fff"/><circle cx="52" cy="50" r="21" fill="#000"/></mask></defs>'
            f'<g fill="{ink}" mask="url(#{m})"><circle cx="52" cy="50" r="50"/>'
            f'<path d="M2,50 H32 V118 C32,134 17,152 17,152 C17,152 2,134 2,118 Z"/></g>{diamond(52, 50, 9, accent)}')

def two_seats(ink, accent=C):
    """Two arcs turned toward each other, like two people leaning into a conversation,
    with the moment between them. Reads as a p when the left arc gets a stem."""
    return ('0 0 160 160',
            f'<g fill="none" stroke="{ink}" stroke-width="16" stroke-linecap="round">'
            f'<path d="M66,22 A58,58 0 0 0 66,138"/><path d="M94,22 A58,58 0 0 1 94,138"/></g>{diamond(80, 80, 13, accent)}')

def diamond_only(ink, accent=C):
    """Control: the Hour mark, a cut diamond on its own."""
    return ('0 0 100 100', diamond(50, 50, 44, accent))

def svg(sym, ink, h, accent=C):
    vb, body = sym(ink, accent)
    x, y, vw, vh = map(float, vb.split())
    return f'<svg viewBox="{vb}" style="height:{h}px;width:{h * vw / vh}px;display:block;overflow:visible">{body}</svg>'

def word(ink, size, dot=False):
    d = f'<i style="display:inline-block;width:{size * .2}px;height:{size * .2}px;background:{C};transform:rotate(45deg);margin-left:{size * .12}px;margin-bottom:{size * .08}px"></i>' if dot else ''
    return f'<span style="font:600 {size}px/1 Urbanist;letter-spacing:-{size * .045}px;color:{ink};display:inline-flex;align-items:flex-end">prsnn{d}</span>'

def wordmark_bodoni(ink, size):
    return (f'<span style="display:inline-flex;align-items:center"><span style="font:italic 400 {size * 1.05}px/1 Bodoni Moda;color:{ink}">prsnn</span>'
            f'<i style="display:inline-block;width:{size * .26}px;height:{size * .26}px;background:linear-gradient(135deg,#F3EBD9,{C} 55%,#8C7A55);transform:rotate(45deg);margin-left:{size * .2}px"></i></span>')

CONCEPTS = [
  dict(key='f2f', name='Face to face', pick=True, sym=face_to_face,
       idea='A p and a q turned toward each other: two people meeting, sharing one line, with a small champagne spark above them. It reads as the brand’s first letter, as two people, and as a single friendly symbol that works in any language.',
       why='It shows the product in one glance, and it is symmetrical, so it looks right everywhere from a store icon to a sticker on a café door.'),
  dict(key='pin', name='The place', sym=pin_p,
       idea='A lowercase p drawn as a map pin, with a champagne diamond where the pin marks the spot. Every booking happens somewhere real and public, and that place is precious.',
       why='Pins are understood worldwide and suit the safety message (public places). It is very strong as a small icon and on maps.'),
  dict(key='lean', name='Leaning in', sym=two_seats,
       idea='Two arcs leaning toward each other, like two people in conversation, with the moment between them held as a champagne diamond.',
       why='It is the most abstract and calm, closest to fashion and hospitality brands. It tells a quieter story but is very elegant.'),
  dict(key='dia', name='The diamond', sym=diamond_only,
       idea='The Hour logo you liked: italic Bodoni wordmark with a cut champagne diamond. The diamond alone becomes the symbol.',
       why='Pure and premium, but a diamond on its own says “jewellery” more than “company”, and is harder to own as a symbol.'),
]

def card(c):
    sym = c['sym']
    lock_word = wordmark_bodoni(M, 46) if c['key'] == 'dia' else word(M, 54)
    lock = f'<div style="display:flex;align-items:center;gap:18px">{svg(sym, M, 64)}{lock_word}</div>'
    icon = lambda bg, ink, size: (f'<div style="width:{size}px;height:{size}px;border-radius:{size * .225}px;background:{bg};display:flex;align-items:center;justify-content:center;'
                                  f'box-shadow:0 8px 20px rgba(24,27,52,.16)">{svg(sym, ink, size * .52, M if bg == C else C)}</div>')
    smalls = ''.join(f'<div style="display:flex;flex-direction:column;align-items:center;gap:6px">{svg(sym, M, s)}<span>{s}px</span></div>' for s in (32, 24, 16))
    on_photo = (f'<div class="photo" style="background:url({PHOTO}) center 30%/cover"><div class="shade"></div>'
                f'<div style="position:absolute;left:20px;bottom:18px;display:flex;align-items:center;gap:12px">{svg(sym, "#FAF9F6", 34)}'
                f'{wordmark_bodoni("#FAF9F6", 26) if c["key"] == "dia" else word("#FAF9F6", 30)}</div></div>')
    return (f'<section class="c"><div class="hero"><div class="big">{svg(sym, M, 190)}</div>'
            f'<div class="txt"><h2>{c["name"]}{" <small>My pick</small>" if c.get("pick") else ""}</h2><p>{c["idea"]}</p><p class="why">{c["why"]}</p></div></div>'
            f'<div class="uses"><div class="u lockup">{lock}</div>'
            f'<div class="u icons">{icon(M, P, 104)}{icon(W, M, 104)}{icon(C, M, 104)}</div>'
            f'<div class="u small">{smalls}</div>{on_photo}</div></section>')

CSS = f'''*{{box-sizing:border-box}}body{{margin:0;background:{P};font-family:Urbanist,sans-serif;color:{M}}}
.intro{{max-width:1320px;margin:0 auto;padding:40px 40px 12px}}.intro h1{{font:600 38px Urbanist;letter-spacing:-1.2px;margin:0 0 8px}}.intro p{{margin:0;max-width:72ch;line-height:1.6;color:{MUT};font-size:16px}}
.c{{max-width:1320px;margin:22px auto;padding:34px 40px;background:{W};border-radius:28px}}
.hero{{display:grid;grid-template-columns:330px 1fr;gap:44px;align-items:center}}.big{{height:240px;display:flex;align-items:center;justify-content:center;background:{P};border-radius:22px}}
.txt h2{{font:600 26px Urbanist;letter-spacing:-.6px;margin:0 0 10px}}.txt h2 small{{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:{CM};color:{CD};margin-left:8px;vertical-align:4px}}
.txt p{{margin:0 0 10px;line-height:1.6;max-width:68ch;font-size:15.5px}}.txt .why{{color:{MUT}}}
.uses{{display:grid;grid-template-columns:1.4fr 1.2fr .9fr 1.3fr;gap:16px;margin-top:26px}}
.u{{background:{P};border-radius:18px;height:150px;display:flex;align-items:center;justify-content:center;gap:14px;padding:0 16px}}
.small{{gap:22px;color:{MUT};font-size:11px}}.photo{{position:relative;border-radius:18px;height:150px;overflow:hidden}}.shade{{position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(10,12,24,.7))}}
.icons>div{{transform:scale(.92)}}
.verdict{{max-width:1320px;margin:10px auto 40px;padding:0 40px}}.verdict h2{{font:600 24px Urbanist;margin:0 0 8px}}.verdict p{{max-width:76ch;line-height:1.65;color:{MUT};margin:0 0 8px}}
'''
link = 'https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&family=Bodoni+Moda:ital,opsz,wght@1,6..96,400&display=swap'
html = (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>prsnn logo concepts</title>'
        f'<link href="{link}" rel="stylesheet"><style>{CSS}</style></head><body>'
        '<div class="intro"><h1>A logo the whole world can love</h1><p>The best-loved logos share four things: one simple shape that means something without words, one colour is enough, it still reads at 16 pixels, and a child could draw it from memory. Each idea below is tested on the app icon, at small sizes and on a photo, in the approved palette.</p></div>'
        + ''.join(card(c) for c in CONCEPTS) +
        '<div class="verdict"><h2>Why Face to face</h2><p>It is the only idea that says what prsnn is, two people meeting, while also being the brand’s letter. The shared line between the two bowls is the company itself, and the small champagne spark above them is the moment. It is symmetrical and simple enough to draw from memory, it works in one colour, and it holds up at 16 pixels.</p>'
        '<p>The wordmark is Urbanist semibold to match the app; the champagne spark carries over the diamond you already liked from Hour. If you want the place and safety story first, The place is a strong second.</p></div></body></html>')
(ROOT / 'preview/logo-concepts.html').write_text(html)
print('wrote preview/logo-concepts.html')
